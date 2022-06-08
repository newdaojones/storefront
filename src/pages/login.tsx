import React from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../assets/images/logo.svg';
import {useWalletConnectClient} from '../contexts/walletConnect';
import {toast} from "react-toastify";

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

    return (
        <div className="w-full h-full flex items-center justify-center flex-col">
            <h4 className="font-righteous text-white mt-4">Welcome to the StoreFront DApp</h4>
            <a href={qrCodeUri} className="">
                <div id="qrcode" className="z-1 flex items-center justify-center rounded-10xl overflow-hidden mt-4 qrcode">
                    <img className="w-16 h-16 absolute z-20" src={logoIcon} alt=""/>
                </div>
            </a>
            <p onClick={onCopyLinkClicked}
               className="text-white text-xs mt-1 mb-8 cursor-pointer">Copy link</p>


            <p className="font-montserrat text-center text-white mt-2 mb-4">Scan or Tap the qrCode <br/>to connect with WalletConnect v2</p>
        </div>
    );
};
