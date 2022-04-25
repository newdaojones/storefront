import React, {useState} from 'react';
import numeral from 'numeral';

import BTCIcon from '../assets/images/btcIcon.svg';
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

export const formatValues = (value1: number, value2: number, prefix: string, suffix: string, comma: number = 0) => {
  let format = getFormat(prefix, suffix, comma);

  if ((!value1 && !value2) || value1 === value2) {
    return [numeral(value1).format(format), numeral(value2).format(format)];
  }
  let digits = comma;

  while (true) {
    format = getFormat(prefix, suffix, digits);

    const val1 = numeral(value1).format(format);
    const val2 = numeral(value2).format(format);

    const valNum1 = Number(val1.replace(/\D/g, ''));
    const valNum2 = Number(val2.replace(/\D/g, ''));

    if (valNum1 && valNum2 && val1 !== val2) {
      return [val1, val2];
    }

    digits += 1;

    if (digits > 10) {
      format = getFormat(prefix, suffix, comma);
      return [numeral(value1).format(format), numeral(value2).format(format)];
    }
  }
};

export const ProfilePage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/2 min-w-max bg-white bg-opacity-25 border-2 border-secondary rounded-16xl shadow-md p-10">
        <p className="text-white text-center">Member Stats</p>
        <div className="mt-4">
          <p className="text-center text-white">Value of Assets you have Deposited</p>
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded">
              <img className="w-8 h-8 mr-2" src={BTCIcon} alt="" />
              {numeral(2.3434 || 0).format('0,0.00')}
            </div>
            <div className="flex items-center justify-center bg-white text-white bg-opacity-25 py-1 px-2 rounded ml-6">
              <img className="w-8 h-8 mr-2" src={DollarIcon} alt="" />
              {numeral(3434.3 || 0).format('0,0')}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex items-center justify-around px-10 mt-4">
            <div className="py-2 px-4 rounded-xl bg-white bg-opacity-25">
              <p className="text-white">Then</p>
              <p className="text-white">Now</p>
              <p className="text-white">IRR*</p>
            </div>
            <div className="flex py-2 px-4 rounded-xl bg-white bg-opacity-25">
              <img className="w-8 h-8 mr-4" src={BTCIcon} alt="" />
              <div>
              </div>
            </div>
            <div className="flex py-2 px-4 rounded-xl bg-white bg-opacity-25">
              <img className="w-8 h-8 mr-4" src={DollarIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
