import React from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../../assets/images/logo.svg';
import {useWalletConnectClient} from '../../contexts/walletConnect';
import {toast} from "react-toastify";

export const MerchantLogin = () => {
    const {qrCodeUri} = useWalletConnectClient();

    React.useEffect(() => {
        if (qrCodeUri) {
            const qrCode = new QRCodeStyling({
                width: 255,
                height: 255,
                type: 'svg',
                data: qrCodeUri,
                dotsOptions: {
                    type: 'dots',
                    gradient: {
                        type: 'linear',
                        rotation: 90,
                        colorStops: [
                            {offset: 0.4, color: '#d2cdff'},
                            {offset: 0.9, color: '#c1f8ff'},
                        ],
                    },
                },
                cornersDotOptions: {
                    color: '#00ff83',
                },
                cornersSquareOptions: {
                    color: '#7e18ff',
                    type: 'extra-rounded',
                },
                backgroundOptions: {
                    color: '#13053d',
                },
            });

            const qrCodeElement = document.getElementById('qrcode') as any;
            qrCodeElement.innerHTML = '';
            qrCode.append(qrCodeElement);
        }
    }, [qrCodeUri]);



    function onCopyLinkClicked() {
        navigator.clipboard.writeText(qrCodeUri || "");
        toast.info("Copied", {
            autoClose: 1200,
        })
    }

    return (
        <div className="h-screen w-screen flex">
            <div className="w-full flex flex-col items-center justify-center pt-10">
                <div className="flex items-center justify-center ">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl text-white font-righteous">Storefront Pay</h1>
                        <h4 className="font-righteous text-white">Merchant Login</h4>
                    </div>
                </div>


                <div className="w-full flex flex-col items-center justify-center py-4">

                    <a href={qrCodeUri} className="">
                        <div className="flex items-center justify-center pt-2">
                            <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden qrcode">
                            </div>
                            <img className="w-20 h-20 absolute z-10" src={logoIcon} alt="" />
                        </div>
                    </a>
                    <p onClick={onCopyLinkClicked}
                       className="text-white text-xs mt-1 mb-8 cursor-pointer">Copy link</p>
                    <p className="font-montserrat text-center text-white mt-2 mb-10">Scan or Tap the QrCode <br/>to connect with WalletConnect v2</p>

                </div>
            </div>
        </div>
    );
};
