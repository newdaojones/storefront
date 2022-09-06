import React, {useEffect, useState} from 'react';
import QRIcon from '../assets/images/creditcard.svg';
import ETHIcon from '../assets/images/eth.svg';
import ProgressBase from '../assets/images/progress_base.svg';
import ProgressIcon from '../assets/images/progress_color_1.svg';
import ProgressFull from '../assets/images/progress_color.svg';
import {useDispatch, useSelector} from "react-redux";
import {
  selectAccountInfo,
  selectCreateTransaction,
  selectTickers,
  selectTransactionInProgress
} from "../store/selector";
import {userAction} from "../store/actions";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {ellipseAddress, isMobile} from "../helpers";
import {IFormattedRpcResponse, useJsonRpc} from "../contexts/JsonRpcContext";
import {toast} from "react-toastify";
import {
  AccountBalance,
  getNonZeroAccountBalance,
  getHexValueAsBigNumber,
  getHexValueAsString,
  ITransaction
} from "../helpers/tx";
import {ITransactionInfo, TransactionState} from "../models";
import {useHistory} from "react-router-dom";
import {convertTokenToUSD} from "../helpers/currency";

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
  const accountBalance = getNonZeroAccountBalance(accounts, balances);

  const transaction = useSelector(selectCreateTransaction)
  const helpMessages = ['Tap the button above to submit the signing request',
    'Switch to your wallet app and sign the transaction. Click here to open it.',
    'Sending transaction...']

  const {
    rpcResult,
    ethereumRpc,
  } = useJsonRpc();

  const [ locationKeys ] = useState("")

  useEffect(() => {
    return history.listen(location => {
      if (history.action === 'PUSH') {
      }
      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          // Handle forward event
        } else {
          console.info(`back event, clearing trx. `)
          dispatch(userAction.setTransactionInProgress(TransactionState.INITIAL));
          dispatch(userAction.unsetTransaction());
          history.push("/home");
        }
      }
    })
  }, [ locationKeys, dispatch, history])

  const onBuyClick = (): void => {
    if (transactionInProgress === TransactionState.IN_PROGRESS) {
      console.debug("skipping click while there's an ongoing trx");
      return;
    }
    dispatch(userAction.setTransactionInProgress(TransactionState.IN_PROGRESS));
    onSendTransaction(accountBalance).then(r => {})

  };

  function handleSuccessfulTransaction(res: IFormattedRpcResponse) {
    console.info(`transaction link: https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/${res.result}`)
    const transactionInfo: ITransactionInfo = {
      transaction: transaction?.transaction || null,
      transactionHash: res.result,
      paymentValueUsd: paymentValueUsd,
      paymentFeeUsd: paymentFeeUsd,
      paymentTotalUSD: paymentTotalUSD,
      date: null,
      orderTrackingId: transaction?.orderTrackingId || "n/a",
    }

    dispatch(userAction.setTransactionInfoWallet(transactionInfo));
    setTimeout(() => {
      history.push("/confirmation")
      dispatch(userAction.setTransactionInProgress(TransactionState.INITIAL));
    }, 1000);
  }

  const onSendTransaction = async (accountBalance: AccountBalance) => {
    const account = accountBalance.account;
    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    if (!transaction) {
      toast.error("Something went wrong while generating the transaction, please try again. ");
      return;
    }

    //TODO this should be moved to a redux action, with a dispatcher & reducer
    await ethereumRpc.testSendTransaction(chainId, address, transaction.transaction)
        .then((res) => {
          console.info(`trxSignResult result:${res?.result} method: ${res?.method}`)
          dispatch(userAction.setTransactionInProgress(TransactionState.FINISHED));
          if (res?.valid) {
            handleSuccessfulTransaction(res);
          } else {
            toast.error(res?.result || "Something went wrong, please try again. ");
            console.info(`valid = false. transaction result ${res?.result}`)
            dispatch(userAction.setTransactionInProgress(TransactionState.INITIAL));
          }
        })
        .catch((error) => {
          toast.error(error || "Something went wrong sending the transaction, please try again. ");
          console.log(`error on signing trx ${error} state: ${rpcResult}`)
          dispatch(userAction.setTransactionInProgress(TransactionState.FINISHED));
        })
  };

  function initializePaymentData(transaction: ITransaction) {
    let paymentFeeUsd = 0;
    let paymentValueUsd = 0;

    let paymentTotalUSD = 0;
    let paymentValueEth: string = "0";
    const token = 'ETH';
    if (transaction?.value) {
      console.log(`payment value: ${transaction?.value}`)
      paymentValueEth = getHexValueAsString(transaction?.value);

      const gasPriceNumber = getHexValueAsString(transaction?.gasPrice);
      const gasPriceUsd = convertTokenToUSD(Number(gasPriceNumber), token, tickers);
      console.info(`gasPrice ${transaction?.gasPrice}  ${transaction?.gasPrice ? gasPriceNumber : ''}WEI  = ${gasPriceNumber} ETH = ${gasPriceUsd} USD`)

      const gasLimitNumber = getHexValueAsBigNumber(transaction?.gasLimit);
      const gasLimitUsd = convertTokenToUSD(Number(gasLimitNumber), token, tickers);
      console.info(`gasLimit ${transaction?.gasLimit}  ${transaction?.gasLimit ? gasLimitNumber : ''}WEI  = ${gasLimitNumber} ETH = ${gasLimitUsd} USD`)

      const trxValueAsNumber = Number(paymentValueEth);
      const trxPriceUsd = convertTokenToUSD(trxValueAsNumber, token, tickers);

      if (trxPriceUsd && gasPriceUsd) {
        paymentValueUsd = trxPriceUsd;
        paymentFeeUsd = gasPriceUsd;
        paymentTotalUSD = trxPriceUsd + gasPriceUsd;
      } else {
        console.info(`unable to calculate total trx price in USD`);
      }

      console.debug(`transac value ${transaction?.value}  ${transaction?.value ? trxValueAsNumber : 'n/a'} ETH  = ${trxPriceUsd} USD`)
      console.debug(`payment value ${paymentTotalUSD} USD  = trx s${trxPriceUsd} USD + fee ${gasPriceUsd} USD`)
    } else {
      console.info(`transaction value not available. maybe should go back?. redirecting to /home page`)
      history.replace("/home");
    }
    return {paymentFeeUsd, paymentValueUsd, paymentTotalUSD, paymentValueEth};
  }

  //TODO all this block should be a hook or effect, and run before the view is rendered.
  let {paymentFeeUsd, paymentValueUsd, paymentTotalUSD, paymentValueEth} = initializePaymentData(transaction?.transaction!!);

  const buyProgress = transactionInProgress.valueOf();

  let animatedBuyButton = <button onClick={onBuyClick} style={{
    backgroundColor: '#615793',
    fontSize: '20px',
    borderRadius: '25px',
    margin: '10px 0px',
    cursor: 'pointer',
    justifySelf: "start",
    alignSelf: "center"
  }} className="wfullm h-16 flex items-center justify-center text-white mt-8 mb-2 ">
    {transactionInProgress === TransactionState.IN_PROGRESS ?
        <div className="thecube w-8 h-8 m-1">
          <div className="cube c1"></div>
          <div className="cube c2"></div>
          <div className="cube c4"></div>
          <div className="cube c3"></div>
        </div> :
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-white text-start font-righteous font-bold mr-2">{`Pay $${paymentTotalUSD.toFixed(2)}`}</p>
          <p className="text-white text-start text-xs mr-2">{`${paymentValueEth?.substring(0,8)} ETH`}</p>
        </div>}
  </button>;

  const helperTextMessage = <p style={{fontFamily: 'Righteous', fontStyle: 'normal'}}
               className="text-center text-xs m-4 mb-8">{helpMessages[buyProgress]}</p>

  return (
    <div className="w-full h-full flex justify-between">
      <div className="w-full flex flex-col justify-between">
        <div className="h-full mt-8 flex flex-col text-white justify-between items-center">
          <div className="flex flex-col wfullm justify-center items-center" >
            <p className="w-full mx-4 text-white text-terciary font-bold" style={{alignSelf: 'start'}}>Payment Method</p>
            {/*Credit Card*/}
            <div className="w-full flex flex-col text-black justify-between pt-5 pb-5 px-14"
                 style={{
                   minHeight: '10rem',
                   maxWidth: '20rem',
                   backgroundImage: `url(${QRIcon})`,
                   backgroundSize: "contain",
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}>
              <img style={{alignSelf: 'end'}} className="w-10 h-10" src={ETHIcon} alt=""/>
              <p style={{fontFamily: 'Montserrat', fontStyle: 'normal', color: '#8E8EA9'}} className="pt-2 text-sm">
                {`${ellipseAddress(accountInfo?.address)}`}</p>
              <div className="flex w-full justify-between"
                   style={{fontFamily: 'Righteous', fontStyle: 'normal', color: '#8E8EA9'}}>
                <p className="text-grey text-sm">notdevin.eth</p>
                <p className="text-grey text-sm">Ethereum</p>
              </div>
            </div>
          </div>

          {/*Invoice*/}
          <div className="wfullm flex items-center justify-center mb-4">
            <div style={{fontFamily: 'Righteous', fontStyle: 'normal',}}
                 className="w-full flex flex-col items-center justify-center ml-10 mr-10 bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
              <div className="w-full flex justify-between p-4">
                <p className="text-white text-start text-xs mr-2 mt-2">Items Total</p>
                <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentValueUsd.toFixed(2)}`}</p>
              </div>
              <div className="w-full flex justify-between pl-4 pr-4">
                <p className="text-white text-start text-xs mr-2 mt-2">Transaction Fee</p>
                <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentFeeUsd.toFixed(6)}`}</p>
              </div>
              <div className="flex flex-col w-full mt-4 justify-between"
                   style={{height: 1, backgroundColor: '#FFB01D', backgroundRepeat: "no-repeat"}}/>
              <div className="w-full flex justify-between p-4">
                <p className="text-white text-start text-xs mr-2 mt-2">Subtotal</p>
                <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentTotalUSD.toFixed(2)}`}</p>
              </div>
              <div className="w-full flex justify-between pl-4 pr-4 pb-6">
                <p className="text-white text-start text-base mr-2">Total Price</p>
                <p className="text-start text-terciary text-base mr-2">{`$ ${paymentTotalUSD.toFixed(2)}`}</p>
              </div>
            </div>
          </div>


          {/*Buy Button Section*/}
          <div className="flex w-full flex-col bg-footer text-white justify-end pt-4 px-14 bg-opacity-90 rounded-8xl"
               style={{}}>
            {
              animatedBuyButton
            }
            {
              // transaction progress bar / text
              <div className="flex flex-col text-center text-terciary text-xs">
                <div className="w-1/3 absolute" style={{alignSelf: 'center'}}>
                  <img className="w-full absolute mr-8" style={{alignSelf: 'center'}} src={ProgressBase} alt=""/>
                  {transactionInProgress === TransactionState.IN_PROGRESS &&
                  <img className="w-full absolute mr-8" src={ProgressIcon} alt=""/>}
                  {transactionInProgress === TransactionState.FINISHED &&
                  <img className="w-full absolute mr-8" src={ProgressFull} alt=""/>}
                </div>
                <p className="mt-4">{`${buyProgress + 1}/3`}</p>
                {
                  isMobile() && buyProgress == 1 ? <a href={"wc://"} className="">
                    {helperTextMessage}
                  </a> : helperTextMessage
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
