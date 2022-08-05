import React from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../assets/images/logo.svg';
import backpackLogo from '../assets/images/backpacklogo.png';
import {useWalletConnectClient} from '../contexts/walletConnect';
import {toast} from "react-toastify";
import {storefrontPayButton} from "../StorefrontPaySdk";

export const Login = () => {
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



    function onCopyLinkClicked() {
        navigator.clipboard.writeText(qrCodeUri || "");
        toast.info("Copied", {
            autoClose: 1200,
        })
    }

    const payButton = storefrontPayButton('0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004', "12323", 0.45);
    const backpackDeeplink = qrCodeUri ? `ndj-backpack://${qrCodeUri}` : '';
    return (
        <div className="w-full h-full flex items-center justify-center flex-col">
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

            {/*Storefront Pay Button*/}
            <a href={backpackDeeplink}>
                <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
                    <img className="w-8 h-8 mr-4" src={backpackLogo} alt="" />
                    <p className="font-righteous">Connect with Backpack</p>
                </button>
            </a>
            <p className="font-montserrat text-center text-white mt-2 mb-10">Or connect directly with your Backpack</p>
        </div>
    );
};

