import React, {useEffect, useState} from 'react';
import QRIcon from '../assets/images/qrCodeIcon.svg';
import QRTarget from '../assets/images/qrCodeScanning.svg';
import QRLine from '../assets/images/qrCodeBar.svg';
import {useHistory} from "react-router-dom";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {getPreferredAccountBalance} from "../helpers/tx";
import {useDispatch, useSelector} from "react-redux";
import {selectCreateTransaction, selectCurrentOrder, selectTickers} from "../store/selector";
import numeral from "numeral";
import {userAction} from "../store/actions";
import {toast} from "react-toastify";
import {QrReader} from "react-qr-reader";
import {convertTokenToUSD, convertUSDtoToken} from "../helpers/currency";
import {extractOrderFromUrl, IOrderParams} from "../utils/path_utils";
import {useLocation} from "react-use";
import {IOrder} from "../models";

/**
 * https://test.jxndao.com/storefront/home
 * or
 * http://localhost:3000/storefront/home?orderId=1&amount=0.25&merchantAddress=0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004&orderTrackingId=6020fb4d-02e1-41c7-9570-584584e0e3a1
 * http://localhost:3000/storefront/home?orderId=8&amount=0.45
 */
export const HomePage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let query = useLocation().search;
  const [ loading, setLoading ] = useState(false)
  const [ scanning, setScanning ] = useState(false)
  const [ redirected, setRedirected ] = useState(false)
  const [ transactionCreatedLock, setTransactionCreatedLock ] = useState(false)
  const { accounts, balances, refreshBalances } = useWalletConnectClient();

  const accountBalance = getPreferredAccountBalance(accounts, balances);
  console.info(`selected account:${accountBalance.account} balance:${accountBalance.balanceString} token:${accountBalance.token}`)

  const tickers = useSelector(selectTickers);
  const currentOrder = useSelector(selectCurrentOrder);
  const trxCreated = useSelector(selectCreateTransaction);

  useEffect(() => {
    console.info(`useEffect transactionCreatedLock: ${transactionCreatedLock} trxCreated: ${trxCreated} transaction: ${trxCreated?.transaction}`)
    if (trxCreated?.transaction && trxCreated.transaction.value && !transactionCreatedLock) {
      setTransactionCreatedLock(true);
      if (!redirected) {
        history.push("/buy");
      } else {
        history.replace("/buy");
      }
    }
  }, [trxCreated, transactionCreatedLock, setTransactionCreatedLock, history]);

  useEffect(() => {
    if (query && tickers?.length > 0) {
      try {
        const order = extractOrderFromUrl(query);
        if (!order.orderTrackingId) {
          toast.error(`Invalid orderTrackingId`)
          return;
        }
        dispatch(userAction.getOrder({orderTrackingId: order.orderTrackingId}))
      } catch (e: any) {
        console.log(e);
        toast.error(`${e?.message}`)
      }
    }

  }, [query, tickers, redirected]);


  useEffect(() => {
    if (!currentOrder) {
      return;
    }
    if (currentOrder.trackingId && currentOrder.amount && !redirected) {
      setRedirected(true);
      createTransaction(currentOrder);
    } else {
      console.debug(`not creating trx`)
    }
  }, [currentOrder]);

  const startScanning = (): void => {
    console.debug(`starting scanning....`)
    setScanning(!scanning);
  }

  const stopScanning = (): void => {
    console.debug(`stop scanning....`)
    setScanning(false);
  }

  const pastePaymentLink = async () => {
    console.debug(`paste link `)

    try {
      const text = await navigator.clipboard.readText();
      processScanResult(text);
    } catch (e) {
      console.warn(`error ${e}`);
    }
  }


  /**
   * Create Payment Transaction (not blockchain transaction)
   * @param order
   */
  const createTransaction = (order: IOrder): void => {
    const paymentSubtotalUsd = order.amount;
    const currencySymbol = accountBalance.token;
    const ethTotal = convertUSDtoToken(paymentSubtotalUsd, currencySymbol, tickers);
    if (!ethTotal) {
      toast.error(`Could not convert value to crypto. Invalid tickers ${tickers.length}`);
      return;
    }
    setLoading(true);

    if (!order.trackingId) {
      toast.error("Invalid order tracking ID")
    } else {
      dispatch(userAction.setCreateTransaction({
        account: accountBalance.account,
        toAddress: order.toAddress,
        amount: ethTotal,
        orderTrackingId: order.trackingId
      }));
    }
  };

  const onHomeClick = async () => {
    console.info(`refreshing balances `)
    await refreshBalances(accounts);
  }

  //FIXME get the usdc balance and fallback to eth
  const balanceN = Number(accountBalance.balanceString);
  const currencySymbol = accountBalance.token;
  const balanceUSD = convertTokenToUSD(balanceN, currencySymbol, tickers);

  function processScanResult(resultText: string) {
    stopScanning();
    try {
      const order = extractOrderFromUrl(resultText);
      if (!order.orderTrackingId) {
        toast.error(`Invalid orderTrackingId`)
        return;
      }
      dispatch(userAction.getOrder({orderTrackingId: order.orderTrackingId}))
    } catch (e) {
      console.info(`Invalid QrCode url`);
      toast.error(`Invalid Payment Link`);
    }
  }

  const qrCode = <QrReader
      onResult={(result, error) => {
        if (!!result) {
          console.log(result?.getText());
          processScanResult(result.getText());
        }

        if (!!error && error.message) {
          console.info(error || "");
        }
      }}
      constraints={{ facingMode : "environment" }}
      scanDelay={300}
      containerStyle={{overflow: 'initial'}}
      videoStyle={{height: '100vh', width: '100vw', objectFit: 'cover', overflow: 'initial'}}
      className=""
  />

  return (
      <div className="grid">
      {scanning && qrCode}
        <div className="absolute mt-10 w-full h-full">
          <div className="h-full flex justify-center items-center">
            <div className="p-10 flex flex-col justify-between">
              { (loading) ?
                  <div className="w-20 h-20 mt-10 mb-10" style={{alignSelf: 'center'}}>
                    <div className="thecube w-20 h-20" style={{alignSelf: 'center'}}>
                      <div className="cube c1"/>
                      <div className="cube c2"/>
                      <div className="cube c4"/>
                      <div className="cube c3"/>
                    </div>
                  </div>
                  :
                      !scanning ?
                        <img className="w-1/2 h-1/3 mb-4 cursor-pointer" style={{alignSelf: 'center'}}
                         src={QRIcon} alt="" onClick={startScanning} />
                        :
                        <div className="grid w-1/2 h-1/3 mb-4" onClick={startScanning}
                             style={{alignSelf: 'center', backgroundImage: `url(${QRTarget})`, backgroundSize: 'cover', overflow: 'initial'}}>
                          <img className="scan w-full"
                               src={QRLine} alt="" />
                        </div>
              }
              <a className="text-white text-center text-sm cursor-pointer" onClick={pastePaymentLink}>Paste Link</a>


              <div className="mt-4">
                <p className="text-white mt-8 text-center font-bold">Scan Payment QR or </p>
                <p className="font-Righteous text-center text-white text-sm" style={{fontStyle: 'normal',}}>
                  Scan the payment QR code provided by the store to checkout</p>
              </div>
              <div className="flex items-center justify-center mt-10">
                <div className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl" onClick={onHomeClick}>
                  <p style={{fontFamily: 'Righteous', fontStyle: 'normal',}}
                     className="text-white text-start text-xs mr-2 mt-2">Current Balance</p>
                  <div className="flex items-center">
                    <div className="text-white text-center font-bold">
                      <p style={{fontSize: "xx-large", fontFamily: 'Montserrat', fontStyle: 'normal',}} >
                        {
                          balanceUSD ? `$ ${numeral(balanceUSD).format('0,0.00')}`
                              : ''
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="font-righteous text-white text-center font-bold">
                      <p>
                        {
                          balanceN ? numeral(balanceN).format('0.000000')
                              :accountBalance.balanceString.substring(0, accountBalance.balanceString.length > 6 ? 6 : accountBalance.balanceString.length - 1)
                        }
                      </p>
                    </div>
                    <p className="font-righteous text-white text-center font-bold text-sm ml-1">
                      {currencySymbol}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
