import React, {useState} from 'react';
import QRIcon from '../assets/images/creditcard.svg';
import BTCIcon from '../assets/images/btcIcon.svg';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectAccountInfo, selectBuyTransaction} from "../store/selector";
import {userAction} from "../store/actions";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {ellipseAddress, testSendTransaction} from "../helpers";
import Client from "@walletconnect/client";
import { providers } from "ethers";
import {web3} from "../utils/walletConnect";
import {formatTestTransaction} from "../helpers/tx";
import {useJsonRpc} from "../contexts/JsonRpcContext";

interface IFormattedRpcResponse {
  method: string;
  address: string;
  valid: boolean;
  result: string;
}

/**
 * Test code
 * https://github.com/WalletConnect/web-examples/blob/d6b87c0619bced200b35a78f728a96976ef04eb2/dapps/react-dapp-v2-with-ethers/src/App.tsx#L101
 * @constructor
 */
export const BuyPage = () => {
  // const history = useHistory();
  const dispatch = useDispatch();
  const accountInfo = useSelector(selectAccountInfo)

  // Initialize the WalletConnect client.
  const {
    client,
    session,
    disconnect,
      account,
    accounts,
    sendTrx,
  } = useWalletConnectClient();

  const {
    ethereumRpc,
  } = useJsonRpc();

  let transactionInfo = useSelector(selectBuyTransaction)
  console.log(`web 3 eth: ${web3.eth}`);

  const onBuyClick = (): void => {
    console.log(`onBuy Click ${transactionInfo}`)
    dispatch(userAction.setTransactionInfoWallet(true));
    transactionInfo = true;

    //namespace == chainId
    onSendTransaction(account!!, accountInfo?.address!!)
  };

  // const testSendTransaction: () => Promise<IFormattedRpcResponse> = async () => {
  //   if (!web3) {
  //     throw new Error("web3Provider not connected");
  //   }
  //
  //   //const { chainId } = await web3.currentProvider.();
  //   const [address] = await web3.listAccounts();
  //   const balance = await web3.getBalance(address);
  //
  //   //FIXME chainidd = 1
  //   const tx = await formatTestTransaction("eip155:" + 1 + ":" + address);
  //
  //   if (balance.lt(BigNumber.from(tx.gasPrice).mul(tx.gasLimit))) {
  //     return {
  //       method: "eth_sendTransaction",
  //       address,
  //       valid: false,
  //       result: "Insufficient funds for intrinsic transaction cost",
  //     };
  //   }
  //
  //   const txHash = await web3Provider.send("eth_sendTransaction", [tx]);
  //
  //   return {
  //     method: "eth_sendTransaction",
  //     address,
  //     valid: true,
  //     result: txHash,
  //   };
  // };

  // const testSignTransaction: () => Promise<IFormattedRpcResponse> = async () => {
  //   if (!web3Provider) {
  //     throw new Error("web3Provider not connected");
  //   }
  //
  //   const { chainId } = await web3Provider.getNetwork();
  //   const [address] = await web3Provider.listAccounts();
  //
  //   const tx = await formatTestTransaction("eip155:" + chainId + ":" + address);
  //
  //   const signature = await web3Provider.send("eth_signTransaction", [tx]);
  //   return {
  //     method: "eth_signTransaction",
  //     address,
  //     valid: true,
  //     result: signature,
  //   };
  // };

  const onSendTransaction = async (account: string, address: string) => {
    // FIXME mark as loading openRequestModal();
    //FIXME client could be null
    console.log(`sending trx for address : ${address}`)
    const [namespace, reference, address2] = account.split(":");
    const chainId = `${namespace}:${reference}`;
    const trxSendResult = await ethereumRpc.testSignTransaction(chainId, address)
    //const trxSendResult = await sendTrx(account, address, address)


    // const trxSendResult = await testSendTransaction(address, address);
    console.log(`sending trx result: ${trxSendResult}`)
  };
  const onSignTransaction = async (chainId: string, address: string) => {
    // FIXME mark as loading openRequestModal();
    // await ethereumRpc.testSignTransaction(chainId, address);
  };

  console.log(`account info - address ${accountInfo?.address} namespace ${accountInfo?.namespace}`)
  //console.log(`wc account info: ${account}`)
  console.log(`wc accounts: ${accounts}`)

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-3/4 m-10">
        <p className="text-white text-secondary font-bold">Payment Method</p>
        {/*Credit Card*/}
        <div className="flex flex-col text-black justify-between"
             style={{ paddingTop: '1rem', paddingBottom: '1.5rem', paddingLeft: '3.5rem', minHeight: '10rem', maxWidth: '20rem', paddingRight: '3.5rem', backgroundImage: `url(${QRIcon})`, backgroundSize: "contain", backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <img  style={{alignSelf: 'end'}} className="w-10 h-10" src={BTCIcon} alt=""/>
          <p style={{fontFamily: 'Montserrat', fontStyle: 'normal', color: '#8E8EA9'}} className="pt-2 text-sm">
            {`${ellipseAddress(accountInfo?.address)}`}</p>
          <div className="flex w-full justify-between" style={{fontFamily: 'Righteous', fontStyle: 'normal', color: '#8E8EA9'}} >
            <p className="text-grey text-sm">notdevin.eth</p>
            <p className="text-grey text-sm">Bitcoin</p>
          </div>
      </div>

      {/*Invoice*/}
      <div className="flex items-center justify-center mt-1">
        <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
          <div className="w-full flex justify-between p-4">
            <p className="text-white text-start text-xs mr-2 mt-2">Items Total</p>
            <p className="text-white text-start text-xs mr-2 mt-2">$ 45.00</p>
          </div>
          <div className="w-full flex justify-between pl-4 pr-4">
            <p className="text-white text-start text-xs mr-2">Transaction Fee</p>
            <p className="text-white text-start text-xs mr-2">$ 5.00</p>
          </div>
          <div className="flex flex-col w-full text-secondary mt-4 justify-between" style={{ height: 1, backgroundColor: '#FFB01D', backgroundRepeat: "no-repeat"}}/>
          <div className="w-full flex justify-between p-4">
            <p className="text-white text-start text-xs mr-2 mt-2">Subtotal</p>
            <p className="text-white text-start text-xs mr-2 mt-2">$ 50.00</p>
          </div>
          <div className="w-full flex justify-between pl-4 pr-4 pb-6">
            <p className="text-white text-start text-xs mr-2">Total Price</p>
            <p className="text-start text-secondary text-xs mr-2">$ 50.00</p>
          </div>
        </div>
      </div>

        {/*Buy Button Section*/}
        <button onClick={onBuyClick} style={{
          backgroundColor: '#615793',
          fontSize: '20px',
          padding: '10px 20px',
          borderRadius: '25px',
          margin: '10px 0px',
          cursor: 'pointer'
        }} className="w-full text-white mt-8 mb-4">
          {(transactionInfo === true) ? "Loading" :`Pay $50.00`}
        </button>
      </div>
    </div>
  );
};
