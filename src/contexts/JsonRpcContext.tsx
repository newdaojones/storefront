import { BigNumber, utils } from "ethers";
import { createContext, ReactNode, useContext, useState } from "react";
import * as encoding from "@walletconnect/encoding";
import { Transaction as EthTransaction } from "@ethereumjs/tx";
import {getLocalStorageTestnetFlag, isExceptionUnrecoverable} from "../helpers";
import { useWalletConnectClient } from "./walletConnect";
import {
  chainData,
  DEFAULT_EIP155_METHODS,
} from '../consts';
import {ITransaction} from "../helpers/tx";

/**
 * Types
 */
export interface IFormattedRpcResponse {
  method?: string;
  address?: string;
  valid: boolean;
  result: string;
  toAddress?: string;
  value?: string;
}

//type TRpcRequestCallback = (chainId: string, address: string) => Promise<IFormattedRpcResponse | null>;
type TRpcRequestCallback = (chainId: string, address: string, trx: ITransaction) => Promise<IFormattedRpcResponse | null>;

interface IContext {
  ping: () => Promise<void>;
  ethereumRpc: {
    testSendTransaction: TRpcRequestCallback;
    testSignTransaction: TRpcRequestCallback;
    testEthSign: TRpcRequestCallback;
    testSignPersonalMessage: TRpcRequestCallback;
    // testEthBalance: TRpcRequestCallback;
  };
  // cosmosRpc: {
  //   testSignDirect: TRpcRequestCallback;
  //   testSignAmino: TRpcRequestCallback;
  // };
  // solanaRpc: {
  //   testSignMessage: TRpcRequestCallback;
  //   testSignTransaction: TRpcRequestCallback;
  // };
  rpcResult?: IFormattedRpcResponse | null;
  isRpcRequestPending: boolean;
  isTestnet: boolean;
  setIsTestnet: (isTestnet: boolean) => void;
}

/**
 * Context
 */
export const JsonRpcContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function JsonRpcContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<IFormattedRpcResponse | null>();
  const [isTestnet, setIsTestnet] = useState(getLocalStorageTestnetFlag());

  const { client, session, accounts, balances, solanaPublicKeys, disconnect, enableToasts } = useWalletConnectClient();

  // const { chainData } = useChainData();

  const _createJsonRpcRequestHandler =
    (rpcRequest: (chainId: string, address: string, trx: ITransaction) => Promise<IFormattedRpcResponse>) =>
    async (chainId: string, address: string, trx: ITransaction) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      if (typeof session === "undefined") {
        throw new Error("Session is not connected");
      }
      try {
        setPending(true);
        const result = await rpcRequest(chainId, address, trx);
        setResult(result);
        return result;
      } catch (err: any) {
        console.error(`JsonRpcContext request failed. err: ${err} message: ${err?.message} result: ${err?.result}`);
        let errorResult = {
          address,
          valid: false,
          result: err?.message ?? err,
        };
        setResult(errorResult);

        if (isExceptionUnrecoverable(err)) {
          // ex topic is not valid anymore, doing a disconnect
          console.warn(`JsonRpcContext:_createJsonRpcRequestHandler unrecoverable exception. Disconnecting. `);
          await disconnect(true);
        }

        return errorResult
      } finally {
        setPending(false);
      }
    };

  const _verifyEip155MessageSignature = (message: string, signature: string, address: string) =>
    utils.verifyMessage(message, signature).toLowerCase() === address.toLowerCase();

  const ping = async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }

    try {
      setPending(true);

      let valid = false;

      try {
        await client.ping({ topic: session.topic });
        valid = true;
      } catch (e) {
        valid = false;
      }

      // display result
      setResult({
        method: "ping",
        valid,
        result: valid ? "Ping succeeded" : "Ping failed",
      });
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setPending(false);
    }
  };

  // -------- ETHEREUM/EIP155 RPC METHODS --------

  const ethereumRpc = {
    testSendTransaction: _createJsonRpcRequestHandler(async (chainId: string, address: string, trx: ITransaction) => {
      console.info(`testSendTransaction for trx chainId: ${chainId} address: ${address}`)
      const caipAccountAddress = `${chainId}:${address}`;
      const account = accounts.find((account: string) => account === caipAccountAddress);
      if (account === undefined) throw new Error(`Account for ${caipAccountAddress} not found`);
      const accountBalance = balances[account];
      //TODO improve this to get eth ethBalance instead of assuming it comes in the first spot
      const ethBalance = BigNumber.from(accountBalance[0].balance || "0");
      const gasPriceBigN = BigNumber.from(trx.gasPrice);
      const gasLimitBigN = BigNumber.from(trx.gasLimit);
      const totalGasFees = gasPriceBigN.mul(gasLimitBigN);

      console.info(`current balance is ${ethBalance} ETH. gasPrice: ${gasPriceBigN} ETH gasLimit: ${gasLimitBigN}. transaction cost: ${totalGasFees} ETH`)
      if (ethBalance.lt(totalGasFees)) {
        console.warn(`Insufficient funds for intrinsic transaction cost`);
        return {
          method: DEFAULT_EIP155_METHODS.ETH_SEND_TRANSACTION,
          address,
          valid: false,
          result: "Insufficient funds for intrinsic transaction cost",
          toAddress: trx.to,
          value: trx.value,
        };
      }

      let isEthTransaction = true;
      if (BigNumber.from(trx.value).eq(0)) {
        isEthTransaction = false;
      }

      let transactionValue = BigNumber.from(trx.value);
      const transactionCostBigN = isEthTransaction ? transactionValue.add(totalGasFees) : totalGasFees;

      console.info(`current balance is ${ethBalance} ETH. gasPrice: ${gasPriceBigN} ETH gasLimit: ${gasLimitBigN}. transaction cost: ${totalGasFees} ETH`)
      //FIXME this only works for eth, so we aren't catching the insufficient funds error for usdc here, but they are checked in the client app.
      if (ethBalance.lt(transactionCostBigN)) {
        console.warn(`Insufficient funds for transaction`);
        return {
          method: DEFAULT_EIP155_METHODS.ETH_SEND_TRANSACTION,
          address,
          valid: false,
          result: "Insufficient funds for transaction",
          toAddress: trx.to,
          value: trx.value,
        };
      }
      console.info(`committing trx to wc`)
      const result = await client!.request<string>({
        topic: session!.topic,
        chainId,
        request: {
          method: DEFAULT_EIP155_METHODS.ETH_SEND_TRANSACTION,
          params: [trx],
        },
      });
      console.info(`ETH_SEND_TRANSACTION result: ${result}`)
      return {
        method: DEFAULT_EIP155_METHODS.ETH_SEND_TRANSACTION,
        address,
        valid: true,
        result,
        toAddress: trx.to,
        value: trx.value,
      };
    }),
    testSignTransaction: _createJsonRpcRequestHandler(async (chainId: string, address: string, tx: ITransaction): Promise<IFormattedRpcResponse> => {
      const caipAccountAddress = `${chainId}:${address}`;
      const account = accounts.find((account: string) => account === caipAccountAddress);
      if (account === undefined) throw new Error(`Account for ${caipAccountAddress} not found`);
      // const tx = await formatTestTransaction(account);
      console.info(`testSignTransaction request for trx ${tx.from}`)

      const signedTx: string = await client!.request({
        topic: session!.topic,
        chainId,
        request: {
          method: DEFAULT_EIP155_METHODS.ETH_SIGN_TRANSACTION,
          params: [tx],
        },
      });
      const valid = EthTransaction.fromSerializedTx(signedTx as any).verifySignature();
      console.info(`send signTransaction result: ${signedTx} valid: ${valid}`)

      let rpcResult = {
        method: DEFAULT_EIP155_METHODS.ETH_SIGN_TRANSACTION,
        address: address,
        valid: valid,
        result: signedTx,
        toAddress: tx.to,
        value: tx.value,
      };
      setResult(result)
      return rpcResult;
    }),
    testSignPersonalMessage: _createJsonRpcRequestHandler(
      async (chainId: string, address: string) => {

        // test message
        const message = `My email is john@doe.com - ${Date.now()}`;

        // encode message (hex)
        const hexMsg = encoding.utf8ToHex(message, true);

        // personal_sign params
        const params = [hexMsg, address];

        // send message
        const signature = await client!.request<string>({
          topic: session!.topic,
          chainId,
          request: {
            method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
            params,
          },
        });

        //  split chainId
        const [namespace, reference] = chainId.split(":");

        const targetChainData = chainData[namespace][reference];

        if (typeof targetChainData === "undefined") {
          throw new Error(`Missing chain data for chainId: ${chainId}`);
        }

        const valid = _verifyEip155MessageSignature(message, signature, address);

        // format displayed result
        return {
          method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
          address,
          valid,
          result: signature,
        };
      },
    ),
    testEthSign: _createJsonRpcRequestHandler(async (chainId: string, address: string) => {
      // test message
      const message = `My email is john@doe.com - ${Date.now()}`;
      // encode message (hex)
      const hexMsg = encoding.utf8ToHex(message, true);
      // eth_sign params
      const params = [address, hexMsg];

      // send message
      const signature: string = await client!.request({
        topic: session!.topic,
        chainId,
        request: {
          method: DEFAULT_EIP155_METHODS.ETH_SIGN,
          params,
        },
      });

      //  split chainId
      const [namespace, reference] = chainId.split(":");

      // const targetChainData = chainData[namespace][reference];
      //
      // if (typeof targetChainData === "undefined") {
      //   throw new Error(`Missing chain data for chainId: ${chainId}`);
      // }

      const valid = _verifyEip155MessageSignature(message, signature, address);

      // format displayed result
      return {
        method: DEFAULT_EIP155_METHODS.ETH_SIGN + " (standard)",
        address,
        valid,
        result: signature,
      };
    }),
  };


  // -------- COSMOS RPC METHODS --------

  // const cosmosRpc = {
  //   testSignDirect: _createJsonRpcRequestHandler(async (chainId: string, address: string) => {
  //     // test direct sign doc inputs
  //     const inputs = {
  //       fee: [{ amount: "2000", denom: "ucosm" }],
  //       pubkey: "AgSEjOuOr991QlHCORRmdE5ahVKeyBrmtgoYepCpQGOW",
  //       gasLimit: 200000,
  //       accountNumber: 1,
  //       sequence: 1,
  //       bodyBytes:
  //         "0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637",
  //       authInfoBytes:
  //         "0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180112130a0d0a0575636f736d12043230303010c09a0c",
  //     };
  //
  //     // split chainId
  //     const [namespace, reference] = chainId.split(":");
  //
  //     // format sign doc
  //     const signDoc = formatDirectSignDoc(
  //       inputs.fee,
  //       inputs.pubkey,
  //       inputs.gasLimit,
  //       inputs.accountNumber,
  //       inputs.sequence,
  //       inputs.bodyBytes,
  //       reference,
  //     );
  //
  //     // cosmos_signDirect params
  //     const params = {
  //       signerAddress: address,
  //       signDoc: stringifySignDocValues(signDoc),
  //     };
  //
  //     // send message
  //     const result = await client!.request({
  //       topic: session!.topic,
  //       chainId,
  //       request: {
  //         method: DEFAULT_COSMOS_METHODS.COSMOS_SIGN_DIRECT,
  //         params,
  //       },
  //     });
  //
  //     const targetChainData = chainData[namespace][reference];
  //
  //     if (typeof targetChainData === "undefined") {
  //       throw new Error(`Missing chain data for chainId: ${chainId}`);
  //     }
  //
  //     const valid = await verifyDirectSignature(address, result.signature, signDoc);
  //
  //     // format displayed result
  //     return {
  //       method: DEFAULT_COSMOS_METHODS.COSMOS_SIGN_DIRECT,
  //       address,
  //       valid,
  //       result: result.signature,
  //     };
  //   }),
  //   testSignAmino: _createJsonRpcRequestHandler(async (chainId: string, address: string) => {
  //     // split chainId
  //     const [namespace, reference] = chainId.split(":");
  //
  //     // test amino sign doc
  //     const signDoc = {
  //       msgs: [],
  //       fee: { amount: [], gas: "23" },
  //       chain_id: "foochain",
  //       memo: "hello, world",
  //       account_number: "7",
  //       sequence: "54",
  //     };
  //
  //     // cosmos_signAmino params
  //     const params = { signerAddress: address, signDoc };
  //
  //     // send message
  //     const result = await client!.request({
  //       topic: session!.topic,
  //       chainId,
  //       request: {
  //         method: DEFAULT_COSMOS_METHODS.COSMOS_SIGN_AMINO,
  //         params,
  //       },
  //     });
  //
  //     const targetChainData = chainData[namespace][reference];
  //
  //     if (typeof targetChainData === "undefined") {
  //       throw new Error(`Missing chain data for chainId: ${chainId}`);
  //     }
  //
  //     const valid = await verifyAminoSignature(address, result.signature, signDoc);
  //
  //     // format displayed result
  //     return {
  //       method: DEFAULT_COSMOS_METHODS.COSMOS_SIGN_AMINO,
  //       address,
  //       valid,
  //       result: result.signature,
  //     };
  //   }),
  // };

  // -------- SOLANA RPC METHODS --------

  // const solanaRpc = {
  //   testSignTransaction: _createJsonRpcRequestHandler(
  //     async (chainId: string, address: string): Promise<IFormattedRpcResponse> => {
  //       if (!solanaPublicKeys) {
  //         throw new Error("Could not find Solana PublicKeys.");
  //       }
  //
  //       const senderPublicKey = solanaPublicKeys[address];
  //
  //       const connection = new Connection(clusterApiUrl(isTestnet ? "testnet" : "mainnet-beta"));
  //
  //       // Using deprecated `getRecentBlockhash` over `getLatestBlockhash` here, since `mainnet-beta`
  //       // cluster only seems to support `connection.getRecentBlockhash` currently.
  //       const { blockhash } = await connection.getRecentBlockhash();
  //
  //       const transaction = new SolanaTransaction({
  //         feePayer: senderPublicKey,
  //         recentBlockhash: blockhash,
  //       }).add(
  //         SystemProgram.transfer({
  //           fromPubkey: senderPublicKey,
  //           toPubkey: Keypair.generate().publicKey,
  //           lamports: 1,
  //         }),
  //       );
  //
  //       try {
  //         const { signature } = await client!.request({
  //           topic: session!.topic,
  //           request: {
  //             method: DEFAULT_SOLANA_METHODS.SOL_SIGN_TRANSACTION,
  //             params: {
  //               feePayer: transaction.feePayer!.toBase58(),
  //               recentBlockhash: transaction.recentBlockhash,
  //               instructions: transaction.instructions.map(i => ({
  //                 programId: i.programId.toBase58(),
  //                 data: bs58.encode(i.data),
  //                 keys: i.keys.map(k => ({
  //                   isSigner: k.isSigner,
  //                   isWritable: k.isWritable,
  //                   pubkey: k.pubkey.toBase58(),
  //                 })),
  //               })),
  //             },
  //           },
  //         });
  //
  //         // We only need `Buffer.from` here to satisfy the `Buffer` param type for `addSignature`.
  //         // The resulting `UInt8Array` is equivalent to just `bs58.decode(...)`.
  //         transaction.addSignature(senderPublicKey, Buffer.from(bs58.decode(signature)));
  //
  //         const valid = transaction.verifySignatures();
  //
  //         return {
  //           method: DEFAULT_SOLANA_METHODS.SOL_SIGN_TRANSACTION,
  //           address,
  //           valid,
  //           result: signature,
  //         };
  //       } catch (error: any) {
  //         throw new Error(error);
  //       }
  //     },
  //   ),
  //   testSignMessage: _createJsonRpcRequestHandler(
  //     async (chainId: string, address: string): Promise<IFormattedRpcResponse> => {
  //       if (!solanaPublicKeys) {
  //         throw new Error("Could not find Solana PublicKeys.");
  //       }
  //
  //       const senderPublicKey = solanaPublicKeys[address];
  //
  //       // Encode message to `UInt8Array` first via `TextEncoder` so we can pass it to `bs58.encode`.
  //       const message = bs58.encode(
  //         new TextEncoder().encode(`This is an example message to be signed - ${Date.now()}`),
  //       );
  //
  //       try {
  //         const { signature } = await client!.request({
  //           topic: session!.topic,
  //           request: {
  //             method: DEFAULT_SOLANA_METHODS.SOL_SIGN_MESSAGE,
  //             params: {
  //               pubkey: senderPublicKey.toBase58(),
  //               message,
  //             },
  //           },
  //         });
  //
  //         const valid = verifyMessageSignature(senderPublicKey.toBase58(), signature, message);
  //
  //         return {
  //           method: DEFAULT_SOLANA_METHODS.SOL_SIGN_MESSAGE,
  //           address,
  //           valid,
  //           result: signature,
  //         };
  //       } catch (error: any) {
  //         throw new Error(error);
  //       }
  //     },
  //   ),
  // };

  return (
    <JsonRpcContext.Provider
      value={{
        ping,
        ethereumRpc,
        rpcResult: result,
        isRpcRequestPending: pending,
        isTestnet,
        setIsTestnet,
      }}
    >
      {children}
    </JsonRpcContext.Provider>
  );
}

export function useJsonRpc() {
  const context = useContext(JsonRpcContext);
  if (context === undefined) {
    throw new Error("useJsonRpc must be used within a JsonRpcContextProvider");
  }
  return context;
}
