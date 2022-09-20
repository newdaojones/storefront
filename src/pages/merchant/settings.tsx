import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectMerchantInfo} from "../../store/selector";
import {getAddressFromAccount} from "@walletconnect/utils";
import {useWalletConnectClient} from "../../contexts/walletConnect";
import {ellipseAddress} from "../../helpers";
import {userAction} from "../../store/actions";
import {IMerchant} from "../../models";
import logoIcon from "../../assets/images/logo.svg";
import {toast} from "react-toastify";

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const { account, disconnect} = useWalletConnectClient();
  let merchantInfo = useSelector(selectMerchantInfo);
  const [enabled, setEnabled] = useState(true);
  const [polygonEnabled, setPolygonEnabled] = useState(true);

  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName}`);
  console.log(`merchant Account ${account} add ${getAddressFromAccount(account!!)||""}`)

  const onDisconnect = () => {
    console.info(`onDisconnect called`);
    toast.info("Disconnecting...", {autoClose: 1000})
    disconnect().then(r => console.info(`disconnected!`));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const logoutButton =  <button onClick={onDisconnect} className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
    <p className="font-righteous">Logout</p>
  </button>

  React.useEffect(() => {
    if (account) {
      //payButton = storefrontPayButton(getAddressFromAccount(account), "1", 0.15);
    }
  }, [account]);

  React.useEffect(() => {
    if (merchantInfo) {
      setEnabled(merchantInfo.testnet);
    }
  }, [merchantInfo]);

  const onSaveSettings = () => {
    if (!merchantInfo) {
      return;
    }
    const updatedMerchant: IMerchant = {
      allowedUrl: merchantInfo.allowedUrl,
      defaultToken: merchantInfo.defaultToken,
      id: merchantInfo.id,
      memberAddress: merchantInfo.memberAddress,
      memberENSAddress: merchantInfo.memberENSAddress,
      memberSecondaryAddress: merchantInfo.memberENSAddress,
      merchantName: merchantInfo.merchantName,
      orders: [],
      storeName: "",
      testnet: enabled
    };
    dispatch(userAction.updateMerchant(updatedMerchant));
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 items-center justify-center bg-black bg-opacity-10 border-2 border-secondary rounded-16xl shadow-md p-20">
        <p className="text-white text-xl font-bold font-righteous text-center">Merchant Settings</p>

        <div className="flex flex-col items-center justify-between mt-10 px-14">
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white mr-8">Wallet Address</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
              {`0x${ellipseAddress(merchantInfo?.memberAddress)}`}
            </div>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
              <p className="text-center text-white mr-8">Store Name</p>
              <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
                {merchantInfo?.merchantName}
              </div>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white  mr-8">Accepted Token</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              {merchantInfo?.defaultToken}
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white  mr-8">Fake Money</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-2 px-2 rounded" >
              <label htmlFor="toggle-tesnet" className="flex items-center cursor-pointer relative" >
                <input type="checkbox" id="toggle-example" className="sr-only" checked={enabled}/>
                <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" onClick={() => {
                  setEnabled(!enabled);
                }}/>
                  <span className="ml-3 text-sm text-white">{enabled ?'ON' :'OFF'}</span>
              </label>
            </div>
          </div>

          <div className="w-full flex justify-between mt-10">
            <p className="text-center text-white  mr-8">Supported Chains</p>

            <div className="flex flex-col justify-end bg-white bg-opacity-25 py-1 px-2 rounded">

              <div className="flex items-center justify-end text-white py-1 px-2 rounded">
                <div>{'Ethereum'}</div>
                <label htmlFor="toggle-tesnet" className="flex items-center relative ml-4" >
                  <input type="checkbox" id="toggle-example" className="sr-only" readOnly={true} checked={true}/>
                  <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" />
                </label>
              </div>

              <div className="flex items-center justify-end text-white py-1 px-2 rounded">
                <div>{'Polygon'}</div>
                <label htmlFor="toggle-tesnet" className="flex items-center cursor-pointer relative ml-4" >
                  <input type="checkbox" id="toggle-example" className="sr-only" readOnly={true} checked={polygonEnabled}/>
                  <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" onClick={() => {
                    setPolygonEnabled(!polygonEnabled);
                  }}/>
                </label>
              </div>
            </div>
          </div>


          <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4"
                  onClick={onSaveSettings}>
            <p className="font-righteous">Save</p>
          </button>

          {logoutButton}
          {/*Storefront Pay Button*/}
          {/*<div className="w-full flex flex-col items-center justify-around pt-8">*/}
          {/*  <p className="font-montserrat text-white text-center text-sm mt-2">Add a Pay with Storefront button to your site, or use our sdk.</p>*/}
          {/*  {payButton}*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};
