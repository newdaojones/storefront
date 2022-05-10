import React from 'react';
import QRIcon from '../assets/images/qrCodeIcon.svg';
import {useHistory} from "react-router-dom";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {getBalanceInUSD} from "../helpers/tx";
import {useDispatch, useSelector} from "react-redux";
import {selectTickers} from "../store/selector";
import numeral from "numeral";
import {convertETHtoUSD, convertUSDtoETH} from "../helpers/currency";
import {userAction} from "../store/actions";
import {toast} from "react-toastify";

export const ProfilePage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { accounts, balances } = useWalletConnectClient();

  const accountBalance = getBalanceInUSD(accounts, balances);
  const tickers = useSelector(selectTickers)

  const moveToWallet = (): void => {
    console.log(`navigating to scan page `)
    //TODO scan to determine price to pay, before going to buy
    //history.push("/scan");

    //FIXME hardcoded price
    const paymentSubtotalUsd = 0.55;
    const ethTotal = convertUSDtoETH(paymentSubtotalUsd, tickers);
    if (!ethTotal) {
      toast.error(`Could not convert value to crypto. Invalid tickers ${tickers.length}`);
      return;
    }
    dispatch(userAction.setCreateTransaction({account: accountBalance.account, amount:ethTotal}));
    history.push("/buy");
  };

  const balanceN = Number(accountBalance.balanceString);
  const balanceUSD = convertETHtoUSD(balanceN, tickers);

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-1/2 min-w-max shadow-md p-10">
        <img className="w-full p-10" src={QRIcon} alt="" onClick={moveToWallet} />
        <p className="text-white text-center font-bold">Scan QR Code</p>
        <div className="mt-4">
          <p className="text-center text-white text-sm" style={{fontFamily: 'Righteous', fontStyle: 'normal',}}>
              Scan the qRCode provided by the store to checkout</p>

        </div>
        <div className="flex items-center justify-center mt-10">
          <div className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
            <p style={{fontFamily: 'Righteous', fontStyle: 'normal',}}
               className="text-white text-start text-xs mr-2 mt-2">Current Balance</p>
            <div className="flex items-center">
              <div className="text-white text-center font-bold">
                <p style={{fontSize: "xx-large", fontFamily: 'Montserrat', fontStyle: 'normal',}} >
                  {
                    balanceUSD ? numeral(balanceUSD).format('0,0.00')
                        :accountBalance.balanceString.substring(0, accountBalance.balanceString.length > 6 ? 6 : accountBalance.balanceString.length - 1)
                  }
                </p>
              </div>
              <p style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="text-white text-center font-bold text-sm pt-2 ml-1">
                {balanceUSD ? "USD" : "ETH"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
