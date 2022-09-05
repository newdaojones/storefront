import React, {useState} from 'react';
import {storefrontPayButton} from "../../StorefrontPaySdk";
import {useSelector} from "react-redux";
import {selectMerchantInfo} from "../../store/selector";
import {getAddressFromAccount} from "@walletconnect/utils";
import {useWalletConnectClient} from "../../contexts/walletConnect";
import {ellipseAddress} from "../../helpers";
import Toggle from "../../components/ui/toggle";

export const SettingsPage = () => {
  const { account} = useWalletConnectClient();
  let merchantInfo = useSelector(selectMerchantInfo);
  const [enabled, setEnabled] = useState(false);

  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName}`);
  console.log(`merchant Account ${account} add ${getAddressFromAccount(account!!)||""}`)

  let payButton = storefrontPayButton(getAddressFromAccount(account!!) || "", "1", 0.15);


  React.useEffect(() => {
    if (account) {
      payButton = storefrontPayButton(getAddressFromAccount(account), "1", 0.15);
    }
  }, [account]);

  let onEdit = () => {
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 items-center justify-center bg-black bg-opacity-10 border-2 border-secondary rounded-16xl shadow-md p-20">
        <p className="text-white text-xl font-bold font-righteous text-center">Merchant Settings</p>

        <div className="flex flex-col items-center justify-between mt-10 px-14">
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white mr-8">Wallet Address</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
              {ellipseAddress(merchantInfo?.memberAddress)}
            </div>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
              <p className="text-center text-white mr-8">Store Name</p>
              <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
                {merchantInfo?.merchantName}
              </div>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white  mr-8">Default Token</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {merchantInfo?.defaultToken}
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white  mr-8">Fake Money</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded" >
              <label htmlFor="toggle-example" className="flex items-center cursor-pointer relative mb-4" >
                <input type="checkbox" id="toggle-example" className="sr-only" checked={enabled}/>
                  <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" onClick={() => {
                    setEnabled(!enabled);
                  }}></div>
                  <span className="ml-3 text-sm text-white">{enabled ?'ON' :'OFF'}</span>
              </label>
            </div>
          </div>

          <div className="w-full flex justify-between mt-10">
            <p className="text-center text-white  mr-8">Supported Chains</p>
            <div className="flex flex-col justify-center bg-white bg-opacity-25 py-1 px-2 rounded">
              <div className="flex items-center justify-end text-white py-1 px-2 rounded">
                {'Ethereum'}
                <input className="m-2" type="checkbox" readOnly={true} value='true'/>
              </div>
              <div className="flex items-center justify-center text-white py-1 px-2 rounded mt-2">
                {'Polygon'}
                <input className="m-2" type="checkbox" value='true'/>
              </div>
            </div>
          </div>

          {/*Storefront Pay Button*/}
          <div className="w-full flex flex-col items-center justify-around pt-10">
            {payButton}
            <p className="font-montserrat text-white text-center text-sm mt-2 mb-4">Add a Pay with Storefront button to your site, or use our sdk.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
