import Client, { CLIENT_EVENTS } from '@walletconnect/client';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import moment from 'moment';
import * as encoding from '@walletconnect/encoding';

import {
  DEFAULT_APP_METADATA,
  DEFAULT_CHAINS,
  DEFAULT_COSMOS_METHODS,
  DEFAULT_EIP155_METHODS, DEFAULT_LOGGER,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  DEFAULT_SOLANA_METHODS,
} from '../consts';
import { ERROR, getAppMetadata } from '@walletconnect/utils';
import { getPublicKeysFromAccounts } from '../helpers/solana';
import { useDispatch } from 'react-redux';
import { userAction } from '../store/actions';
import { sleep } from '../utils';
import { toast } from 'react-toastify';
import {AccountBalances} from "../helpers";
import {apiGetAccountBalance} from "../helpers/api";
import {infuraGetAccountBalance} from "../helpers/infura-api";

const loadingTimeout = 5; // seconds
const SIGNATURE_PREFIX = 'NDJ_SIGNATURE_V2_';
const NDJ_ADDRESS = 'NDJ_ADDRESS_V2';

/**
 * Types
 */
interface IContext {
  initialized: boolean;
  qrCodeUri: string | undefined;
  client: Client | undefined;
  session: SessionTypes.Created | undefined;
  connect: (pairing?: { topic: string }) => Promise<void>;
  disconnect: () => Promise<void>;
  switchAccount: (account: string) => Promise<void>;
  isInitializing: boolean;
  chains: string[];
  pairings: string[];
  isLoading: boolean;
  account: string | undefined;
  accounts: string[];
  solanaPublicKeys?: Record<string, PublicKey>;
  balances: AccountBalances;
  setChains: any;
}

/**
 * Context
 */
export const ClientContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function WalletConnectProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [client, setClient] = useState<Client>();
  const [pairings, setPairings] = useState<string[]>([]);
  const [session, setSession] = useState<SessionTypes.Created>();
  const dispatch = useDispatch();

  const [qrCodeUri, setQRCodeUri] = useState<string>();
  const [initialized, setInitialized] = useState(false);
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState<string>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [solanaPublicKeys, setSolanaPublicKeys] = useState<Record<string, PublicKey>>();
  const [chains, setChains] = useState<string[]>(DEFAULT_CHAINS);

  const [balances, setBalances] = useState<AccountBalances>({});

  const reset = () => {
    setPairings([]);
    setQRCodeUri(undefined);
    setBalances({});
    setSession(undefined);
    setAccount(undefined);
    setAccounts([]);
    setChains(DEFAULT_CHAINS);

    for (var i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(SIGNATURE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem(NDJ_ADDRESS);
  };

  const getAccountBalances = async (_accounts: string[]) => {
    setIsFetchingBalances(true);
    try {
      const arr = await Promise.all(
          _accounts.map(async account => {
            const [namespace, reference, address] = account.split(":");
            const chainId = `${namespace}:${reference}`;
            const assets = await infuraGetAccountBalance(address, chainId);
            //const assets = await apiGetAccountBalance(address, chainId);
            console.info(`fetching account for chainId ${chainId} : ${address} balance = ${assets.symbol} ${assets.balance}`)
            return { account, assets: [assets] };
          }),
      );

      const balances: AccountBalances = {};
      arr.forEach(({ account, assets }) => {
        balances[account] = assets;
      });
      setBalances(balances);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingBalances(false);
    }
  };

  const getSupportedNamespaces = useCallback(() => {
    const supportedNamespaces: string[] = [];
    chains.forEach(chainId => {
      const [namespace] = chainId.split(':');
      if (!supportedNamespaces.includes(namespace)) {
        supportedNamespaces.push(namespace);
      }
    });

    return supportedNamespaces;
  }, [chains]);

  const getSupportedMethods = (namespaces: string[]) => {
    const supportedMethods: string[] = namespaces
      .map(namespace => {
        switch (namespace) {
          case 'eip155':
            return Object.values(DEFAULT_EIP155_METHODS);
          case 'bep20':
            return Object.values(DEFAULT_EIP155_METHODS);
          case 'cosmos':
            return Object.values(DEFAULT_COSMOS_METHODS);
          case 'solana':
            return Object.values(DEFAULT_SOLANA_METHODS);
          default:
            toast.error(`No default methods for namespace: ${namespace}`);
            return [];
        }
      })
      .flat();

    return supportedMethods;
  };

  const onSessionConnected = useCallback(async (_client: Client, _session: SessionTypes.Settled) => {
    setSession(_session);
    setChains(_session.permissions.blockchain.chains);
    setAccounts(_session.state.accounts);
    setSolanaPublicKeys(getPublicKeysFromAccounts(_session.state.accounts));
    await getAccountBalances(_session.state.accounts);
    //setWeb3Provider(_session.)
  }, []);

  useEffect(() => {
    if (!accounts.length) {
      return;
    }

    const account = localStorage.getItem(NDJ_ADDRESS);

    if (!accounts.length) {
      return;
    }

    const availableAccounts = accounts.filter(a => !a.startsWith('solana'));
    if (account && availableAccounts.includes(account)) {
      login(account);
    } else if (availableAccounts[0]) {
      login(availableAccounts[0]);
    } else {
      toast.error('Not available accounts');
      disconnect();
    }
  }, [accounts]);

  async function signNonce(account: string, nonce: string) {
    const [namespace, reference, address] = account.split(':');
    const message = nonce;
    const hexMsg = encoding.utf8ToHex(message, true);

    // personal_sign params
    const params = [hexMsg, address];
    // send message
    const signature = await client?.request({
      topic: session!.topic,
      chainId: `${namespace}:${reference}`,
      request: {
        method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
        params,
      },
    });

    localStorage.setItem(`${SIGNATURE_PREFIX}_${account}`, signature);
    return signature;
  }

  const login = useCallback(
    async (account: string) => {
      try {
        setIsLoading(true);
        const startTime = moment();



        // const res = await UserService.loginApi(address);
        // const nonce = res.data.nonce;
        //
        // if (!nonce) {
        //   throw new Error(res.data.message);
        // }

        // let signature = localStorage.getItem(`${SIGNATURE_PREFIX}_${account}`) as string;
        // if (!signature) {
        //   signature = await signNonce(account, nonce);
        // }
        //
        // axios.setAuthorizationToken(signature);
        // axios.setNonce(nonce);
        const [namespace, reference, address] = account.split(':');

        const duration = moment.duration(moment().diff(startTime)).asSeconds();
        const waitTime = loadingTimeout - duration;

        if (waitTime > 0) {
          await sleep(waitTime * 1000);
        }

        setAccount(account);
        localStorage.setItem(NDJ_ADDRESS, account);
        dispatch(userAction.loginSuccess({ address: address, namespace: namespace, reference: reference}));
      } catch (err: any) {
        localStorage.removeItem(`${SIGNATURE_PREFIX}_${account}`);
        toast.error(err.message);
        disconnect();
      } finally {
        setIsLoading(false);
      }
    },
    [client, session]
  );

  const connect = useCallback(
    async (pairing?: { topic: string }) => {
      try {
        if (typeof client === 'undefined') {
          throw new Error('WalletConnect is not initialized');
        }
        const supportedNamespaces = getSupportedNamespaces();
        const methods = getSupportedMethods(supportedNamespaces);

        const session = await client.connect({
          metadata: getAppMetadata() || DEFAULT_APP_METADATA,
          pairing,
          permissions: {
            blockchain: {
              chains,
            },
            jsonrpc: {
              methods,
            },
          },
        });

        onSessionConnected(client, session);
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    [chains, client, onSessionConnected, getSupportedNamespaces]
  );

  const disconnect = useCallback(async () => {
    try {
      if (typeof client === 'undefined') {
        throw new Error('WalletConnect is not initialized');
      }
      if (typeof session === 'undefined') {
        throw new Error('Session is not connected');
      }
      await client.disconnect({
        topic: session.topic,
        reason: ERROR.USER_DISCONNECTED.format(),
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [client, session]);

  const switchAccount = useCallback(
    async (_account: string) => {
      try {
        setAccount(undefined);
        if (!client) {
          throw new Error('WalletConnect is not initialized');
        }

        if (!session) {
          throw new Error('Session is not connected');
        }
        console.log('_account', _account);
        login(_account);
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [client, session]
  );

  const _subscribeToEvents = useCallback(
    async (_client: Client) => {
      if (typeof _client === 'undefined') {
        return toast.error('WalletConnect is not initialized');
      }

      _client.on(CLIENT_EVENTS.pairing.proposal, async (proposal: PairingTypes.Proposal) => {
        const { uri } = proposal.signal.params;
        setQRCodeUri(uri);
      });

      _client.on(CLIENT_EVENTS.pairing.created, async () => {
        setPairings(_client.pairing.topics);
      });

      _client.on(CLIENT_EVENTS.session.updated, (updatedSession: SessionTypes.Settled) => {
        onSessionConnected(_client, updatedSession);
      });

      _client.on(CLIENT_EVENTS.session.deleted, () => {
        reset();
      });
    },
    [onSessionConnected]
  );

  const _checkPersistedState = useCallback(
    async (_client: Client) => {
      if (typeof _client === 'undefined') {
        return toast.error('WalletConnect is not initialized');
      }
      // populates existing pairings to state
      setPairings(_client.pairing.topics);
      if (typeof session !== 'undefined') return;
      // populates existing session to state (assume only the top one)
      if (_client.session.topics.length) {
        const _session = await _client.session.get(_client.session.topics[0]);
        onSessionConnected(_client, _session);
      }
    },
    [session, onSessionConnected]
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);

      const _client = await Client.init({
        // logger: DEFAULT_LOGGER,
        relayUrl: DEFAULT_RELAY_URL,
        projectId: DEFAULT_PROJECT_ID,
        metadata: DEFAULT_APP_METADATA,
      });

      setClient(_client);
      await _subscribeToEvents(_client);
      await _checkPersistedState(_client);
      setInitialized(true);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [_checkPersistedState, _subscribeToEvents]);

  useEffect(() => {
    if (!client) {
      createClient();
    }
  }, [client, createClient]);

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      initialized,
      qrCodeUri,
      isLoading,
      account,
      accounts,
      balances,
      solanaPublicKeys,
      chains,
      client,
      session,
      connect,
      disconnect,
      setChains,
      switchAccount,
    }),
    [
      pairings,
      isInitializing,
      isLoading,
      initialized,
      qrCodeUri,
      account,
      accounts,
      balances,
      solanaPublicKeys,
      chains,
      client,
      session,
      connect,
      disconnect,
      setChains,
      switchAccount,
    ]
  );

  return (
    <ClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useWalletConnectClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    toast.error('useWalletConnectClient must be used within a WalletConnectProvider');
  }
  return context;
}
