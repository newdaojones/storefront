import React, {useState} from 'react';
import numeral from 'numeral';
import QRIcon from '../assets/images/qrCodeIcon.svg';
import {useHistory} from "react-router-dom";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {getBalanceInUSD} from "../helpers/tx";

export const ProfilePage = () => {
  const history = useHistory();

  const { accounts, balances } = useWalletConnectClient();

  const accountBalance = getBalanceInUSD(accounts, balances);

  const moveToWallet = (): void => {
    console.log(`navigating to scan page `)
    //dispatch(userAction.setSelectedWallet(wallet));
    //history.push("/scan");
    history.push("/buy");
  };

  console.info(`account balance ${accountBalance.balance} ${accountBalance.balanceString}`)

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
                  {/*{numeral(accountBalance.balance || 0).format('0,0.0000')}*/}
                  {accountBalance.balanceString.substring(0, accountBalance.balanceString.length > 6 ? 6 : accountBalance.balanceString.length - 1)}
                </p>
              </div>
              <p style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="text-white text-center font-bold text-sm pt-2 ml-1">
                {/*USD*/}
                ETH
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
