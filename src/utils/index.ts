import {chainData} from "../consts";
import {ellipseAddress} from "../helpers";

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
export const getFormattedTokenValue = (token: string, value: number | string) => {
  if (typeof value === "string") {
    return `${value.substring(0, value.length > 8 ? 8 :value.length)} ${token}`
  }
  const valueNumber: number = value;
  let fractionDigits = 6;
  if (isUSDStableToken(token)) {
    fractionDigits = 2;
  } else {
    console.log(`token ${token}`);
  }
  const getNativePriceString: string = `${valueNumber.toFixed(fractionDigits)} ${token}`
  return getNativePriceString;
}

export function isUSDStableToken(token: string) {
  return token === "USDC" || token === "USDT";
}


export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
