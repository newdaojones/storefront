import React from 'react';
import numeral from 'numeral';

import BTCIcon from '../../assets/images/btcIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import TransactionRow from "../../components/transactionRow";
import {ITransactionInfo} from "../../models";
import {storefrontPayButton} from "../../StorefrontPaySdk";
import {useSelector} from "react-redux";
import {userInfo} from "os";
import {selectAccount, selectMerchantInfo} from "../../store/selector";
import {getAddressFromAccount} from "@walletconnect/utils";
import QRCodeStyling from "qr-code-styling";
import {useWalletConnectClient} from "../../contexts/walletConnect";
import {ellipseAddress} from "../../helpers";

export const SettingsPage = () => {

  // const depositors = [{transactionHash: 0x212123abd, amount: 0.55}, {transactionHash: 0x212123abd, amount: 0.55}];
  //TODO this doesn't work yet
  const { account} = useWalletConnectClient();

  let merchantInfo = useSelector(selectMerchantInfo);

  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName}`);

  console.log(`merchant Account ${account} add ${getAddressFromAccount(account!!)||""}`)

  let payButton = storefrontPayButton(getAddressFromAccount(account!!) || "", "12323", 0.15);


  React.useEffect(() => {
    if (account) {
      payButton = storefrontPayButton(getAddressFromAccount(account), "12323", 0.15);
    }
  }, [account]);

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
              {ellipseAddress(merchantInfo?.memberAddress)}
            </div>
          </div>
          <div className="w-full flex items-center justify-end mt-10">
              <p className="text-center text-white mr-8">Store Name</p>
              <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
                {merchantInfo?.merchantName}
              </div>
          </div>
          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white  mr-8">Default Token</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {merchantInfo?.defaultToken}
            </div>
          </div>

          <div className="w-full flex items-center justify-end mt-10">
            <p className="text-center text-white  mr-8">Fake Money</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {'true'}
            </div>
          </div>

          {/*Storefront Pay Button*/}
          <div className="w-full flex flex-col items-center justify-around pt-10">
            {payButton}
            <p className="font-montserrat text-white text-center text-sm mt-2 mb-4">Add a Pay with Storefront button to your site, or use our sdk.</p>
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
