import React from 'react';
import numeral from 'numeral';

import BTCIcon from '../../assets/images/btcIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import TransactionRow from "../../components/transactionRow";
import {ITransactionInfo} from "../../models";
import {storefrontPayBaseUrl} from "../../StorefrontPaySdk";

export const FindPage = () => {

  // const depositors = [{transactionHash: 0x212123abd, amount: 0.55}, {transactionHash: 0x212123abd, amount: 0.55}];

  let onEdit = () => {
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-black bg-opacity-10 border-2 border-terciary rounded-16xl shadow-md p-20">
        <p className="text-white text-xl font-bold font-righteous text-center">Transaction Status</p>


        <div className="w-3/4 flex flex-col items-center justify-between mt-10 ">
          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white mr-8">transaction hash</p>

            <a href={storefrontPayBaseUrl + '/storefront/status?orderId=1&amount=0.50&transactionId=0x75a4753509b0dcc3e8cb176ee343a30545995945e16250ca6907c22a4ac3b398'}>
              <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
                {'0x9737f6...30fd772'}
              </div>
            </a>
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
