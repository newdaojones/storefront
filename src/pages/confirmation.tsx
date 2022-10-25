import React, {useState} from 'react';
import {BigNumber, utils} from "ethers";
import {useDispatch, useSelector} from "react-redux";
import {selectBuyTransaction} from "../store/selector";
import {useHistory} from "react-router-dom";
import {convertHexToNumber, ellipseAddress, toWad} from "../helpers";
import {useWalletConnectClient} from "../contexts/walletConnect";
import {userAction} from "../store/actions";
import logoIcon from "../assets/images/logo.svg";
import QRCodeStyling from "qr-code-styling";
import {transactionStatusLink} from "../utils/link_utils";
import {ETH_TOKEN, getFormattedTokenValue, USDC_DECIMALS, USDC_TOKEN} from "../config/currencyConfig";
import {toast} from "react-toastify";

export const ConfirmationPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
        refreshBalances,
        accounts,
  } = useWalletConnectClient();

  let transactionInfo = useSelector(selectBuyTransaction)
  const [linkUrl, setLinkUrl] = useState('');

    if (!transactionInfo?.transactionHash) {
        console.warn("transactionHash not present, moving to home.");
        history.replace("/")
    }

    function getTotalPriceInNativeToken(): string {
        if (!transactionInfo?.order.token) {
            console.warn("Invalid order token");
            return "";
        }
        const token = transactionInfo?.order.token;
        let amount: BigNumber;
        if (token === ETH_TOKEN) {
            const weiNumber = convertHexToNumber(transactionInfo?.transaction?.value!!) || 0;
            amount = BigNumber.from(weiNumber.toString())
        } else if (token === USDC_TOKEN) {
            amount = toWad(transactionInfo?.order.amount.toString(), USDC_DECIMALS);
        } else {
            throw new Error("unhandled token");
        }

        return getFormattedTokenValue(transactionInfo?.order.token, amount)
    }

    const formatted = getTotalPriceInNativeToken();

    if (!transactionInfo?.order.trackingId || !transactionInfo.transactionHash) {
        console.error(`can't set order transaction hash since orderTrackingId: ${transactionInfo?.order.trackingId} or transactionHash: ${transactionInfo?.transactionHash} are not valid.`)
    } else {
        dispatch(userAction.setOrderTransactionHash({
            orderTrackingId: transactionInfo?.order.trackingId,
            transactionHash: transactionInfo?.transactionHash,
            nativeAmount: transactionInfo.order.nativeAmount || "0",
            token: transactionInfo.order.token,
        }));
    }

    const onHomeClick = async () => {
      await refreshBalances(accounts).then(r => {
          console.info(`refreshing balances on home click`)
      });
      dispatch(userAction.unsetTransaction());
  }

   React.useEffect(() => {
        if (transactionInfo) {

            if (!transactionInfo.transactionHash) {
                console.warn("no transaction hash found");
                return;
            }
            const link = transactionStatusLink(transactionInfo?.transactionHash, transactionInfo?.order.trackingId!!);
            setLinkUrl(link);
            const qrCode = new QRCodeStyling({
                width: 255,
                height: 255,
                type: 'svg',
                data: link,
                dotsOptions: {
                    type: 'dots',
                    gradient: {
                        type: 'linear',
                        rotation: 90,
                        colorStops: [
                            {offset: 0.4, color: 'rgb(115,44,249)'},
                            {offset: 0.9, color: 'rgb(88,207,252)'},
                        ],
                    },
                },
                cornersDotOptions: {
                    color: 'rgb(0,255,139)',
                },
                cornersSquareOptions: {
                    color: 'rgb(255,0,196)',
                    type: 'extra-rounded',
                },
                backgroundOptions: {
                    color: 'rgb(15,7,60)',
                },
            });

            const qrCodeElement = document.getElementById('qrcode') as any;
            qrCodeElement.innerHTML = '';
            qrCode.append(qrCodeElement);
        }
    }, [transactionInfo]);


    return (
    <div className="w-full h-full flex justify-center">
      <div className="w-3/4 m-10">
        <p className="text-white text-terciary font-bold">Payment Successful</p>
        {/*QR CODE*/}
          <a target="_blank" rel='noreferrer' className="p-10 link cursor-pointer" href={linkUrl}>
              <div className="flex items-center justify-center">
                  <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden qrcode">
                  </div>
                  <img className="w-20 h-20 absolute z-12" src={logoIcon} alt="" />
              </div>
          </a>

      {/*Invoice*/}
          <div className="w-full flex items-center justify-center mt-2">
              <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
                  <div className="w-full flex justify-between p-4">
                      <p className="text-white text-start text-xs mr-2 mt-2">Items Total</p>
                      <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${transactionInfo?.paymentValueUsd.toFixed(2)}`}</p>
                  </div>
                  <div className="w-full flex justify-between pl-4 pr-4">
                      <p className="text-white text-start text-xs mr-2 mt-2">Transaction Fee</p>
                      <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${transactionInfo?.paymentFeeUsd.toFixed(6)}`}</p>
                  </div>
                  <div className="flex flex-col w-full text-secondary mt-4 justify-between" style={{ height: 1, backgroundColor: '#FFB01D', backgroundRepeat: "no-repeat"}}/>
                  <div className="w-full flex justify-between p-4">
                      <p className="text-white text-start text-xs mr-2 mt-2">Subtotal</p>
                      <p className="text-white text-start text-xs mr-2 mt-2">{`$ ${transactionInfo?.paymentTotalUSD.toFixed(2)}`}</p>
                  </div>
                  <div className="w-full flex justify-between pl-4 pr-4 pb-6">
                      <p className="text-white text-start text-base mr-2">Total Price</p>
                      <p className="text-start text-terciary text-base mr-2">{`$ ${transactionInfo?.paymentTotalUSD.toFixed(2)}`}</p>
                  </div>
              </div>
          </div>
      {/*Transaction Info*/}
          <div className="flex items-center justify-center mt-4">
              <div  style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
                  <div className="w-full flex justify-between p-4">
                      <p className="text-white text-start text-xs mr-2 mt-2">Transaction Hash</p>
                      <a target="_blank" rel='noreferrer' className="link cursor-pointer"
                         href={linkUrl}>
                          {/*<img className="w-8 h-8 mt-2 justify-center" src={SearchIcon} alt=""/>*/}
                          <p className="text-white text-start text-xs mr-2 mt-2">{ellipseAddress(transactionInfo?.transactionHash || "")}</p>
                      </a>

                  </div>
                  <div className="w-full flex justify-between pl-4 pr-4">
                      <p className="text-white text-start text-xs mr-2">From Address</p>
                      <p className="text-white text-start text-xs mr-2">{ellipseAddress(transactionInfo?.transaction?.from)}</p>
                  </div>
                  <div className="w-full flex justify-between p-4">
                      <p className="text-white text-start text-xs mr-2">To Address</p>
                      <p className="text-white text-start text-xs mr-2">{ellipseAddress(transactionInfo?.transaction?.to)}</p>
                  </div>
                  <div className="w-full flex justify-between pl-4 pr-4 pb-6">
                      <p className="text-white text-start text-xs mr-2">Amount</p>
                      <p className="text-start text-terciary text-xs mr-2">{`${formatted}`}</p>
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
