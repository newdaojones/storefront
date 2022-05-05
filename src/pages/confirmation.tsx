import React from 'react';
import { BigNumber, utils } from "ethers";
import QRIcon from '../assets/images/qrCodeIcon.svg';
import SearchIcon from "../assets/images/bxs_search-alt-2.svg";
import {useDispatch, useSelector} from "react-redux";
import {selectAccountInfo, selectBuyTransaction} from "../store/selector";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {getBalanceInUSD} from "../helpers/tx";
import {useHistory} from "react-router-dom";
import {convertHexToNumber, ellipseAddress, sanitizeDecimals} from "../helpers";

export const ConfirmationPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accountInfo = useSelector(selectAccountInfo)
  const { accounts, balances } = useWalletConnectClient();
  const accountBalance = getBalanceInUSD(accounts, balances);

  let transactionInfo = useSelector(selectBuyTransaction)

  const onHomeClick = (): void => {
    //history.push("/profile")
      history.go(-2)
  }

  const onQRCodeClick = (): void => {
    console.info(`transaction link: https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/${transactionInfo?.transactionHash}`)
  };
  let weiNumber = convertHexToNumber(transactionInfo?.value!!);
  console.info(`wei number ${weiNumber}`)
  const bigN = BigNumber.from(weiNumber.toString())
  const formatted = utils.formatUnits(bigN, "ether")

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-3/4 m-10">
        <p className="text-white text-secondary font-bold">Payment Successful</p>
        {/*QR CODE*/}
          <div className="w-full flex flex-col items-center justify-center ">
            <img style={{alignSelf: "center", justifySelf:"center"}} className="w-30 h-30 min-w-max items-center justify-center p-4" src={QRIcon} alt="" onClick={onQRCodeClick} />
          </div>
      {/*Invoice*/}
          <div className="flex items-center justify-center mt-1">
            <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
              <div className="w-full flex justify-between p-4">
                <p className="text-white text-start text-xs mr-2 mt-2">Items Total</p>
                <p className="text-white text-start text-xs mr-2 mt-2">$ 45.00</p>
              </div>
              <div className="w-full flex justify-between pl-4 pr-4">
                <p className="text-white text-start text-xs mr-2">Transaction Fee</p>
                <p className="text-white text-start text-xs mr-2">$ 5.00</p>
              </div>
              <div className="w-full flex justify-between mt-4 pl-4 pr-4 pb-6">
                <p className="text-white text-start text-xs mr-2">Total Price</p>
                <p className="text-start text-secondary text-xs mr-2">$ 50.00</p>
              </div>
            </div>
          </div>
      {/*Transaction Info*/}
          <div className="flex items-center justify-center mt-4">
              <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
                  <div className="w-full flex justify-between p-4">
                      <p className="text-white text-start text-xs mr-2 mt-2">Transaction Hash</p>
                      <a target="_blank" rel='noreferrer' className="link cursor-pointer"
                         href={`https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/${transactionInfo?.transactionHash}`}>
                          {/*<img className="w-8 h-8 mt-2 justify-center" src={SearchIcon} alt=""/>*/}
                          <p className="text-white text-start text-xs mr-2 mt-2">{ellipseAddress(transactionInfo?.transactionHash)}</p>
                      </a>

                  </div>
                  <div className="w-full flex justify-between pl-4 pr-4">
                      <p className="text-white text-start text-xs mr-2">From Address</p>
                      <p className="text-white text-start text-xs mr-2">{ellipseAddress(transactionInfo?.fromAddress)}</p>
                  </div>
                  <div className="w-full flex justify-between p-4">
                      <p className="text-white text-start text-xs mr-2">To Address</p>
                      <p className="text-white text-start text-xs mr-2">{ellipseAddress(transactionInfo?.toAddress)}</p>
                  </div>
                  <div className="w-full flex justify-between pl-4 pr-4 pb-6">
                      <p className="text-white text-start text-xs mr-2">Amount</p>
                      <p className="text-start text-secondary text-xs mr-2">{formatted}</p>
                  </div>
              </div>
          </div>

          <button onClick={onHomeClick} style={{
              backgroundColor: '#615793',
              fontSize: '20px',
              padding: '10px 20px',
              borderRadius: '25px',
              margin: '10px 0px',
              cursor: 'pointer'
          }} className="w-full text-white mt-8 mb-4">Back
          </button>
      </div>
    </div>
  );
};