import React, {useState} from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../../assets/images/logo.svg';
import promo1 from '../../assets/images/promo_image_1.svg';
import promo2 from '../../assets/images/promo_image_2.svg';
import promo3 from '../../assets/images/promo_image_3.svg';
import {useLocation} from "react-use";
import {extractOrderFromUrl} from "../../utils/path_utils";
import {useHistory} from "react-router-dom";
import QRCode from 'react-qr-code';
import {useDispatch, useSelector} from "react-redux";
import {userAction} from "../../store/actions";
import {selectCurrentOrder} from "../../store/selector";
import {toast} from "react-toastify";
import {ellipseAddress} from "../../helpers";
import useInterval from "@use-it/interval";
import {orderPaymentLink} from "../../utils/link_utils";


/**
 * Example URL
 * http://localhost:3000/storefront/pay?orderId=1&amount=0.25&merchantAddress=0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004
 *
 * http://localhost:3000/storefront/pay?orderId=14&amount=0.14&merchantAddress=eB58Fff80D9a9D8f6898212Cf2301B16DCFF4796
 *
 * 0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004 = Zen Sweat
 *
 * @constructor
 */
export const Pay = () => {
    let query = useLocation().search;
    const history = useHistory();
    const dispatch = useDispatch();
    const [ showBlackWhite ] = useState(true)
    const [background] = useState('#FFFFFF');
    const [foreground] = useState('#000000');
    const [size] = useState(300);

    let currentOrder = useSelector(selectCurrentOrder)
    const [count, setCount] = useState(0);

    React.useEffect(() => {
        if (query) {
            let order = null;
            try {
                order = extractOrderFromUrl(query);
                console.log(`orderId: ${order.orderTrackingId}`);
            } catch (e: any) {
                toast.error(`${e?.message}`)
            }

            if (!order?.orderTrackingId) {
                console.log(`Invalid query data, redirecting`);
                toast.error(`Invalid order trackingId on query data`)
            } else {
                if (!currentOrder) {
                    dispatch(userAction.getOrder({orderTrackingId: order.orderTrackingId}))
                } else {
                    console.log(`order already created trackingId: ${currentOrder.trackingId}`)
                }
            }
        } else  {
            console.log(`Invalid query data, redirecting`);
            history.replace("/error?msg=Invalid data query");
        }
    }, [currentOrder, dispatch, history, query]);


    const qrCodeUri = currentOrder?.trackingId ? orderPaymentLink(currentOrder.trackingId) : '';

    //automatic update
    useInterval(() => {
        if (currentOrder) {
            if (currentOrder.transactionHash) {
                console.debug(`found transaction hash, moving to status page.`);
                const relativePath = `status?transactionId=${currentOrder.transactionHash}&orderTrackingId=${currentOrder.trackingId}`
                history.replace(relativePath);
                window.location.reload();
                return;
            }

            console.log(`refreshing order data... ${count}`)
            setCount(count + 1);
            if (currentOrder.trackingId) {
                dispatch(userAction.getOrder({orderTrackingId: currentOrder.trackingId}))
            } else {
                console.error("invalid order trackingId. cannot refresh. ");
            }
        }
    }, 30000);

    React.useEffect(() => {
        if (currentOrder) {
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
    }, [currentOrder, showBlackWhite, qrCodeUri, size]);

    function onCopyLinkClicked() {
        navigator.clipboard.writeText(qrCodeUri).then(r => {
            toast.info("Copied", {
                autoClose: 1200,
            })
        });

    }

    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="h-full w-full flex items-center justify-center flex-col bg-white shadow-md">
                <div className="flex items-center justify-center pt-10">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl font-righteous">Storefront Pay</h1>
                        <h1 className="text-sm ">{currentOrder ? currentOrder?.testnet ? 'Test Money': 'Real Money' : ''}</h1>
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
                        <p className="font-bold text-xl pl-4">{`${currentOrder?.externalOrderId || ''}`}</p>
                    </div>
                    <div className="flex flex-col pb-4">
                        <p className="text-sm">Amount</p>
                        <p className="font-bold text-xl">{`USD $${currentOrder?.amount || ''}`}</p>
                    </div>
                </div>

                {currentOrder && !showBlackWhite && (
                    <a href={qrCodeUri} target={'_blank'} rel={'noreferrer'}>
                    <div className="flex items-center justify-center">
                        <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden qrcode">
                        </div>
                        <img className="w-20 h-20 absolute z-12" src={logoIcon} alt="" />
                    </div>
                    </a>
                )}
                {currentOrder && showBlackWhite && (
                    <a href={qrCodeUri} target={'_blank'} rel={'noreferrer'}>
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
                    </a>
                )}

                <p onClick={onCopyLinkClicked}
                   className="text-xs mt-1 cursor-pointer">Copy Link</p>

                {!currentOrder?.transactionHash ?
                    <p className="mt-4 mb-40">Scan with the <a className="font-bold font-righteous font-bold" href={'https://test.jxndao.com/storefront'}>Storefront App</a> to pay</p>
                    : <p className="font-righteous mt-4 mb-40 text-secondary">This order has already been paid</p>}

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
