import React from "react";
import logoIcon from "./assets/images/logo.svg";

const baseUrl = 'https://test.jxndao.com';
const devUrl = 'http://localhost:3000';


//FIXME toAddress should be our own input wallet or merchant?
const toAddress = '0x96fca7a522A4Ff7AA96B62a155914a831fe2aC05';
export const storefrontPaymentAddress = toAddress;

//TODO FIX
// export const storefrontPayBaseUrl = devUrl;
export const storefrontPayBaseUrl = baseUrl;

export const storefrontPayButton = (orderId: String, amount: Number) => {
    const url = `${storefrontPayBaseUrl}/storefront/pay?orderId=${orderId}&amount=${amount}`
    return <a href={url}>
        <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
            <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
            <p className="font-righteous">Pay with Storefront</p>
        </button>
    </a>
}
