import React, {useState} from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../assets/images/logo.svg';
import promo1 from '../assets/images/promo_image_1.svg';
import promo2 from '../assets/images/promo_image_2.svg';
import promo3 from '../assets/images/promo_image_3.svg';

export const Pay = () => {
    const qrCodeUri = "http://localhost";

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
            <div className="w-full h-full flex items-center justify-center flex-col bg-white shadow-md">
                <h1 className="text-xl font-righteous">Storefront Pay</h1>
                <h1 className="text-sm ">testnet</h1>

                <div className="w-3/4 flex justify-around mt-10 py-4">
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

                <p className="mt-4 font-bold text-xl">USD $19.90</p>

                <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden mt-10 qrcode">
                    <img className="w-16 h-16 absolute" src={logoIcon} alt=""/>
                </div>
                <p className="mt-10">Scan with the Storefront App to pay</p>
            </div>

            {/*Right Column*/}
            <div className="w-full h-full flex items-center justify-center flex-col pt-20">
                <h1 className="text-white text-xl text-center font-bold mx-30 ">Accept Crypto Payments and Drive Incremental Sales Now!</h1>
                <div id="qrcode2" className="flex items-center justify-center rounded-10xl overflow-hidden mt-8 qrcode">
                    <img className="w-16 h-16 absolute" src={logoIcon} alt=""/>
                </div>
                <img className="w-16 h-16 mt-4" src={promo1} alt=""/>
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
