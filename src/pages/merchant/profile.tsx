import React, {useState} from 'react';
import numeral from 'numeral';

import ETHIcon from '../../assets/images/ethIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import USDCIcon from '../../assets/images/usdc.svg';
import RefreshIcon from '../../assets/images/reload_black.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import {useDispatch, useSelector} from "react-redux";
import {selectMerchantInfo} from "../../store/selector";
import OrderRow from "../../components/orderRow";
import useInterval from "@use-it/interval";
import {userAction} from "../../store/actions";
import {IMerchant} from "../../models";
import {ETH_TOKEN, USDC_TOKEN} from "../../config/currencyConfig";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  let merchantInfo = useSelector(selectMerchantInfo);

  const [count, setCount] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [totalUsdc, setTotalUsdc] = useState(0);
  const [totalEth, setTotalEth] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);

  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName} totalUsd: ${merchantInfo?.totalInUsd}`);

  const refreshOrders = () => {
    setIsLoadingOrders(true);
    if (merchantInfo) {
      refreshOrdersForMerchant(merchantInfo);
    }

    setTimeout(() => {
      setIsLoadingOrders(false);
    }, 2000);
  }

  React.useEffect(() => {
    if (merchantInfo) {
      const paidOrders = merchantInfo.orders.filter(value => value.transactionHash !== null && value.nativeAmount);
      let ethAmount = 0;
      let usdcAmount = 0;
      let totalUsd = 0;
      for (const paidOrder of paidOrders) {
        if (paidOrder.token === ETH_TOKEN) {
          ethAmount = ethAmount + Number(paidOrder.nativeAmount);
          totalUsd+= paidOrder.amount;
        } else if (paidOrder.token === USDC_TOKEN) {
          usdcAmount = usdcAmount + paidOrder.amount;
          totalUsd+= paidOrder.amount;
        } else {
          console.warn(`token not handled for paid order: ${paidOrder.token}`)
        }
      }
      setTotalEth(ethAmount);
      setTotalUsdc(usdcAmount);
      setTotalUSD(totalUsd);
    }
  }, [merchantInfo]);
  function refreshOrdersForMerchant(merchantInfo: IMerchant) {
    console.log(`refreshing merchantInfo`)
    dispatch(userAction.merchantLoginSuccess({address: merchantInfo.memberAddress}))
  }

  useInterval(() => {
    if (merchantInfo && count < 10) {
      setIsLoadingOrders(true);
      setCount((currentCount) => currentCount + 1);
      refreshOrdersForMerchant(merchantInfo);
      setTimeout(() => {
        setIsLoadingOrders(false);
      }, 2000);
    }
  }, 30000);

  let onEdit = () => {
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col h-3/4 w-3/4 bg-contentBackground bg-opacity-25 border-4 border-secondary rounded-10xl shadow-md p-10 overflow-auto mr-8 text-black">
        <p className=" text-xl font-bold font-righteous text-center">Transaction History</p>
        <div className="flex flex-col items-center justify-center">
          <p className=" px-10 mt-4 font-bold font-montserrat">Total Payments</p>
          <div className="w-60 flex items-center justify-center bg-blueBackground  bg-opacity-25 py-1 px-2 rounded">
            <img className="w-8 h-8 mr-2" src={DollarIcon} alt="" />
            {`${numeral(totalUSD || 0).format(',0.00')}`}
          </div>
          <div className="w-60 flex items-center justify-around mt-2">
            <div className="w-40 flex items-center justify-center bg-blueBackground  bg-opacity-25 py-1 px-2 rounded mr-1">
              <img className="w-8 h-8 mr-2" src={ETHIcon} alt="" />
              {`${numeral(totalEth || 0).format('0,0.0000')}`}
            </div>
            <div className="w-40 flex items-center justify-center bg-blueBackground  bg-opacity-25 py-1 px-2 rounded ml-1">
              <img className="w-8 h-8 mr-2" src={USDCIcon} alt="" />
              {`${numeral(totalUsdc || 0).format(',0.00')}`}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between px-10">
            <p className=" mt-1 py-2 text-xl font-bold font-righteous">Order History</p>
            <div className="flex items-center items-center" >
              {/*<p className=" text-xs">Reload</p>*/}
              <img className="w-6 h-6 ml-2 cursor-pointer " style = {{animation: !isLoadingOrders ? '': 'spin 2s linear normal' }} src={RefreshIcon} alt="Reload Orders" onClick={refreshOrders}/>
            </div>
          </div>

          <div className="flex flex-col items-center justify-around px-2">
            <div className="flex  items-center justify-around  w-full overflow-auto  font-bold" style={{}}>
              <div className="" style={{width:'12rem'}}>Order Id</div>
              <div className="">Date</div>
              <div className="">Time</div>
              <div className="">Amount</div>
              <div className="">Status</div>
            </div>
            <div className="grid min-w-max w-full overflow-auto" style={{}}>
              {
                merchantInfo?.orders && merchantInfo?.orders.length > 0 ?
                    merchantInfo?.orders.map(orderItem => (
                        <div className="pt-1">
                          <OrderRow key={orderItem.transactionHash} asset={orderItem} onEdit={onEdit}/>
                        </div>)
                    )
                    :
                    <div
                        className="column justify-center text-center items-center ">
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
