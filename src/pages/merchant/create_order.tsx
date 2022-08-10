import React, {useState} from 'react';
import numeral from 'numeral';

import DollarIcon from '../../assets/images/dollarIcon.svg';
import {storefrontPayBaseUrl} from "../../StorefrontPaySdk";
import logoIcon from "../../assets/images/logo.svg";
import {payLink} from "../../utils/link_utils";
import {useSelector} from "react-redux";
import {selectMerchantInfo} from "../../store/selector";
import {toast} from "react-toastify";

export const CreateOrderPage = () => {
  let merchantInfo = useSelector(selectMerchantInfo);
  // const depositors = [{transactionHash: 0x212123abd, amount: 0.55}, {transactionHash: 0x212123abd, amount: 0.55}];
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState(0);

  let onEdit = () => {
  };

  function generateUrl() {
    if (orderId == '') {
      toast.error("Order Id must be valid")
      return;
    }
    if (!amount || amount == 0) {
      toast.error("Amount must be greater than zero")
      return;
    }
    const linkUrl = payLink(amount, orderId, merchantInfo?.memberAddress!!);
    window.open(linkUrl, "_blank");
    console.info(`generateUrl, redirecting to ${linkUrl}`);
  }

  const handleChange = (event: any) => {
    if (event.target.name == "orderId") {
      console.info(`setting orderId ${event.target.value}`);
      setOrderId(event.target.value);
    } else if (event.target.name == "amount") {
      console.info(`setting amount ${event.target.value}`);
      setAmount(event.target.value);
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 flex justify-center bg-black bg-opacity-10 border-2 border-secondary rounded-16xl shadow-md p-20">
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-white text-center text-xl font-bold font-righteous text-center">Create Order</p>
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-white">Order ID</p>
            <input id='orderId' name='orderId' placeholder="Your order ID" type="text" className="w-2/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-white">Order Value</p>
            <input name='amount' placeholder="0.50"  type="number" className="w-2/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white mr-8">Description</p>
            <textarea name='desc' placeholder="Order description" className="w-4/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>

          <div className="mt-10">
            <a onClick={generateUrl}>
            <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
              <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
              <p className="font-righteous">Create Order</p>
            </button>
          </a>
          </div>
        </div>

      </div>
    </div>
  );
};
