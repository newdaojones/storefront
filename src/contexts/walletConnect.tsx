import Client from '@walletconnect/sign-client';
import {PairingTypes, SessionTypes} from '@walletconnect/types';
import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {PublicKey} from '@solana/web3.js';
import moment from 'moment';
import * as encoding from '@walletconnect/encoding';

import {
  DEFAULT_APP_METADATA,
  DEFAULT_CHAINS,
  DEFAULT_EIP155_METHODS,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
} from '../consts';
import {getAppMetadata, getSdkError} from "@walletconnect/utils";
import {getPublicKeysFromAccounts} from '../helpers/solana';
import {useDispatch} from 'react-redux';
import {userAction} from '../store/actions';
import {sleep} from '../utils';
import {toast} from 'react-toastify';
import {AccountBalances} from "../helpers";
import {getRequiredNamespaces} from "../helpers/namespaces";
import {currentRpcApi} from "../helpers/tx";
import {UserService} from "../services";
import axios from "../services/axios";
import {useLocation} from "react-use";

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
  session: SessionTypes.Struct | undefined;
  connect: (pairing?: { topic: string }) => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalances: (accounts: string[]) => Promise<void>;
  switchAccount: (account: string) => Promise<void>;
  isInitializing: boolean;
  isWaitingForApproval: boolean;
  chains: string[];
  pairings: PairingTypes.Struct[];
  isLoading: boolean;
  account: string | undefined;
  accounts: string[];
  solanaPublicKeys?: Record<string, PublicKey>;
  balances: AccountBalances;
  setChains: any;
  merchantLogin: MerchantLoginStatus;
}

export interface MerchantLoginStatus {
  isMerchantUser: boolean;
  merchantExists: boolean;
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
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
  const [session, setSession] = useState<SessionTypes.Struct>();
  const dispatch = useDispatch();

  const [qrCodeUri, setQRCodeUri] = useState<string>();
  const [initialized, setInitialized] = useState(false);
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);

  const [account, setAccount] = useState<string>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [solanaPublicKeys, setSolanaPublicKeys] = useState<Record<string, PublicKey>>();
  const [chains, setChains] = useState<string[]>(DEFAULT_CHAINS);

  const [balances, setBalances] = useState<AccountBalances>({});

  const [merchantLogin, setMerchantLogin] = useState<MerchantLoginStatus>({isMerchantUser: false, merchantExists: false});

  let pathname = useLocation().pathname;

  const reset = () => {
    console.info(`resetting balances`);
    setPairings([]);
    setQRCodeUri(undefined);
    setBalances({});
    setSession(undefined);
    setAccount(undefined);
    setAccounts([]);
    setChains([]);

    for (var i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(SIGNATURE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem(NDJ_ADDRESS);
  };

  const getAccountBalances = async (_accounts: string[]) => {
    console.info(`getting account balances`)
    setIsFetchingBalances(true);
    try {

      const arr = await Promise.all(
          _accounts.map(async account => {
            const [namespace, reference, address] = account.split(":");
            const chainId = `${namespace}:${reference}`;
            const assets = await currentRpcApi.getAccountBalance(address, chainId);
            console.info(`account balance for chainId:${chainId} address:${address} \n
              --> balance = ${assets.symbol} ${assets.balance}`);
            return { account, assets: [assets] };
          }),
      );

      const balances: AccountBalances = {};
      arr.forEach(({ account, assets }) => {
        balances[account] = assets;
      });
      setBalances(balances);
    } catch (e) {
      console.error(`caught error while refreshing balances: ${e}`);
    } finally {
      setIsFetchingBalances(false);
    }
  };

  const onSessionConnected = useCallback(async (_session: SessionTypes.Struct) => {
    const allNamespaceAccounts = Object.values(_session.namespaces)
        .map(namespace => namespace.accounts)
        .flat();
    const allNamespaceChains = Object.keys(_session.namespaces);
    setSession(_session);
    setChains(allNamespaceChains);
    setAccounts(allNamespaceAccounts);
    setSolanaPublicKeys(getPublicKeysFromAccounts(allNamespaceAccounts));
    await getAccountBalances(allNamespaceAccounts);
  }, []);


  useEffect(() => {
    if (!pathname) {
      return;
    }
    if (pathname.startsWith('/storefront/merchant')) {
      merchantLogin.isMerchantUser = true
    } else {
      merchantLogin.isMerchantUser = false
    }
    setMerchantLogin(merchantLogin);

  }, [pathname]);

  function loginWithAccount(account: string, merchantLogin: MerchantLoginStatus) {
    if (!merchantLogin.isMerchantUser) {
      login(account);
    } else {
      loginWithSignedNonce(account);
    }
  }

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
      loginWithAccount(account, merchantLogin);
    } else if (availableAccounts[0]) {
      loginWithAccount(availableAccounts[0], merchantLogin);
    } else {
      toast.error('No available accounts');
      disconnect();
    }
  }, [accounts, merchantLogin]);

  async function signNonce(account: string, nonce: string) {
    const [namespace, reference, address] = account.split(':');
    const message = nonce;
    const hexMsg = encoding.utf8ToHex(message, true);

    // personal_sign params
    const params = [hexMsg, address];
    // send message
    const signature = await client?.request<string>({
      topic: session!.topic,
      chainId: `${namespace}:${reference}`,
      request: {
        method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
        params,
      },
    });

    if (signature) {
      localStorage.setItem(`${SIGNATURE_PREFIX}_${account}`, signature);
    }
    //TODO else
    return signature;
  }

  const login = useCallback(
    async (account: string) => {
      try {
        setIsLoading(true);
        const startTime = moment();

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
        console.error(`login exception: ${err} ${err?.message}. Disconnecting...`)
        toast.error(err.message);
        disconnect();
      } finally {
        setIsLoading(false);
      }
    },
    [client, session]
  );

  //TODO this should be used when we access the merchant app, as opposed to one step login when using the purchase app with no signature
  const loginWithSignedNonce = useCallback(
      async (account: string) => {
        try {
          setIsLoading(true);
          const startTime = moment();

          const [namespace, reference, address] = account.split(':');

          try {
            const loginRes = await UserService.loginApi(address);
            const memberNonce = loginRes.data.nonce;
            if (!memberNonce) {
              console.warn("not a member")
              merchantLogin.merchantExists = false
            } else {
              console.warn("merchant does exist a member")
              merchantLogin.merchantExists = true
            }
            setMerchantLogin(merchantLogin)
          } catch (e) {
            console.log(e)
          }


          const res = await UserService.nonceApi(address);
          let nonce = res.data.nonce;

          if (!nonce) {
            console.warn(`registration nonce is not valid. exit`)
            throw new Error(res.data.message);
          }

          let signature: string | null = localStorage.getItem(`${SIGNATURE_PREFIX}_${account}`) as string;
          if (!signature) {
            setIsWaitingForApproval(true);
            signature = await signNonce(account, nonce) || null;
            setIsWaitingForApproval(false);
          }
          if (signature) {
            axios.setAuthorizationToken(signature);
            axios.setNonce(nonce);
          } else {
            toast("Invalid signature")
            setIsWaitingForApproval(false);
          }

          const duration = moment.duration(moment().diff(startTime)).asSeconds();
          const waitTime = loadingTimeout - duration;

          if (waitTime > 0) {
            await sleep(waitTime * 1000);
          }

          setAccount(account);
          localStorage.setItem(NDJ_ADDRESS, account);

          dispatch(userAction.loginSuccess({ address: address, namespace: namespace, reference: reference}));
          dispatch(userAction.merchantLoginSuccess({address: address}));

        } catch (err: any) {
          localStorage.removeItem(`${SIGNATURE_PREFIX}_${account}`);
          console.error(`loginWithSignedNonce exception: ${err} ${err?.message}`)
          toast.error(`Error: ${err.message}.`);

          disconnect().then(() => console.log(`disconnect done.`));

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } finally {
          setIsLoading(false);
        }
      },
      [client, session, merchantLogin]
  );

  const connect = useCallback(
    async pairing => {
      try {
        if (typeof client === 'undefined') {
          throw new Error('WalletConnect is not initialized');
        }
        console.log("connect, pairing topic is:", pairing?.topic);
        const requiredNamespaces = getRequiredNamespaces(chains);
        console.log("requiredNamespaces config for connect:", requiredNamespaces);

        let connectParams = {
          pairingTopic: pairing?.topic,
          requiredNamespaces,
        };
        const { uri, approval } = await client.connect(connectParams);

        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
          setQRCodeUri(uri);
        }

        const session = await approval();
        console.log("Established session:", session);
        onSessionConnected(session);
      } catch (e: any) {
        toast.error(`connect error: ${e?.message || ""}`);
        disconnect().then(() => console.log(`disconnect done.`));

        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } finally {
        setIsLoading(false);
      }
    },
    [chains, client, onSessionConnected]
  );

  const disconnect = useCallback(async () => {
    try {
      if (typeof client === 'undefined') {
        throw new Error('WalletConnect is not initialized');
      }
      if (typeof session === 'undefined') {
        throw new Error('Session is not connected');
      }
      localStorage.removeItem(NDJ_ADDRESS);
      localStorage.removeItem(SIGNATURE_PREFIX);

      await client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });

      // Reset app state after disconnect.
      reset();
    } catch (err: any) {
      console.log(`disconnect error ${err?.message}`)
      //toast.error(err.message);
    }
  }, [client, session]);

  const refreshBalances = useCallback(
      async (_accounts: string[]) => {
        try {
          if (!client) {
            throw new Error('WalletConnect is not initialized');
          }
          if (!session) {
            throw new Error('Session is not connected');
          }
          await getAccountBalances(_accounts);
        } catch (err: any) {
          toast.error(`caught error while refreshing balances: ${err.message}`);
        }
      },
      [client, session]
  );

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
    [client, session, login]
  );

  const _subscribeToEvents = useCallback(
    async (_client: Client) => {
      if (typeof _client === 'undefined') {
        return toast.error('WalletConnect is not initialized');
      }
      _client.on("session_ping", args => {
        console.log("EVENT", "session_ping", args);
      });

      // _client.on("pairing_ping", async (proposal) => {
      //   //const { uri } = proposal.id
      //   //setQRCodeUri(uri);
      // });

      _client.on("pairing_ping", args => {
        console.warn(`**** pairing event. args: ${args}`);
        //FIXME should set pairing
        //setPairings(p)
        setPairings(_client.pairing.values);
      });

      _client.on("session_event", args => {
        console.log("EVENT", "session_event", args);
      });

      _client.on("session_update", ({ topic, params }) => {
        console.log("EVENT", "session_update", { topic, params });
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        onSessionConnected(updatedSession);
      });

      _client.on("session_delete", () => {
        console.log("EVENT", "session_delete");
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
      setPairings(_client.pairing.values);
      console.log("RESTORED PAIRINGS: ", _client.pairing.values);


      if (typeof session !== 'undefined') return;
      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1;
        const _session = _client.session.get(_client.session.keys[lastKeyIndex]);
        console.log("RESTORED SESSION:", _session);
        await onSessionConnected(_session);
        return _session;
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
        metadata: getAppMetadata() || DEFAULT_APP_METADATA,
      });
      console.log("CREATED CLIENT: ", _client);
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
      try {
        createClient().then(value => {
          console.debug(`client created ok: ${value}`)
        }).catch(reason => {
          console.error(`client creation failed: reason: ${reason}`)
        });
      } catch (e) {
        console.error(`client creation failed: ${e}`)
      }
    }
  }, [client, createClient]);

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      initialized,
      qrCodeUri,
      isLoading,
      isWaitingForApproval,
      account,
      accounts,
      balances,
      solanaPublicKeys,
      chains,
      client,
      session,
      connect,
      disconnect,
      refreshBalances,
      setChains,
      switchAccount,
      merchantLogin,
    }),
    [
      pairings,
      isInitializing,
      isLoading,
      isWaitingForApproval,
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
      refreshBalances,
      setChains,
      switchAccount,
      merchantLogin
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
