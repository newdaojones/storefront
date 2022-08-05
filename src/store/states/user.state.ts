import {IUserState, TransactionState} from '../../models';

export const userState: IUserState = {
  isLogged: false,
  loading: false,
  nonce: '',
  account: '',
  ensName: '',
  signature: '',
  tickers: [],
  transactionInfo: null,
  transactionInProgress: TransactionState.INITIAL,
  accountInfo: undefined,
  transactionData: null,
  userInfo: undefined,
  order: null,
};
