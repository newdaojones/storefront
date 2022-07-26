import React from 'react';
import numeral from 'numeral';

import BTCIcon from '../../assets/images/btcIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import TransactionRow from "../../components/transactionRow";
import {ITransactionInfo} from "../../models";

export const ProfilePage = () => {

  // const depositors = [{transactionHash: 0x212123abd, amount: 0.55}, {transactionHash: 0x212123abd, amount: 0.55}];

  const depositors: ITransactionInfo[] = [
      {
    transactionHash: '0x01bdade',
    value: '0.000012',
    paymentTotalUSD: 0.55,
    paymentFeeUsd: 0.001,
    paymentValueUsd: 0.54,
    toAddress: "0x96aa",
    fromAddress: '0xfrom',
    date: '2022-06-22'
  },
    {
      transactionHash: '0xf1bdade',
      value: '0.0000085',
      paymentTotalUSD: 0.50,
      paymentFeeUsd: 0.02,
      paymentValueUsd: 0.48,
      toAddress: "0x96aa",
      fromAddress: '0x12ff4',
      date: '2022-02-12'
    },
    {
      transactionHash: '0x02afdade',
      value: '0.0000085',
      paymentTotalUSD: 0.50,
      paymentFeeUsd: 0.02,
      paymentValueUsd: 0.48,
      toAddress: "0x96aa",
      fromAddress: '0x12ff4',
      date: '2022-02-12'
    }
  ];
  let onEdit = () => {
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-black bg-opacity-10 border-2 border-terciary rounded-16xl shadow-md p-10">
        <p className="text-white text-xl font-bold font-righteous text-center">Merchant Dashboard</p>
        <div className="mt-8">
          <p className="text-center text-white">Total payments</p>
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              <img className="w-8 h-8 mr-2" src={BTCIcon} alt="" />
              {numeral(2.3434 || 0).format('0,0.00')}
            </div>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded ml-6">
              <img className="w-8 h-8 mr-2" src={DollarIcon} alt="" />
              {numeral(3434.3 || 0).format('0,0')}
            </div>
          </div>
        </div>
        <div className="mt-10">

          {/*Depositor table*/}

          <div className="flex items-center justify-between px-10">
            <p className="text-white mt-1 py-2 font-bold font-montserrat">Transactions</p>
            <p className="text-white"></p>
          </div>

          <div className="flex items-center justify-around px-10">
            <div className="grid w-full h-60 overflow-auto">
              {
                depositors.length > 0 ?
                    depositors.map(token => (
                        <div>
                          <TransactionRow key={token.transactionHash} asset={token} onEdit={onEdit}/>
                        </div>)
                    )
                    :
                    <div
                        className="column justify-center text-center items-center text-white">
                      <img className="w-140 h-40 inline" src={NotFoundImage} alt=""/>
                      <p>Nothing to see here.</p>
                    </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
