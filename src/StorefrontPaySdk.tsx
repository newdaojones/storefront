import React from "react";
import logoIcon from "./assets/images/logo.svg";
import {isDevMode, isTestnetMode} from "./config/appconfig";

const devUrl = 'http://localhost:3000';

//FIXME this should be test.merchant.storefrontpay.app
const testUrl = 'https://test.storefrontpay.app';

//FIXME this is not longer valid and the consumer url should be used
const prodUrl = 'https://pay.storefrontpay.app';

export const merchantUrl = 'merchant.storefrontpay.app';
const consumerUrl = 'pay.storefrontpay.app';

export const storefrontPayBaseUrl = isDevMode() ? devUrl : isTestnetMode() ? testUrl : prodUrl;

export const storefrontPayButton = (merchantAddress: string, orderId: String, amount: Number) => {
    const url = `${storefrontPayBaseUrl}/pay?merchantAddress=${merchantAddress}&orderId=${orderId}&amount=${amount}`
    return <a href={url}>
        <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
            <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
            <p className="font-righteous">Pay with Storefront</p>
        </button>
    </a>
}
