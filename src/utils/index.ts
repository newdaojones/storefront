import {chainData} from "../consts";
import {ellipseAddress} from "../helpers";
import { BigNumber } from "ethers";
import {getHexValueAsString, USDC_DECIMALS} from "../helpers/tx";
import {formatFixed} from "@ethersproject/bignumber";

export const SUPPORTED_STABLETOKENS = ["USDC", "USDT"];

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getConnectionStatusDisplay = (account: string) : string => {
  if (account) {

   return `${getConnectionNetwork(account)}`;
  }
  return 'Disconnected';
}

const getConnectionNetwork = (account: string) : string => {
  const [namespace, reference] = account.split(':');
  if (chainData[namespace] && chainData[namespace][reference]) {
    const chainMeta = chainData[namespace][reference];
    return chainMeta.name;
  }
  return ""
}

export const getDisplayName = (account: string, ensName: string | null) : string => {
  let name = '';
  if (ensName) {
    name = ensName;
  } else if (account) {
    const [namespace, reference, address] = account.split(':');

    if (chainData[namespace] && chainData[namespace][reference]) {
      const chainMeta = chainData[namespace][reference];
      console.info(`chainMeta ${chainMeta.symbol} ${chainMeta.name} currency: ${chainMeta.currency}`);
      name = ellipseAddress(address);
    }
  }
  return name;
}

export const getFormattedTokenValue = (token: string, value: BigNumber) => {
  if (token === 'USDC') {
    const paymentValueInTokenString = formatFixed(value, USDC_DECIMALS);
    return `${Number(paymentValueInTokenString).toFixed(2)} ${token}`;
  } else if (token === 'ETH' || token === 'MATIC') {
    const paymentValueInTokenString = formatFixed(value, 18);
    const trxValueAsNumber = Number(paymentValueInTokenString);
    return `${trxValueAsNumber.toFixed(6)} ${token}`;
  } else {
    throw Error(`token not handled ${token}`);
  }
}

export function isUSDStableToken(token: string) {
  return token === "USDC" || token === "USDT";
}


export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
