import React, {useState} from 'react';
import numeral from 'numeral';
import QRIcon from '../assets/images/creditcard.svg';
import BTCIcon from '../assets/images/btcIcon.svg';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectBuyTransaction} from "../store/selector";
import {userAction} from "../store/actions";

export const BuyPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let transactionInfo = useSelector(selectBuyTransaction)

  const onBuyClick = (): void => {
    console.log(`onBuy Click ${transactionInfo}`)
    dispatch(userAction.setTransactionInfoWallet(true));
    transactionInfo = true;
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-3/4 shadow-md">
        <p className="text-white text-secondary font-bold">Payment Method</p>
        <div className="flex flex-col w-150 text-black p-8 justify-between ml-10 mr-10" style={{ backgroundImage: `url(${QRIcon})`, backgroundSize: "cover", backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <img  style={{alignSelf: 'end'}} className="w-10 h-10" src={BTCIcon} alt=""/>
          <p style={{fontFamily: 'Montserrat', fontStyle: 'normal', color: '#8E8EA9'}} className="pt-2">0xff43...038d</p>
          <div className="flex w-full justify-between" style={{fontFamily: 'Righteous', fontStyle: 'normal', color: '#8E8EA9'}} >
            <p className="text-grey text-sm">notdevin.eth</p>
            <p className="text-grey text-sm">Bitcoin</p>
          </div>

        </div>
        <div className="flex items-center justify-center mt-6">
          <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
            <div className="w-full flex justify-between p-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Items Total</p>
              <p className="text-white text-start text-xs mr-2 mt-2">$ 45.00</p>
            </div>
            <div className="w-full flex justify-between pl-4 pr-4">
              <p className="text-white text-start text-xs mr-2">Transaction Fee</p>
              <p className="text-white text-start text-xs mr-2">$ 5.00</p>
            </div>
            <div className="flex flex-col w-full text-secondary mt-4 justify-between" style={{ height: 1, backgroundColor: '#FFB01D', backgroundRepeat: "no-repeat"}}/>
            <div className="w-full flex justify-between p-4">
              <p className="text-white text-start text-xs mr-2 mt-2">Subtotal</p>
              <p className="text-white text-start text-xs mr-2 mt-2">$ 50.00</p>
            </div>
            <div className="w-full flex justify-between pl-4 pr-4 pb-6">
              <p className="text-white text-start text-xs mr-2">Total Price</p>
              <p className="text-start text-secondary text-xs mr-2">$ 50.00</p>
            </div>
          </div>
        </div>

        <button onClick={onBuyClick} style={{
          backgroundColor: '#615793',
          fontSize: '20px',
          padding: '10px 20px',
          borderRadius: '25px',
          margin: '10px 0px',
          cursor: 'pointer'
        }} className="w-full text-white mt-8 mb-4">
          {(transactionInfo === true) ? "Loading" :`Pay $50.00`}
        </button>
      </div>
    </div>
  );
};
