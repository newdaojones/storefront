import {IMerchant, IOrder, ITicker, ITransactionInfo, ITransactionOrder, IUserInfo} from '.';
import {ParsedTx} from "../helpers";
import {EtherscanTx} from "../rpc/etherscan-api";

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
  userInfo?: IUserInfo;
  merchantInfo?: IMerchant;
  tickers: ITicker[];
  transactionData: ITransactionOrder | null;
  transactionInfo: ITransactionInfo | null;
  order: IOrder | null;
  transactionInProgress: TransactionState;
  accountTransactions: EtherscanTx[] | null;
}


