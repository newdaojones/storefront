import React, { useState } from 'react';
import numeral from 'numeral';

import ETHIcon from '../../assets/images/ethIcon.svg';
import DollarIcon from '../../assets/images/dollarIcon.svg';
import USDCIcon from '../../assets/images/usdc.svg';
import ExpandArrow from '../../assets/images/down_arrow.svg';
import RefreshIcon from '../../assets/images/reload_black.svg';
import ExportIcon from '../../assets/images/export_icon.svg';
import NotFoundImage from '../../assets/images/notfound.gif';
import { useDispatch, useSelector } from "react-redux";
import { selectMerchantInfo } from "../../store/selector";
import OrderRow from "../../components/orderRow";
import useInterval from "@use-it/interval";
import { userAction } from "../../store/actions";
import { IMerchant, IOrderDateRange } from "../../models";
import { ETH_TOKEN, USDC_TOKEN } from "../../config/currencyConfig";
import { formatDate, getCurrentMonthDateRange } from "../../utils";
import { DatePickerModal } from "../../components/dateRangePickerModal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  let merchantInfo = useSelector(selectMerchantInfo);

  const [count, setCount] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [totalUsdc, setTotalUsdc] = useState(0);
  const [totalEth, setTotalEth] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);

  //FIXME add date range state
  const [selectedDateRange, setSelectedDateRange] = useState(getCurrentMonthDateRange());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateIndicator, setDateIndicator] = useState("Current Month");

  console.log(`merchant ${merchantInfo} add ${merchantInfo?.memberAddress} ${merchantInfo?.merchantName} totalUsd: ${merchantInfo?.totalInUsd}`);

  const refreshOrders = (events: any, dateRanges: IOrderDateRange = selectedDateRange) => {
    setIsLoadingOrders(true);
    if (merchantInfo) {
      refreshOrdersForMerchant(merchantInfo, dateRanges);
    } else {
      console.warn(`no merchant info`)
    }

    setTimeout(() => {
      setIsLoadingOrders(false);
    }, 2000);
  }

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }

  const openCloseDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
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
          totalUsd += paidOrder.amount;
        } else if (paidOrder.token === USDC_TOKEN) {
          usdcAmount = usdcAmount + paidOrder.amount;
          totalUsd += paidOrder.amount;
        } else {
          console.warn(`token not handled for paid order: ${paidOrder.token}`)
        }
      }
      setTotalEth(ethAmount);
      setTotalUsdc(usdcAmount);
      setTotalUSD(totalUsd);
    }
  }, [merchantInfo]);

  function refreshOrdersForMerchant(merchantInfo: IMerchant, dateRange: IOrderDateRange) {
    console.log(`refreshing merchantInfo for dates: ${dateRange.startDate} ${dateRange.endDate}`)
    dispatch(userAction.merchantLoginSuccess({ address: merchantInfo.memberAddress, dateRange: dateRange }))
  }

  // useInterval(() => {
  //   if (merchantInfo && count < 10) {
  //     setIsLoadingOrders(true);
  //     setCount((currentCount) => currentCount + 1);
  //     refreshOrdersForMerchant(merchantInfo, selectedDateRange);
  //     setTimeout(() => {
  //       setIsLoadingOrders(false);
  //     }, 2000);
  //   }
  // }, 60000);

  let onEdit = () => {
  };

  const onCloseDatePicker = () => {
    console.info(`close date picker`)
    setIsDatePickerOpen(false)
  };

  const exportData = async () => {
    console.warn(`exporting pdf...`)
    const pdf = new jsPDF("portrait", "pt", "a4");
    const element = document.querySelector("#pdf");
    if (!element) {
      console.warn("invalid pdf element");
      return;
    }
    const data = await html2canvas(element as HTMLElement, { scale: 1.5 });
    const img = data.toDataURL("image/png");
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth() * 0.9;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(img, "PNG", 10, 40, pdfWidth, pdfHeight);
    pdf.save("merchant_orders.pdf");
  };

  const onSelect = (startDate: Date, endDate: Date) => {
    const start = startDate.toISOString()
    const end = endDate.toISOString()
    console.info(`onSelect date picker start: ${start} end: ${end}`)

    setIsDatePickerOpen(false);
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    setDateIndicator(`${formattedStart} - ${formattedEnd}`)
    let newDateRange = {
      startDate: start,
      endDate: end
    };
    setSelectedDateRange(newDateRange);
    console.info(`refreshing orders after date selection`)
    refreshOrders(null, newDateRange);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col h-4/5 w-3/4 bg-contentBackground border-4 border-secondary rounded-10xl shadow-md p-6 overflow-auto mr-8 text-black">
        <p className=" text-xl font-bold font-montserrat text-center">{`${merchantInfo?.merchantName}'s Dashboard`}</p>
        <div className="flex flex-col items-center justify-center">
          <div className="mt-4 flex items-center justify-center">
            <p className="text-sm cursor-pointer" onClick={openCloseDatePicker} >{dateIndicator}</p>
            <img className="w-6 h-6 mr-2 cursor-pointer" src={ExpandArrow} onClick={openCloseDatePicker} alt="" />
            <DatePickerModal onClose={onCloseDatePicker} onSelect={onSelect} open={isDatePickerOpen} />
          </div>
          <p className=" px-10 mt-4 font-bold font-montserrat">Gross Sales</p>
          <p className="px-2 mt-4 mb-1 font-montserrat bg-black text-white rounded">USD</p>
          <div className="flex items-center justify-center bg-blueBackground py-1 px-2 text-2xl">
            {/*<img className="w-8 h-8 mr-2" src={DollarIcon} alt="" />*/}
            {`${numeral(totalUSD || 0).format(',0.00')}`}
          </div>
          {/*total in eth & usd*/}
          {/*<div className="w-60 flex items-center justify-around mt-2">*/}
          {/*  <div className="w-40 flex items-center justify-center bg-blueBackground  bg-opacity-25 py-1 px-2 rounded mr-1">*/}
          {/*    <img className="w-8 h-8 mr-2" src={ETHIcon} alt="" />*/}
          {/*    {`${numeral(totalEth || 0).format('0,0.0000')}`}*/}
          {/*  </div>*/}
          {/*  <div className="w-40 flex items-center justify-center bg-blueBackground  bg-opacity-25 py-1 px-2 rounded ml-1">*/}
          {/*    <img className="w-8 h-8 mr-2" src={USDCIcon} alt="" />*/}
          {/*    {`${numeral(totalUsdc || 0).format(',0.00')}`}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <div className="h-full mt-4 bg-blueBackground rounded-xl pb-6 pr-4" >
          <div className="flex items-center justify-center px-4 py-4">
            <p className="mt-1 py-2 text-xl font-bold font-righteous">Transaction History</p>
            <div className="flex items-center items-center" >
              <img className="w-4 h-4 ml-2 cursor-pointer " title="Reload" style={{ animation: !isLoadingOrders ? '' : 'spin 2s linear normal' }} src={RefreshIcon} alt="Reload Orders" onClick={refreshOrders} />
              <img className="w-5 h-5 ml-2 cursor-pointer " title="Export" src={ExportIcon} alt="Reload Orders" onClick={exportData} />
            </div>
          </div>

          <div id="pdf" className="flex flex-col items-center justify-around px-1">
            <div className="w-full flex items-center justify-between overflow-auto font-bold pr-6 pb-2" style={{}}>
              <div className=""></div>
              <div className="" style={{ width: '15%' }}>ORDER ID</div>
              <div className="">DATE</div>
              <div className="">TIME</div>
              <div className="">TOTAL</div>
              <div className="">STATUS</div>
            </div>
            <div className="grid w-full">
              {
                merchantInfo?.orders && merchantInfo?.orders.length > 0 ?
                  merchantInfo?.orders.map(orderItem => (
                    <div key={orderItem.trackingId} className="pt-1">
                      <OrderRow key={orderItem.trackingId} asset={orderItem} onEdit={onEdit} />
                    </div>)
                  )
                  :
                  <div
                    className="column justify-center text-center items-center ">
                    <img className="w-140 h-40 inline" src={NotFoundImage} alt="" />
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
