import {chainData} from "../consts";
import {ellipseAddress, ParsedTx} from "../helpers";
import {debugAccountTransaction, debugEtherscanAccountTransaction, debugTransaction, ITransaction} from "../helpers/tx";
import {EtherscanTx} from "../rpc/etherscan-api";
import {hexToNumber} from "@walletconnect/encoding";
import {IOrder, IOrderDateRange} from "../models";

export function printOrderTrackingId(order: IOrder | null) {
  if (order === null) {
    return "";
  }
  return order.trackingId?.substring(0, 8);
}

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
export const getAccountAddress = (account: string) : string => {
  const [namespace, reference, address] = account.split(":");
  return address;
}

export const isSameTransaction = (trx1: EtherscanTx, trx2: ITransaction): boolean => {
  console.info(`trx1 ${debugEtherscanAccountTransaction(trx1)}`);
  console.info(`trx2 ${debugTransaction(trx2)}`);
  const decodedNonce = hexToNumber(trx2.nonce);
  return Number(trx1.nonce) === decodedNonce && trx1.from.toLowerCase() === trx2.from.toLowerCase();
}

export const getAccountChainId = (account: string) : string => {
  if (!account) {
    console.warn(`account is not valid`);
  }
  const [namespace, reference] = account.split(":");
  const chainId = `${namespace}:${reference}`;
  return chainId;
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

export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const getCurrentMonthDateRange = () : IOrderDateRange => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  console.info(`first: ${firstDay.toLocaleString()} last: ${lastDay.toLocaleString()}`);
  return {
    startDate: firstDay.toISOString(),
    endDate: lastDay.toISOString()
  }
}
