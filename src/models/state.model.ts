import {ITicker, IUserInfo} from '.';

export interface IRootState {
  userState: IUserState;
}

export interface IUserState {
  isLogged: boolean;
  loading: boolean;
  account: string;
  nonce: string;
  signature: string;
  error?: string;
  ensName?: string;
  accountInfo?: IUserInfo;
  tickers: ITicker[];
  transactionInfo: boolean;
}


