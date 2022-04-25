export interface IAccountBalance {
  accountName: string;
  totalBalanceUSD: number,
  totalBalanceInBTC: number,
  walletBalances: IWalletBalance[];
  totalFeesInUSD: number,
}
export interface  ITokenBalance {
  token: IToken,
  balance: number;
  usdBalance: number;
  btcBalance: number;
  logoUrl: string;
}
export interface  IWallet {
  name: string;
  receiveAddress: string;
  token: string;
  chain: string;
  tokenIconUrl: string;
}
export interface IToken {
  tokenSymbol: string;
  tokenType: string;
  receiveAddress: string | null;
  contractAddress: string | null;
  name: string | null;
  chain: string | null;
  blockExplorer: string | null
  id: number
}
export interface  IWalletBalance {
  wallet: IWallet,
  usdBalance: number,
  btcBalance: number,
  tokenBalances: ITokenBalance[],
}
export interface IFundBalance {
  totalBalanceUSD: number;
  totalBalanceInBTC: number;
  accountBalances: IAccountBalance[];
  date: Date | string;
}
