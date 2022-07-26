import React from 'react';
import numeral from 'numeral';

import BTCIcon from '../../assets/images/btcIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import TransactionRow from "../../components/transactionRow";
import {ITransactionInfo} from "../../models";

export const SettingsPage = () => {

  // const depositors = [{transactionHash: 0x212123abd, amount: 0.55}, {transactionHash: 0x212123abd, amount: 0.55}];

  let onEdit = () => {
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-black bg-opacity-10 border-2 border-terciary rounded-16xl shadow-md p-20">
        <p className="text-white text-xl font-bold font-righteous text-center">Merchant Settings</p>

        <div className="w-3/4 flex flex-col items-center justify-between mt-10 ">
          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white mr-8">wallet address</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
              {'0x9737f6...30fd772'}
            </div>
          </div>
          <div className="w-full flex items-center justify-end mt-10">
              <p className="text-center text-white mr-8">Store Name</p>
              <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
                {'Test Merchant'}
              </div>
          </div>
          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white  mr-8">Supported Cryptocurrencies</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {'ETH'}
            </div>
          </div>

          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white  mr-8">Fake Money</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {'true'}
            </div>
          </div>

          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white  mr-8">App Version</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {'0.2'}
            </div>
          </div>
        </div>
        <div className="mt-10">

          <div className="flex items-center justify-around px-10">
            <div className="grid w-full h-60 overflow-auto">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
