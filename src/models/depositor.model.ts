import {ITransaction} from "../helpers/tx";

export interface IUserInfo {
  memberName: string;
  memberENSAddress: string;
  walletPrimarySendAddress: string;
  walletSecondarySendAddress: string;
  walletNonce: string;
  memberType: string;
  addedAt: string;
  active: boolean;
  id: number;
}

export interface ITicker {
  id: string;
  currency: string;
  symbol: string;
  name: string;
  logo_url: string;
  status: 'active' | 'inactive' | 'dead';
  price: number;
  price_date: string;
  price_timestamp: string;
  circulating_supply: string;
  max_supply: string;
  market_cap: string;
  market_cap_dominance: string;
  num_exchanges: string;
  num_pairs: string;
  num_pairs_unmapped: string;
  first_candle: string;
  first_trade: string;
  first_order_book: string;
  rank: string;
  rank_delta: string;
  high: string;
  high_timestamp: string;
  '1d': {
    volume: string;
    price_change: string;
    price_change_pct: string;
    volume_change: string;
    volume_change_pct: string;
    market_cap_change: string;
    market_cap_change_pct: string;
  };
}

export interface IUpdateAddressRequest {
  addressENS: string;
  address: string;
}

export interface ITransactionOrder {
  transaction: ITransaction;
  order: IOrder;
}

export interface ITransactionInfo {
  transaction: ITransaction | null;
  order: IOrder;
  transactionHash: string | null,
  paymentValueUsd: number;
  paymentFeeUsd: number;
  paymentTotalUSD: number;
  paymentNativeAmount: number;
  paymentToken: string,
  date: string | null;
}

export enum OrderPaymentMethod {
  WYRE="WYRE",
  TRANSAK="TRANSAK",
  ONRAMPER="ONRAMPER"
}

//FIXME there's a bunch of payment related attributes (transactionHash, nativeAmount, chainId, etc), that are only there when an order is paid.
// should be probably moved to their own PaidOrder interface, since they are all optional.
export interface IOrder {
  externalOrderId: string,
  amount: number,
  token: string,
  testnet: boolean,
  transactionHash: string | null,
  active?: boolean,
  trackingId?: string,
  addedAt?: string,
  updatedAt?: string,
  id?: number,
  merchantName?: string,
  toAddress: string,
  nativeAmount: string | null,
  fees: number | null,
  tip: number,
  orderDescription: string | null,
  chainId: string,
  customerPhoneNumber: string | null,
  customerEmail: string | null,
  paymentProvider: OrderPaymentMethod | null,
}

export interface IMerchant {
  merchantName: string;
  memberENSAddress: string;
  memberAddress: string;
  memberSecondaryAddress: string;
  storeName: string;
  allowedUrl: string;
  testnet: boolean;
  id: number;
  orders: IOrder[];
  defaultToken: string,
  totalInEth?: number,
  totalInUsd?: number,
}

export interface IOrderDateRange {
  startDate: string | null,
  endDate: string | null,
}

