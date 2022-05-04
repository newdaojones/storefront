import React, {useState} from 'react';
import QRIcon from '../assets/images/creditcard.svg';
import BTCIcon from '../assets/images/btcIcon.svg';
import {useDispatch, useSelector} from "react-redux";
import {selectAccountInfo, selectBuyTransaction} from "../store/selector";
import {userAction} from "../store/actions";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {ellipseAddress} from "../helpers";
import {useJsonRpc} from "../contexts/JsonRpcContext";
import {toast} from "react-toastify";

/**
 * Test code
 * https://github.com/WalletConnect/web-examples/blob/d6b87c0619bced200b35a78f728a96976ef04eb2/dapps/react-dapp-v2-with-ethers/src/App.tsx#L101
 * @constructor
 */
export const BuyPage = () => {
  const dispatch = useDispatch();
  const accountInfo = useSelector(selectAccountInfo)

  // Initialize the WalletConnect client.
  const {
    account,
    accounts,
  } = useWalletConnectClient();

  const {
    rpcResult,
    isRpcRequestPending,
    ethereumRpc,
  } = useJsonRpc();

  let transactionInfo = useSelector(selectBuyTransaction)
  // console.log(`account info - address ${accountInfo?.address} namespace ${accountInfo?.namespace}`)


  const onBuyClick = (): void => {
    console.log(`onBuy Click ${transactionInfo}`)
    dispatch(userAction.setTransactionInfoWallet(true));
    transactionInfo = true;
    onSendTransaction(account!!, accountInfo?.address!!)
  };

  const onSendTransaction = async (account: string, address: string) => {
    // FIXME mark as loading openRequestModal();
    console.log(`onSendTransaction trx from account: ${account} address: ${address}`)
    const [namespace, reference, address2] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    // Funded account 0xb0e49345BD214238681D593a1aE49CF6Bf85D8D0
    // https://kovan.etherscan.io/address/0xb0e49345BD214238681D593a1aE49CF6Bf85D8D0
    // https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/0x346fd04ddb4a0727e1a7d6ee68c752261eb8ee3c2a5b6f579f7bfcbcbd0ee034/
    await ethereumRpc.testSendTransaction(chainId, address)
        .then((res) => {
          console.info(`trxSignResult result:${res?.result} method: ${res?.method} `)
          dispatch(userAction.setTransactionInfoWallet(false));

          if (res?.valid) {
            console.info(`valid transaction result moving to purchase confirmation screen`)
            console.info(`transaction link: https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/${res.result}`)
            //TODO enable confirmation stuff
            //TODO history
          } else {
            console.info(`invalid transaction result ${res?.result}`)
            toast.error(res?.result || "Something went wrong, please try again. ");
          }

        })
        .catch((error) => {
          toast.error(error || "Something went wrong, please try again. ");
          console.log(`error on signing trx ${error} state: ${rpcResult}`)
        })

    //with await
    // const result = await ethereumRpc.testSignTransaction(chainId, address)
    // console.info(`trxSignResult ${result}`)
  };


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
