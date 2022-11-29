import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CopyIcon from '../../assets/images/copyIcon.svg';
import {selectMerchantInfo} from "../../store/selector";
import {getAddressFromAccount} from "@walletconnect/utils";
import {useWalletConnectClient} from "../../contexts/walletConnect";
import {ellipseAddress} from "../../helpers";
import {userAction} from "../../store/actions";
import {IMerchant} from "../../models";
import {toast} from "react-toastify";
import {PAY_WITH_USDC_ENABLED} from "../../config/currencyConfig";

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const { enableToasts, session, account, disconnect} = useWalletConnectClient();
  let merchantInfo = useSelector(selectMerchantInfo);
  const [enabled, setEnabled] = useState(true);
  const [polygonEnabled, setPolygonEnabled] = useState(false);

  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName}`);
  console.log(`merchant Account ${account} add ${getAddressFromAccount(account!!)||""}`)

  const onDisconnect = () => {
    console.info(`onDisconnect called`);
    toast.info("Disconnecting...", {autoClose: 1000})
    enableToasts(false).then(r => {
      session && disconnect(true).then(r => {
        console.info(`disconnected`)
      });
    });

    session && disconnect(true).then(r => {
      console.info(`disconnected!`)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  const logoutButton =  <button onClick={onDisconnect} className="flex w-40 bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
    <p className="font-righteous">Logout</p>
  </button>

  React.useEffect(() => {
    if (merchantInfo) {
      setEnabled(merchantInfo.testnet);
    }
  }, [merchantInfo]);

  const copyAddressToClipboard = () => {
    console.info(`copying to clipboard`);
    if (account) {
      navigator.clipboard.writeText(getAddressFromAccount(account)).then(r => toast.success("Copied!", {autoClose: 1500}));
    } else {
      console.warn("no account");
    }
  }

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
      <div className="w-3/4 items-center justify-center bg-black bg-opacity-50 border-2 border-secondary rounded-16xl shadow-md p-20">
        <p className="text-white text-xl font-bold font-righteous text-center">Merchant Settings</p>

        <div className="flex flex-col items-center justify-between mt-10 px-14">
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white mr-8">Wallet Address</p>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
              {`0x${ellipseAddress(merchantInfo?.memberAddress)}`}
              <img className="ml-4 w-4 h-4 cursor-pointer" src={CopyIcon} onClick={copyAddressToClipboard}/>
            </div>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
              <p className="text-center text-white mr-8">Merchant Name</p>
              <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-4 rounded">
                {merchantInfo?.merchantName}
              </div>
          </div>

          <div className="w-full flex justify-between mt-10">
            <p className="text-center text-white  mr-8">Supported Payment Tokens</p>

            <div className="flex flex-col justify-end bg-white bg-opacity-25 py-1 px-2 rounded">

              <div className="flex items-center justify-end text-white py-1 px-2 rounded">
                <div>{'ETH'}</div>
                <label htmlFor="toggle-tesnet" className="flex items-center relative ml-4" >
                  <input type="checkbox" id="toggle-example" className="sr-only" readOnly={true} checked={true}/>
                  <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" />
                </label>
              </div>

              <div className="flex items-center justify-end text-white py-1 px-2 rounded">
                <div>{'USDC'}</div>
                <label htmlFor="toggle-tesnet" className="flex items-center cursor-pointer relative ml-4" >
                  <input type="checkbox" id="toggle-example" className="sr-only" readOnly={true} checked={PAY_WITH_USDC_ENABLED}/>
                  <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" />
                </label>
              </div>
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
                  <input type="checkbox" id="toggle-example" className="sr-only" readOnly={true} checked={false}/>
                  <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full" onClick={() => {
                    setPolygonEnabled(!polygonEnabled);
                  }}/>
                </label>
              </div>
            </div>
          </div>


          <div className="flex w-full items-center justify-around py-1 pt-5 rounded">
            {logoutButton}
            <button className="flex w-40 bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4"
                    onClick={onSaveSettings}>
              <p className="font-righteous">Save</p>
            </button>
          </div>


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
