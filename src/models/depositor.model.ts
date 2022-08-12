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
  orderTrackingId: string;
}

export interface ITransactionInfo {
  transaction: ITransaction | null;
  transactionHash: string;
  paymentValueUsd: number;
  paymentFeeUsd: number;
  paymentTotalUSD: number;
  date: string | null;
  orderTrackingId?: string | null;
}

export interface IOrder {
  externalOrderId: string,
  toAddress: string,
  amount: number,
  token: string,
  testnet: boolean,
  transactionHash: string | null,
  active?: boolean,
  trackingId?: string,
  addedAt?: string,
  updatedAt?: string,
  id?: number,
  merchantName?: String,
  merchantAddress?: String,
  nativeAmount: string | null,

  /**
   * externalOrderId	"28"
   toAddress	"eB58Fff80D9a9D8f6898212Cf2301B16DCFF4796"
   amount	0.15
   token	"ETH"
   transactionHash	null
   testnet	true
   active	true
   trackingId	"7595af37-bd36-4182-94b1-aabc916feeea"
   addedAt	"2022-07-28T15:04:05.044"
   updatedAt	"2022-07-28T15:04:05.044026"
   id	371
   */


}

export interface IMerchant {
  merchantName: string;
  memberENSAddress: string;
  memberAddress: string;
  memberSecondaryAddress: string;
  storeName: string;
  allowedUrl: string;
  id: number;
  orders: IOrder[];
  defaultToken: string,
  totalInEth?: number,
  totalInUsd?: number,
}


