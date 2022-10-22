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
  transactionData: null, //FIXME orderPaymentRequest, a more appropriate name for this is.
  userInfo: undefined,
  order: null,
};
