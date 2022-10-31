import React, {useState} from 'react';
import numeral from 'numeral';

import ETHIcon from '../../assets/images/ethIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import USDCIcon from '../../assets/images/usdc.svg';
import RefreshIcon from '../../assets/images/reload.svg';
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
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col w-3/4 h-3/4 bg-black bg-opacity-10 border-2 border-secondary rounded-16xl shadow-md p-10 overflow-hidden">
        <p className="text-white text-xl font-bold font-righteous text-center">Merchant Dashboard</p>
        <div className="flex flex-col items-center justify-center">
          <p className="text-white px-10 mt-8 pt-2 font-bold font-montserrat">Payments</p>
          <div className="w-60 flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
            <img className="w-8 h-8 mr-2" src={DollarIcon} alt="" />
            {`${numeral(totalUSD || 0).format(',0.00')}`}
          </div>
          <div className="w-60 flex items-center justify-around mt-2">
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              <img className="w-8 h-8 mr-2" src={ETHIcon} alt="" />
              {`${numeral(totalEth || 0).format('0,0.0000')}`}
            </div>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded ml-6">
              <img className="w-8 h-8 mr-2" src={USDCIcon} alt="" />
              {`${numeral(totalUsdc || 0).format(',0.00')}`}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between px-10">
            <p className="text-white mt-1 py-2 font-bold font-montserrat">Orders</p>
            <div className="flex items-center items-center" >
              {/*<p className="text-white text-xs">Reload</p>*/}
              <img className="w-8 h-8 ml-2 cursor-pointer " style = {{animation: !isLoadingOrders ? '': 'spin 2s linear normal' }} src={RefreshIcon} alt="Reload Orders" onClick={refreshOrders}/>
            </div>
          </div>

          <div className="flex items-center justify-around px-2">
            <div className="grid h-full min-w-max w-full overflow-auto" style={{maxHeight: '25rem'}}>
              {
                merchantInfo?.orders && merchantInfo?.orders.length > 0 ?
                    merchantInfo?.orders.map(orderItem => (
                        <div className="pt-1">
                          <OrderRow key={orderItem.transactionHash} asset={orderItem} onEdit={onEdit}/>
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
