import React from 'react';
import numeral from 'numeral';

import BTCIcon from '../../assets/images/btcIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import TransactionRow from "../../components/transactionRow";
import {ITransactionInfo} from "../../models";
import {useSelector} from "react-redux";
import {selectMerchantInfo} from "../../store/selector";
import OrderRow from "../../components/orderRow";

export const ProfilePage = () => {

  // const depositors = [{transactionHash: 0x212123abd, amount: 0.55}, {transactionHash: 0x212123abd, amount: 0.55}];

  let merchantInfo = useSelector(selectMerchantInfo);
  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName}`);
  const orders = merchantInfo?.orders

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
                orders && orders.length > 0 ?
                    orders.map(token => (
                        <div>
                          <OrderRow key={token.transactionHash} asset={token} onEdit={onEdit}/>
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
