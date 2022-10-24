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
import {ellipseAddress, isMobile, toWad} from "../helpers";
import {IFormattedRpcResponse, useJsonRpc} from "../contexts/JsonRpcContext";
import {toast} from "react-toastify";
import {
  AccountBalance,
  encodeTransaction,
  getHexValueAsBigNumber,
  getHexValueAsString,
  getPreferredAccountBalance,
  ITransaction,
} from "../helpers/tx";
import {IOrder, ITransactionInfo, TransactionState} from "../models";
import {useHistory} from "react-router-dom";
import {convertTokenToUSD} from "../helpers/currency";
import {BigNumber} from "ethers";
import {formatFixed} from "@ethersproject/bignumber";
import {
    ETH_TOKEN,
    getCurrencyByToken,
    getFormattedTokenValue,
    USDC_DECIMALS,
    USDC_TOKEN
} from "../config/currencyConfig";

export interface IPaymentInformation {
  paymentValueToken: BigNumber;
  paymentValueUsd: number;
  paymentFeeUsd: number;
  paymentTotalUSD: number;
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

  const accountBalance = getPreferredAccountBalance(accounts, balances);
  const transaction = useSelector(selectCreateTransaction)

  const helpMessages = ['Tap the button above to submit the signing request',
    'Open your wallet app and sign the transaction.',
    'Sending transaction...']

  const {
    rpcResult,
    ethereumRpc,
  } = useJsonRpc();

  const [ paymentValueToken, setPaymentValueToken ] = useState(BigNumber.from(0));
  const [ paymentValueUsd, setPaymentValueUsd ] = useState(0);
  const [ paymentFeeUsd, setPaymentFeeUsd ] = useState(0);
  const [ paymentTotalUSD, setPaymentTotalUSD ] = useState(0);

  function onBackPressed() {
    console.warn(`onBackPressed event, clearing trx. `)
    dispatch(userAction.setTransactionInProgress(TransactionState.INITIAL));
    dispatch(userAction.unsetTransaction());
  }

  const onBackButtonEvent = (e: Event) => {
    e.preventDefault();
    onBackPressed();
  }

  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  useEffect(() => {
    if (!transaction || !transaction.order.trackingId || transaction.order.amount === 0) {
      console.warn(`detected invalid order: ${transaction} without tracking id or valued 0. Going back to home.`);
      onBackPressed();
      return;
    }

    if (transaction && accountBalance && paymentValueUsd === 0) {
      if (!accountBalance.token) {
        toast.error("Invalid or empty token found. Cannot initialize payment data");
        return;
      }
      console.warn(`calculating prices for trx order token:${transaction.order.token} amount:${transaction.order.amount} txValue:${transaction.transaction.value} `)
      try {
        const paymentInfo = initializePaymentData(accountBalance, transaction.order, transaction.transaction);
        setPaymentFeeUsd(paymentInfo.paymentFeeUsd);
        setPaymentValueUsd(paymentInfo.paymentValueUsd);
        setPaymentValueToken(paymentInfo.paymentValueToken);
        setPaymentTotalUSD(paymentInfo.paymentTotalUSD);
      } catch (e) {
        toast.error(`Error: ${e}`);
      }
    }
  }, [transaction])

  useEffect(() => {
    //TODO
    if (transactionInProgress === TransactionState.IN_PROGRESS) {
      // check for transaction in the network
      //FIXME enable pending transaction checks to avoid double spends
      // dispatch(userAction.getPendingTransactions({address: getAccountAddress(accountBalance.account)}));
    }

  }, [transactionInProgress]);


  const onBuyClick = async (): Promise<void> => {
    if (transactionInProgress === TransactionState.IN_PROGRESS) {
      console.debug("skipping click while there's an ongoing trx");
      return;
    }
    if (!accountBalance) {
      toast.error("Error fetching account balance. Please try again later.");
      return;
    }

    dispatch(userAction.setTransactionInProgress(TransactionState.IN_PROGRESS));
    if (!transaction?.order.trackingId || !transaction?.order.toAddress || !transaction?.order.amount) {
      toast.error(`Invalid order data ${transaction?.order}`);
      return;
    }

    console.warn(`updating transaction ${transaction.transaction}`);
    const token = transaction?.order.token;
    const updatedTransaction = await encodeTransaction(accountBalance.account, transaction?.order.toAddress, transaction?.order.amount,
        token, transaction?.order.trackingId)

    console.warn(`updated- transaction ${transaction.transaction}`);

    //FIXME maybe need to wait for this dispatch to be done before doing onSendTransaction, although it uses a local variable.
    dispatch(userAction.setCreateTransaction({
      account: accountBalance.account,
      toAddress: transaction?.order.toAddress,
      amount: transaction?.order.amount,
      token: transaction?.order.token,
      orderTrackingId: transaction?.order.trackingId
    }));

    onSendTransaction(accountBalance, updatedTransaction).then(_ => {
    });
  };

  function handleSuccessfulTransaction(res: IFormattedRpcResponse) {
    console.info(`transaction link: https://explorer.anyblock.tools/ethereum/ethereum/goerli/tx/${res.result}`)
    const transactionInfo: ITransactionInfo = {
      transaction: transaction?.transaction || null,
      transactionHash: res.result,
      paymentValueUsd: paymentValueUsd,
      paymentFeeUsd: paymentFeeUsd,
      paymentTotalUSD: paymentTotalUSD,
      date: null,
      orderTrackingId: transaction?.order.trackingId || null,
    }

    dispatch(userAction.setTransactionInfoWallet(transactionInfo));
    setTimeout(() => {
      history.push("/confirmation")
      dispatch(userAction.setTransactionInProgress(TransactionState.INITIAL));
    }, 1000);
  }

  const onSendTransaction = async (accountBalance: AccountBalance, transaction: ITransaction) => {
    const account = accountBalance.account;
    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    if (!transaction) {
      toast.error("Something went wrong while generating the transaction, please try again. ");
      return;
    }

    //TODO this should be moved to a redux action, with a dispatcher & reducer
    await ethereumRpc.testSendTransaction(chainId, address, transaction)
        .then((res) => {
          console.info(`trxSignResult result:${res?.result} method: ${res?.method}`)
          dispatch(userAction.setTransactionInProgress(TransactionState.FINISHED));
          if (res?.valid) {
            handleSuccessfulTransaction(res);
          } else {
            toast.error(`Error sending transaction: ${res?.result}`|| "Something went wrong, please try again. ");
            console.debug(`valid = false. transaction result ${res?.result}`)
            dispatch(userAction.setTransactionInProgress(TransactionState.INITIAL));
          }
        })
        .catch((error) => {
          toast.error(`Error sending transaction: ${error}` || "Something went wrong sending the transaction, please try again. ");
          console.log(`error on signing trx ${error} state: ${rpcResult}`)
          dispatch(userAction.setTransactionInProgress(TransactionState.FINISHED));
        })
  };

  function initializePaymentData(accountBalance: AccountBalance, order: IOrder, transaction: ITransaction): IPaymentInformation {
    let paymentFeeUsd = 0;
    let paymentValueUSD = 0;
    let paymentTotalUSD = 0;
    const token = accountBalance.token;

    if (token === ETH_TOKEN && !transaction?.value) {
        console.warn(`transaction value not available. maybe should go back?. redirecting to /home page`)
        history.replace("/home");
        throw new Error(`transaction value not available. maybe should go back?. redirecting to /home page`);
    }
      const gasPriceNumber = getHexValueAsString(transaction?.gasPrice);
      const gasPriceUsd = convertTokenToUSD(Number(gasPriceNumber), token, tickers);
      console.info(`gasPrice hex: ${transaction?.gasPrice} = ${gasPriceNumber} ETH = ${gasPriceUsd} USD`)

      const gasLimitNumber = getHexValueAsString(transaction?.gasLimit);
      const gasLimitUsd = convertTokenToUSD(Number(gasLimitNumber), token, tickers);
      console.info(`gasLimit hex: ${transaction?.gasLimit}  ${gasLimitNumber} ETH = ${gasLimitUsd} USD`)


      let paymentValueInTokenBn;
      if (token === ETH_TOKEN) {
        const paymentValueEth = getHexValueAsString(transaction?.value);
        paymentValueInTokenBn = BigNumber.from(paymentValueEth);
        //FIXME change to bn
        const trxValueAsNumber = Number(paymentValueEth);
        paymentValueUSD = convertTokenToUSD(trxValueAsNumber, token, tickers) || 0;
        console.debug(`transac value ${transaction?.value}  ${transaction?.value ? trxValueAsNumber : 'n/a'} ETH  = ${paymentValueUSD} USD`)
      } else if (token === USDC_TOKEN) {
        console.warn(`calling bignumber.from with ${order.amount.toString()}`)
        paymentValueInTokenBn = toWad(order.amount.toString(), USDC_DECIMALS);
        //paymentValueInTokenBn = BigNumber.from(order.nativeAmount);
        const currency = getCurrencyByToken(USDC_TOKEN);
        const paymentValueInTokenString = formatFixed(paymentValueInTokenBn, currency?.decimals);
        paymentValueUSD = Number(paymentValueInTokenString);
        console.debug(`payment value from order nativeAmount: ${order.nativeAmount} amount: ${order.amount}
         bn:${paymentValueInTokenBn} str: ${paymentValueInTokenString} usd:${paymentValueUSD}`)
      } else {
        const message = `token ${token} not implemented`;
        toast.error(message)
        throw new Error(message);
      }

      if (paymentValueUSD && gasPriceUsd) {
        paymentFeeUsd = gasPriceUsd;
        paymentTotalUSD = paymentValueUSD + gasPriceUsd;
      } else {
        console.warn(`unable to calculate total trx price in USD. paymentValueUSD: ${paymentValueUSD} gasPrice: ${gasPriceUsd}`);
      }

      console.debug(`payment value ${paymentTotalUSD} USD  = trx ${paymentValueUSD} USD + fee ${gasPriceUsd} USD`)
      return {paymentFeeUsd: paymentFeeUsd, paymentValueUsd: paymentValueUSD,
        paymentTotalUSD: paymentTotalUSD, paymentValueToken: paymentValueInTokenBn};
  }


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
          <div className="cube c1"/>
          <div className="cube c2"/>
          <div className="cube c4"/>
          <div className="cube c3"/>
        </div> :
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-white text-start font-righteous font-bold mr-2">{`Pay $${paymentTotalUSD.toFixed(2)}`}</p>
          <p className="text-white text-start text-xs mr-2">{getFormattedTokenValue(accountBalance.token, paymentValueToken)}</p>
        </div>}
  </button>;

  const helperTextMessage = <p style={{fontFamily: 'Righteous', fontStyle: 'normal'}}
               className="text-center text-xs m-4 mb-8">{helpMessages[transactionInProgress.valueOf()]}</p>

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
                <p className="text-grey text-sm">{accountBalance.token}</p>
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
                <p className="mt-8">{`${transactionInProgress.valueOf() + 1}/3`}</p>
                {
                  isMobile() && transactionInProgress.valueOf() === 1 ? <a href={"wc://"} className="">
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
