import React, {useEffect, useState} from 'react';
import QRIcon from '../assets/images/qrCodeIcon.svg';
import QRTarget from '../assets/images/qrCodeScanning.svg';
import QRLine from '../assets/images/qrCodeBar.svg';
import {useHistory} from "react-router-dom";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {getNonZeroAccountBalance} from "../helpers/tx";
import {useDispatch, useSelector} from "react-redux";
import {selectCreateTransaction, selectTickers} from "../store/selector";
import numeral from "numeral";
import {userAction} from "../store/actions";
import {toast} from "react-toastify";
import {QrReader} from "react-qr-reader";
import {convertTokenToUSD, convertUSDtoToken} from "../helpers/currency";
import {extractOrderFromUrl, IOrder} from "../utils/path_utils";

export const HomePage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(false)
  const [ scanning, setScanning ] = useState(false)
  const [ qrCodeUrl, setQrCodeUrl ] = useState('')
  const [ locationKeys, setLocationKeys ] = useState(false)
  const { accounts, balances, refreshBalances } = useWalletConnectClient();

  const accountBalance = getNonZeroAccountBalance(accounts, balances);
  console.info(`selected account:${accountBalance.account} balance:${accountBalance.balanceString} token:${accountBalance.token}`)

  const tickers = useSelector(selectTickers)

  const trxCreated = useSelector(selectCreateTransaction)

  useEffect(() => {
    console.info(`useEffect locationKeys: ${locationKeys} trxCreated: ${trxCreated}`)
    if (trxCreated && trxCreated.value && !locationKeys) {
      setLocationKeys(true);
      history.push("/buy");
    }
  }, [trxCreated, locationKeys, setLocationKeys, history]);


  const startScanning = (): void => {
    console.info(`starting scanning....`)
    setScanning(!scanning);
  }

  const stopScanning = (): void => {
    console.info(`stop scanning....`)
    setScanning(false);
  }

  const createTransaction = (order: IOrder): void => {
    const paymentSubtotalUsd = order.amount;
    const currencySymbol = accountBalance.token;
    const ethTotal = convertUSDtoToken(paymentSubtotalUsd, currencySymbol, tickers);
    if (!ethTotal) {
      toast.error(`Could not convert value to crypto. Invalid tickers ${tickers.length}`);
      return;
    }
    setLoading(true);
    dispatch(userAction.setCreateTransaction({account: accountBalance.account, amount: ethTotal, orderId: order.orderId}));
  };

  const onHomeClick = async () => {
    console.info(`refreshing balances `)
    await refreshBalances(accounts);
  }

  const balanceN = Number(accountBalance.balanceString);
  const currencySymbol = accountBalance.token;
  const balanceUSD = convertTokenToUSD(balanceN, currencySymbol, tickers);

  function processScanResult(resultText: string) {
    stopScanning();
    try {
      setQrCodeUrl(resultText);
      console.info(`qr ${resultText}`)
      const order = extractOrderFromUrl(resultText);
      createTransaction(order);
    } catch (e) {
      console.info(`Invalid QrCode url`);
      toast.error(`Invalid QrCode url`);
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
              <p className="text-white mt-8 text-center font-bold">Scan QR Code</p>
              <div className="mt-4">

                <p className="font-Righteous text-center text-white text-sm" style={{fontStyle: 'normal',}}>
                  Scan the qRCode provided by the store to checkout</p>
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
