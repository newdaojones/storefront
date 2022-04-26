import React, {useState} from 'react';
import numeral from 'numeral';

import BTCIcon from '../assets/images/btcIcon.svg';
import QRIcon from '../assets/images/qRCodeIcon.svg';
import DollarIcon from '../assets/images/dollarIcon.svg';

export const getFormat = (prefix: string, suffix: string, digits: number = 0) => {
  const formatArray: any[] = [prefix];
  if (digits) {
    formatArray.push('.');
    for (let i = 0; i < Array(digits).length; i += 1) {
      formatArray.push('0');
    }
  }
  formatArray.push(suffix);
  return formatArray.join('');
};

// export const formatValues = (value1: number, value2: number, prefix: string, suffix: string, comma: number = 0) => {
//   let format = getFormat(prefix, suffix, comma);
//
//   if ((!value1 && !value2) || value1 === value2) {
//     return [numeral(value1).format(format), numeral(value2).format(format)];
//   }
//   let digits = comma;
//
//   while (true) {
//     format = getFormat(prefix, suffix, digits);
//
//     const val1 = numeral(value1).format(format);
//     const val2 = numeral(value2).format(format);
//
//     const valNum1 = Number(val1.replace(/\D/g, ''));
//     const valNum2 = Number(val2.replace(/\D/g, ''));
//
//     if (valNum1 && valNum2 && val1 !== val2) {
//       return [val1, val2];
//     }
//
//     digits += 1;
//
//     if (digits > 10) {
//       format = getFormat(prefix, suffix, comma);
//       return [numeral(value1).format(format), numeral(value2).format(format)];
//     }
//   }
// };

export const ProfilePage = () => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-1/2 min-w-max shadow-md p-10">
        <img className="w-full p-10" src={QRIcon} alt="" />
        <p className="text-white text-center font-bold">Scan QR Code</p>
        <div className="mt-4">
          <p className="text-center text-white text-sm" style={{fontFamily: 'Righteous', fontStyle: 'normal',}}>
              Scan the qRCode provided by the store to checkout</p>

        </div>
        <div className="flex items-center justify-center mt-10">
          <div className="w-full flex flex-col items-center justify-center bg-white text-white bg-opacity-10 py-1 px-2 rounded-10xl">
            <p style={{fontFamily: 'Righteous', fontStyle: 'normal',}}
               className="text-white text-start text-xs mr-2 mt-2">Current Balance</p>
            <div className="flex items-center">
              <p className="text-white text-center font-bold">
                <p style={{fontSize: "xx-large", fontFamily: 'Montserrat', fontStyle: 'normal',}} >{numeral(2.3434 || 0).format('0,0.00')}</p>
              </p>
              <p style={{fontFamily: 'Righteous', fontStyle: 'normal',}} className="text-white text-center font-bold text-sm pt-2 ml-1">
                USD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
