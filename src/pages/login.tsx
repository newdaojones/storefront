import React, { useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import logoIcon from '../assets/images/logo.svg';
import { useWalletConnectClient } from '../contexts/walletConnect';

export const Login = () => {
  const { qrCodeUri } = useWalletConnectClient();

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
              { offset: 0.4, color: 'rgb(115,44,249)' },
              { offset: 0.9, color: 'rgb(88,207,252)' },
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
    <div className="w-full h-full flex items-center justify-center flex-col">
      <h4 className="text-white">Welcome to New DAO Jones</h4>
      <div id="qrcode" className="flex items-center justify-center rounded-10xl overflow-hidden mt-8 qrcode">
        <img className="w-16 h-16 absolute" src={logoIcon} alt="" />
      </div>
      <p className="text-white mt-4">scan the thingy to connect a wallet</p>
    </div>
  );
};
