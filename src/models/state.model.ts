import {ITicker, ITransactionInfo, IUserInfo} from '.';
import {ITransaction} from "../helpers/tx";

export interface IRootState {
  userState: IUserState;
}

export interface IAccountInfo {
  address: string;
  namespace: string;
  reference: string;
}

export enum TransactionState {
  INITIAL,IN_PROGRESS,FINISHED
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
  transactionData: ITransaction | null;
  transactionInfo: ITransactionInfo | null;
  transactionInProgress: TransactionState;
}


