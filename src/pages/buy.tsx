import React from 'react';
import QRIcon from '../assets/images/creditcard.svg';
import ETHIcon from '../assets/images/eth.svg';
import {useDispatch, useSelector} from "react-redux";
import {selectAccountInfo, selectTickers, selectTransactionInProgress} from "../store/selector";
import {userAction} from "../store/actions";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {ellipseAddress} from "../helpers";
import {useJsonRpc} from "../contexts/JsonRpcContext";
import {toast} from "react-toastify";
import {AccountBalance, formatTestTransaction, getBalanceInUSD} from "../helpers/tx";
import {ITransactionInfo, TransactionState} from "../models";
import {useHistory} from "react-router-dom";
import {convertUSDtoETH} from "../helpers/currency";

function isStartOrInProgress(transactionInProgress: TransactionState) {
  return transactionInProgress == TransactionState.INITIAL || transactionInProgress == TransactionState.IN_PROGRESS;
}

/**
 * Test code
 * https://github.com/WalletConnect/web-examples/blob/d6b87c0619bced200b35a78f728a96976ef04eb2/dapps/react-dapp-v2-with-ethers/src/App.tsx#L101
 * @constructor
 */
export const BuyPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accountInfo = useSelector(selectAccountInfo)
  let transactionInProgress = useSelector(selectTransactionInProgress)
  const tickers = useSelector(selectTickers)
  const { accounts, balances } = useWalletConnectClient();
  const accountBalance = getBalanceInUSD(accounts, balances);

  const helpMessages = ['Tap the button above to submit the signing request', 'Switch to your wallet up and Sign the transaction']

  const {
    rpcResult,
    isRpcRequestPending,
    ethereumRpc,
  } = useJsonRpc();

  const onBuyClick = (): void => {
    dispatch(userAction.setTransactionInProgress(TransactionState.IN_PROGRESS));
    onSendTransaction(accountBalance).then(r => {})
  };

  const onSendTransaction = async (accountBalance: AccountBalance) => {
    const account = accountBalance.account;
    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    console.log(`onSendTransaction trx from account: ${account} address: ${address}`)

    // Funded account 0xb0e49345BD214238681D593a1aE49CF6Bf85D8D0
    // https://kovan.etherscan.io/address/0xb0e49345BD214238681D593a1aE49CF6Bf85D8D0
    // https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/0x346fd04ddb4a0727e1a7d6ee68c752261eb8ee3c2a5b6f579f7bfcbcbd0ee034/
    const transaction = await formatTestTransaction(account)

    await ethereumRpc.testSendTransaction(chainId, address, transaction)
        .then((res) => {
          console.info(`trxSignResult result:${res?.result} method: ${res?.method}`)
          dispatch(userAction.setTransactionInProgress(TransactionState.FINISHED));
          if (res?.valid) {
            console.info(`transaction link: https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/${res.result}`)
            const transactionInfo: ITransactionInfo = {
              fromAddress: res.address!!,
              toAddress: res.toAddress || "",
              value: res.value  || "n/a",
              transactionHash: res.result

            }
            dispatch(userAction.setTransactionInfoWallet(transactionInfo));
            history.push("/confirmation");
          } else {
            console.info(`valid = false. transaction result ${res?.result}`)
            toast.error(res?.result || "Something went wrong, please try again. ");
          }
        })
        .catch((error) => {
          toast.error(error || "Something went wrong, please try again. ");
          console.log(`error on signing trx ${error} state: ${rpcResult}`)
          dispatch(userAction.setTransactionInProgress(TransactionState.FINISHED));
        })
  };


  const paymentFeeUsd = 0.05;
  const paymentValueUsd = 0.20;
  const paymentTotalUSD = paymentFeeUsd + paymentValueUsd;

  const paymentValueEth = convertUSDtoETH(paymentTotalUSD, tickers);
  console.info(`payment value ${paymentTotalUSD} USD  = ${paymentValueEth} ETH`)

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full flex flex-col justify-center">
        <div className="m-10 flex flex-col text-white items-center">
          <p className="text-white text-secondary font-bold" style={{alignSelf: 'start'}}>Payment Method</p>
          {/*Credit Card*/}
          <div className="w-full flex flex-col text-black justify-between"
               style={{ paddingTop: '1rem', paddingBottom: '1.5rem', paddingLeft: '3.5rem', minHeight: '10rem', maxWidth: '20rem', paddingRight: '3.5rem', backgroundImage: `url(${QRIcon})`, backgroundSize: "contain", backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <img  style={{alignSelf: 'end'}} className="w-10 h-10" src={ETHIcon} alt=""/>
            <p style={{fontFamily: 'Montserrat', fontStyle: 'normal', color: '#8E8EA9'}} className="pt-2 text-sm">
              {`${ellipseAddress(accountInfo?.address)}`}</p>
            <div className="flex w-full justify-between" style={{fontFamily: 'Righteous', fontStyle: 'normal', color: '#8E8EA9'}} >
              <p className="text-grey text-sm">notdevin.eth</p>
              <p className="text-grey text-sm">Ethereum</p>
            </div>
        </div>

        {/*Invoice*/}
        <div className="w-full flex items-center justify-center mt-2 ml-8 mr-8">
          <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
            <div className="w-full flex justify-between p-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Items Total</p>
              <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentValueUsd}`}</p>
            </div>
            <div className="w-full flex justify-between pl-4 pr-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Transaction Fee</p>
              <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentFeeUsd}`}</p>
            </div>
            <div className="flex flex-col w-full text-secondary mt-4 justify-between" style={{ height: 1, backgroundColor: '#FFB01D', backgroundRepeat: "no-repeat"}}/>
            <div className="w-full flex justify-between p-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Subtotal</p>
              <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentTotalUSD}`}</p>
            </div>
            <div className="w-full flex justify-between pl-4 pr-4 pb-6">
              <p className="text-white text-start text-xs mr-2">Total Price</p>
              <p className="text-start text-secondary text-xs mr-2">{`$ ${paymentTotalUSD}`}</p>
            </div>
          </div>
        </div>
        </div>

        {/*Buy Button Section*/}
        <div className="flex flex-col h-full text-white justify-end ml-8 mr-8" style={{}}>
          <button onClick={onBuyClick} style={{
            backgroundColor: '#615793',
            fontSize: '20px',
            padding: '10px 20px',
            borderRadius: '25px',
            margin: '10px 0px',
            cursor: 'pointer',
            justifySelf: "end",
            alignSelf: "end"
          }} className="w-full h-16 flex items-center justify-center text-white mt-8 mb-4">
            {transactionInProgress == TransactionState.IN_PROGRESS ?
                <div className="thecube w-8 h-8 m-1">
                  <div className="cube c1"></div>
                  <div className="cube c2"></div>
                  <div className="cube c4"></div>
                  <div className="cube c3"></div>
                </div> :
                <div className="w-full flex flex-col items-center justify-center">
                  <p className="text-white text-start mr-2">{`Pay $${paymentTotalUSD}`}</p>
                  <p className="text-white text-start text-xs mr-2">{`${paymentValueEth?.toFixed(6)} ETH`}</p>
                </div>}
          </button>
          {<p style={{fontFamily: 'Righteous', fontStyle: 'normal', visibility: !isStartOrInProgress(transactionInProgress) ? 'hidden':'visible'}}
              className="text-center text-secondary text-xs m-4 mb-8">{helpMessages[transactionInProgress ? 1 : 0]}</p>
          }
        </div>
      </div>

    </div>
  );
};
