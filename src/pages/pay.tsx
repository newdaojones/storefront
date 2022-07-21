import React, {useState} from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../assets/images/logo.svg';
import promo1 from '../assets/images/promo_image_1.svg';
import promo2 from '../assets/images/promo_image_2.svg';
import promo3 from '../assets/images/promo_image_3.svg';
import {useLocation} from "react-use";
import {extractOrderFromUrl} from "../utils/path_utils";
import {useHistory} from "react-router-dom";


/**
 * Example URL
 * http://localhost:3000/storefront/pay?orderId=1&amount=22.50
 *
 * @constructor
 */
export const Pay = () => {
    let query = useLocation().search;
    const history = useHistory();

    let order = null;
    if (!query) {
        console.log(`Invalid query data, redirecting`);
        history.replace("/error");
    } else {
        order = extractOrderFromUrl(query);
        console.log(`orderId: ${order.orderId} amount: ${order.amount}`);
    }

    const qrCodeUri = `https://test.jxndao.com/storefront/buy?${query}`;
    React.useEffect(() => {
        if (qrCodeUri) {
            const qrCode = new QRCodeStyling({
                width: 355,
                height: 355,
                type: 'svg',
                data: qrCodeUri,
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
    }, [qrCodeUri]);
    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="w-full flex items-center justify-center flex-col bg-white shadow-md  py-10">
                <div className="flex items-center justify-center ">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl font-righteous">Storefront Pay</h1>
                        <h1 className="text-sm ">testnet</h1>
                    </div>
                </div>


                <div className="w-3/4 flex justify-around py-4">
                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm">Send payment to</p>
                        <div className="flex">
                            <p className="font-bold font-righteous">Test Merchant</p><img className="w-6 h-6" src={logoIcon} alt=""/>
                        </div>
                        <p className="text-sm">0x2342...f432</p>
                    </div>
                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm ">Time remaining</p>
                        <p className="font-righteous">3 minutes</p>
                    </div>
                </div>

                <div className="flex flex-col p-4">
                    <p className="text-sm">Amount</p>
                    <p className="font-bold text-xl">{`USD $${order?.amount}`}</p>
                </div>

                <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden mt-10 qrcode">
                    <img className="w-16 h-16 absolute" src={logoIcon} alt=""/>
                </div>

                <div className="flex p-4">
                    <p className="text-sm">Order Id</p>
                    <p className="font-bold text-sm pl-4">{`${order?.orderId}`}</p>
                </div>
                <p className="mt-10">Scan with the <a className="font-bold font-righteous" href={'https://test.jxndao.com/storefront'}>Storefront App</a> to pay</p>
            </div>

            {/*Right Column*/}
            <div className="w-full flex items-center justify-center flex-col py-10">
                <div id="qrcode2" className="flex items-center justify-center rounded-10xl overflow-hidden qrcode">
                    <img className="w-16 h-16" src={logoIcon} alt=""/>
                </div>
                <h1 className="text-white text-xl text-center font-bold mx-40 mt-10">Accept Crypto Payments and Drive Incremental Sales Now!</h1>

                <img className="w-16 h-16 mt-10" src={promo1} alt=""/>
                <p className="text-white font-bold mt-4">Reach Millions of Users</p>
                <p className="text-white text-center text-sm mt-4 mx-40">Access to millions of users using wallet apps, and capitalise on the world's largest adoption rate. </p>

                <img className="w-16 h-16 mt-10" src={promo2} alt=""/>
                <p className="text-white font-bold mt-4">Lowest Cost</p>
                <p className="text-white text-center text-sm mt-4 mx-40">Pay zero transactions fees and save up to 85% on settlement fees. </p>

                <img className="w-16 h-16 mt-10" src={promo3} alt=""/>
                <p className="text-white font-bold mt-4">Easy Integration</p>
                <p className="text-white text-center text-sm mt-4 mx-40">Integrate with a few clicks using our SDK or plugins. No coding experience needed. </p>
            </div>
        </div>
    );
};
