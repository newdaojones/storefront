import React from "react";
import logoIcon from "./assets/images/logo.svg";

// const baseUrl = 'https://test.jxndao.com';
export const storefrontPayBaseUrl = 'http://localhost:3000';

export const storefrontPayButton = (orderId: String, amount: Number) => {
    const url = `${storefrontPayBaseUrl}/storefront/pay?orderId=${orderId}&amount=${amount}`
    return <a href={url}>
        <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
            <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
            <p className="font-righteous">Pay with Storefront</p>
        </button>
    </a>
}
