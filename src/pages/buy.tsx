import React, {useEffect, useState} from 'react';
import QRIcon from '../assets/images/creditcard.svg';
import ETHIcon from '../assets/images/eth.svg';
import {useDispatch, useSelector} from "react-redux";
import {
  selectAccountInfo,
  selectCreateTransaction,
  selectTickers,
  selectTransactionInProgress
} from "../store/selector";
import {userAction} from "../store/actions";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {ellipseAddress} from "../helpers";
import {useJsonRpc} from "../contexts/JsonRpcContext";
import {toast} from "react-toastify";
import {AccountBalance, getBalanceInUSD, getHexValueAsBigNumber, getWeiToString} from "../helpers/tx";
import {ITransactionInfo, TransactionState} from "../models";
import {useHistory} from "react-router-dom";
import {convertETHtoUSD, convertUSDtoETH} from "../helpers/currency";

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

  const transaction = useSelector(selectCreateTransaction)
  const helpMessages = ['Tap the button above to submit the signing request', 'Switch to your wallet up and Sign the transaction']

  const {
    rpcResult,
    isRpcRequestPending,
    ethereumRpc,
  } = useJsonRpc();

  const [ locationKeys, setLocationKeys ] = useState("")

  useEffect(() => {
    return history.listen(location => {
      if (history.action === 'PUSH') {
      }
      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          // Handle forward event
        } else {
          console.info(`back event, clearing trx. `)
          dispatch(userAction.unsetTransaction());
          history.goBack();
        }
      }
    })
  }, [ locationKeys, ])

  const onBuyClick = (): void => {
    if (transactionInProgress == TransactionState.IN_PROGRESS) {
      console.debug("skipping click while there's an ongoing trx");
      return;
    }

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

    //TODO this should be done before the pay event to be able to show trx fees.

    if (!transaction) {
      toast.error("Something went wrong while generating the transaction, please try again. ");
      return;
    }

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
              transactionHash: res.result,
              paymentValueUsd: paymentValueUsd,
              paymentFeeUsd: paymentFeeUsd,
              paymentTotalUSD: paymentTotalUSD,
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


  let paymentFeeUsd = 0;
  let paymentValueUsd = 0;

  let paymentTotalUSD = 0;
  let paymentValueEth = 0;
  if (transaction?.value) {
    paymentValueEth = Number(getHexValueAsBigNumber(transaction?.value));

    const gasPriceNumber = getHexValueAsBigNumber(transaction?.gasPrice);
    const gasPriceUsd = convertETHtoUSD(Number(gasPriceNumber), tickers);
    console.info(`gasPrice ${transaction?.gasPrice}  ${transaction?.gasPrice ? gasPriceNumber : ''}WEI  = ${gasPriceNumber} ETH = ${gasPriceUsd} USD`)

    const gasLimitNumber = getHexValueAsBigNumber(transaction?.gasLimit);
    const gasLimitUsd = convertETHtoUSD(Number(gasLimitNumber), tickers);
    console.info(`gasLimit ${transaction?.gasLimit}  ${transaction?.gasLimit ? gasLimitNumber : ''}WEI  = ${gasLimitNumber} ETH = ${gasLimitUsd} USD`)

    const trxValueAsNumber = getHexValueAsBigNumber(transaction?.value);
    const trxPriceUsd = convertETHtoUSD(Number(trxValueAsNumber), tickers);

    if (trxPriceUsd && gasPriceUsd) {
      paymentValueUsd = trxPriceUsd;
      paymentFeeUsd = gasPriceUsd;
      paymentTotalUSD = trxPriceUsd + gasPriceUsd;
    } else {
      console.info(`unable to calculate total trx price in USD`);
    }

    console.info(`transac value ${transaction?.value}  ${transaction?.value ? trxValueAsNumber : 'n/a'} ETH  = ${trxPriceUsd} USD`)
    console.info(`payment value ${paymentTotalUSD} USD  = trx s${trxPriceUsd} USD + fee ${gasPriceUsd} USD`)
  } else {
    console.info(`transaction value not available. maybe should go back?`)
    history.goBack();
  }
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
              <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentValueUsd.toFixed(2)}`}</p>
            </div>
            <div className="w-full flex justify-between pl-4 pr-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Transaction Fee</p>
              <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentFeeUsd.toFixed(6)}`}</p>
            </div>
            <div className="flex flex-col w-full text-secondary mt-4 justify-between" style={{ height: 1, backgroundColor: '#FFB01D', backgroundRepeat: "no-repeat"}}/>
            <div className="w-full flex justify-between p-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Subtotal</p>
              <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${paymentTotalUSD.toFixed(2)}`}</p>
            </div>
            <div className="w-full flex justify-between pl-4 pr-4 pb-6">
              <p className="text-white text-start text-xs mr-2">Total Price</p>
              <p className="text-start text-secondary text-xs mr-2">{`$ ${paymentTotalUSD.toFixed(2)}`}</p>
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
                  <p className="text-white text-start mr-2">{`Pay $${paymentTotalUSD.toFixed(2)}`}</p>
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
