import React, {useState} from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../assets/images/logo.svg';
import promo1 from '../assets/images/promo_image_1.svg';
import promo2 from '../assets/images/promo_image_2.svg';
import promo3 from '../assets/images/promo_image_3.svg';
import {useLocation} from "react-use";
import {extractOrderFromUrl} from "../utils/path_utils";
import {useHistory} from "react-router-dom";
import QRCode from 'react-qr-code';
import {storefrontPayBaseUrl} from "../StorefrontPaySdk";
import {useDispatch, useSelector} from "react-redux";
import {userAction} from "../store/actions";
import {IOrder} from "../models";
import {selectBuyTransaction, selectCurrentOrder} from "../store/selector";
import {toast} from "react-toastify";
import {ellipseAddress} from "../helpers";


/**
 * Example URL
 * http://localhost:3000/storefront/pay?orderId=1&amount=0.25&merchantAddress=0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004
 *
 * 0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004 = Zen Sweat
 *
 * @constructor
 */
export const Pay = () => {
    let query = useLocation().search;
    const history = useHistory();
    const dispatch = useDispatch();
    const [ showBlackWhite, setShowBlackWhite ] = useState(false)
    const [background] = useState('#FFFFFF');
    const [foreground] = useState('#000000');
    const [size] = useState(300);

    let currentOrder = useSelector(selectCurrentOrder)

    let order = null;
    if (!query) {
        console.log(`Invalid query data, redirecting`);
        history.replace("/error?msg=Invalid data query");
    } else {
        try {
            order = extractOrderFromUrl(query);
            console.log(`orderId: ${order.externalOrderId} amount: ${order.amount}`);
        } catch (e: any) {
            toast.error(`${e?.message}`)
        }
    }

    //TODO create the order and populate the qr with that tracking Id, to let it fetch data.

    if (!order?.externalOrderId) {
        console.log(`Invalid query data, redirecting`);
        history.replace("/error");
    } else {
        if (!currentOrder) {
            console.log(`creating order`)
            let orderInstance: IOrder = {
                amount: order.amount,
                externalOrderId: order?.externalOrderId,
                //FIXME hardcoded merchant data like testnet = true
                testnet: true,
                token: "USD",
                toAddress: order.merchantAddress,
                transactionHash: null,
                nativeAmount: null
            };
            dispatch(userAction.createOrder(orderInstance));
        } else {
            console.log(`order created trackingId: ${currentOrder.trackingId}`)
        }
    }

    var qrCodeUri = currentOrder ? `${storefrontPayBaseUrl}/storefront/home${query}&orderTrackingId=${currentOrder.trackingId}` : '';
    React.useEffect(() => {
        if (currentOrder) {
            //const qrCodeUri = `${storefrontPayBaseUrl}/storefront/home${query}&orderTrackingId=${currentOrder?.trackingId}`
            let black = 'rgb(0,0,0)';
            const qrCode = new QRCodeStyling({
                width: size,
                height: size,
                type: 'svg',
                data: qrCodeUri,
                dotsOptions: {
                    type: showBlackWhite? 'square':'dots',
                    gradient: {
                        type: 'linear',
                        rotation: 90,
                        colorStops: [
                            {offset: 0.4, color: showBlackWhite ? black:'rgb(115,44,249)'},
                            {offset: 0.9, color: showBlackWhite ? black:'rgb(88,207,252)'},
                        ],
                    },
                },
                cornersDotOptions: {
                    color: showBlackWhite ? black:'rgb(0,255,139)',
                },
                cornersSquareOptions: {
                    color: showBlackWhite ? 'rgb(155,0,96)':'rgb(255,0,196)',
                    type: showBlackWhite ? 'square' : 'extra-rounded',
                },
                backgroundOptions: {
                    color: showBlackWhite ? 'rgb(255,255,255)':'rgb(15,7,60)',
                },
            });

            const qrCodeElement = document.getElementById('qrcode') as any;
            if (qrCodeElement) {
                qrCodeElement.innerHTML = '';
                qrCode.append(qrCodeElement);
            }
        }
    }, [currentOrder, showBlackWhite]);

    function onTroubleScanningClicked() {
        setShowBlackWhite(!showBlackWhite);
    }

    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="h-full w-full flex items-center justify-center flex-col bg-white shadow-md">
                <div className="flex items-center justify-center pt-10">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl font-righteous">Storefront Pay</h1>
                        <h1 className="text-sm ">Paper money</h1>
                    </div>
                </div>


                <div className="w-3/4 flex justify-around py-4">
                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm">Send payment to</p>
                        <div className="flex">
                            <p className="font-bold font-righteous">{currentOrder?.merchantName || ""}</p><img className="w-6 h-6" src={logoIcon} alt=""/>
                        </div>
                        <p className="text-sm">{ellipseAddress(currentOrder?.toAddress)}</p>
                    </div>


                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm ">Time remaining</p>
                        <p className="font-righteous">3 minutes</p>
                    </div>
                </div>
                <div className="w-3/4 flex justify-around pb-4">
                    <div className="flex flex-col pb-4">
                        <p className="text-sm">Order Id</p>
                        <p className="font-bold text-xl pl-4">{`${order?.externalOrderId}`}</p>
                    </div>
                    <div className="flex flex-col pb-4">
                        <p className="text-sm">Amount</p>
                        <p className="font-bold text-xl">{`USD $${order?.amount}`}</p>
                    </div>
                </div>

                {currentOrder && !showBlackWhite && (
                    <a href={qrCodeUri} target={'_blank'}>
                    <div className="flex items-center justify-center">
                        <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden qrcode">
                        </div>
                        <img className="w-20 h-20 absolute z-12" src={logoIcon} alt="" />
                    </div>
                    </a>
                )}
                {currentOrder && showBlackWhite && (
                    <div className="flex items-center justify-center">
                        <QRCode
                            title="Storefront Pay"
                            value={qrCodeUri}
                            bgColor={background}
                            fgColor={foreground}
                            size={!size ? 0 : size}
                        >
                        </QRCode>
                        <img className="w-20 h-20 absolute z-12" src={logoIcon} alt="" />
                    </div>
                )}

                <p onClick={onTroubleScanningClicked}
                   className="text-xs mt-1 cursor-pointer">Trouble Scanning?</p>

                <p className="mt-4 mb-40">Scan with the <a className="font-bold font-righteous" href={'https://test.jxndao.com/storefront'}>Storefront App</a> to pay</p>

            </div>

            {/*Right Column*/}
            <div className="w-full flex items-center justify-center flex-col py-10">
                <div id="logo" className="flex items-center justify-center rounded-10xl overflow-hidden">
                    <img className="w-16 h-16" src={logoIcon} alt=""/>
                </div>
                <h1 className="text-white text-xl text-center font-bold mx-40 mt-10">Accept Crypto Payments and Drive Incremental Sales Now!</h1>

                <img className="w-16 h-16 mt-10" src={promo1} alt=""/>
                <p className="text-white font-bold mt-4">Reach Millions of Users</p>
                <p className="text-white text-center text-sm mt-4 mx-10">Access to millions of users using wallet apps, and capitalise on the world's largest adoption rate. </p>

                <img className="w-16 h-16 mt-10" src={promo2} alt=""/>
                <p className="text-white font-bold mt-4">Lowest Cost</p>
                <p className="text-white text-center text-sm mt-4 mx-10">Pay zero transactions fees and save up to 85% on settlement fees. </p>

                <img className="w-16 h-16 mt-10" src={promo3} alt=""/>
                <p className="text-white font-bold mt-4">Easy Integration</p>
                <p className="text-white text-center text-sm mt-4 mx-10">Integrate with a few clicks using our SDK or plugins. No coding experience needed. </p>
            </div>
        </div>
    );
};
