import {ITicker, ITransactionInfo, IUserInfo} from '.';

export interface IRootState {
  userState: IUserState;
}

export interface IAccountInfo {
  address: string;
  namespace: string;
  reference: string;
}

export interface IUserState {
  isLogged: boolean;
  loading: boolean;
  account: string;
  nonce: string;
  signature: string;
  error?: string;
  ensName?: string;
  accountInfo?: IAccountInfo;
  tickers: ITicker[];
  transactionInfo: ITransactionInfo | null;
  transactionInProgress: boolean;
}


