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


export interface ITransactionInfo {
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
}
