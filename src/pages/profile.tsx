import React, {useEffect, useState} from 'react';
import QRIcon from '../assets/images/qrCodeIcon.svg';
import {useHistory} from "react-router-dom";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {getBalanceInUSD} from "../helpers/tx";
import {useDispatch, useSelector} from "react-redux";
import {selectCreateTransaction, selectTickers} from "../store/selector";
import numeral from "numeral";
import {convertETHtoUSD, convertUSDtoETH} from "../helpers/currency";
import {userAction} from "../store/actions";
import {toast} from "react-toastify";

export const ProfilePage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(false)
  const [ locationKeys, setLocationKeys ] = useState(false)
  const { accounts, balances, refreshBalances } = useWalletConnectClient();

  const accountBalance = getBalanceInUSD(accounts, balances);
  const tickers = useSelector(selectTickers)

  const trxCreated = useSelector(selectCreateTransaction)

  useEffect(() => {
    console.info(`useEffect locationKeys: ${locationKeys} trxCreated: ${trxCreated}`)
    if (trxCreated && trxCreated.value && !locationKeys) {
      console.log(`pushing /buy to history. loading: ${loading} this should be only done when true`);
      if (loading) {
        setLocationKeys(true);
        history.push("/buy");
      } else {
        console.info(`not pushing bug since loading is false`);
      }
    }
  }, [trxCreated, locationKeys, setLocationKeys, history]);

  const moveToWallet = (): void => {
    console.log(`navigating to scan page `)
    //history.push("/scan");

    //FIXME hardcoded price
    const paymentSubtotalUsd = 0.55;
    const ethTotal = convertUSDtoETH(paymentSubtotalUsd, tickers);
    if (!ethTotal) {
      toast.error(`Could not convert value to crypto. Invalid tickers ${tickers.length}`);
      return;
    }
    setLoading(true);
    dispatch(userAction.setCreateTransaction({account: accountBalance.account, amount:ethTotal}));
  };

  const onHomeClick = async () => {
    console.info(`refreshing balances `)
    const bla = await refreshBalances(accounts);

  }

  const balanceN = Number(accountBalance.balanceString);
  const balanceUSD = convertETHtoUSD(balanceN, tickers);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="p-10 flex flex-col justify-between">
        { (loading) ?
          <div className="w-20 h-16 mt-20 mb-20" style={{alignSelf: 'center'}}>
            <div className="thecube w-20 h-20" style={{alignSelf: 'center'}}>
              <div className="cube c1"></div>
              <div className="cube c2"></div>
              <div className="cube c4"></div>
              <div className="cube c3"></div>
            </div>
          </div>
          : <img className="w-1/2 h-1/3 my-4 cursor-pointer" style={{alignSelf: 'center'}}
          src={QRIcon} alt="" onClick={moveToWallet} />
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
                {"ETH"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
