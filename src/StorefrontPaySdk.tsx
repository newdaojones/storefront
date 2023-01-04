import React from "react";
import logoIcon from "./assets/images/logo.svg";
import {APP_URL} from "./config/appconfig";
import {isDevMode} from "./config/flavorconfig";

const devUrl = 'http://localhost:3000';

export const storefrontPayBaseUrl = isDevMode() ? devUrl : APP_URL;

export const storefrontPayButton = (merchantAddress: string, orderId: String, amount: Number) => {
    const url = `${storefrontPayBaseUrl}/pay?merchantAddress=${merchantAddress}&orderId=${orderId}&amount=${amount}`
    return <a href={url}>
        <button className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
            <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
            <p className="font-righteous">Pay with Storefront</p>
        </button>
    </a>
}
