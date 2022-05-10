export enum EUserActionTypes {
  LOGIN_REQUEST = 'USER/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'USER/LOGIN_SUCCESS',
  LOGIN_FAILED = 'USER/LOGIN_FAILED',
  LOGOUT_REQUEST = 'USER/LOGOUT_REQUEST',
  GET_ACCOUNT_INFO_SUCCESS = 'USER/GET_ACCOUNT_INFO_SUCCESS',
  GET_ENS_NAME_SUCCESS = 'USER/GET_ENS_NAME_SUCCESS',
  GET_PRICE_TICKERS_SUCCESS = 'USER/GET_PRICE_TICKERS_SUCCESS',
  SET_TRANSACTION_IN_PROGRESS = 'USER/SET_TRANSACTION_IN_PROGRESS',
  SET_CREATE_TRANSACTION = 'USER/SET_CREATE_TRANSACTION',
  UNSET_TRANSACTION = 'USER/UNSET_TRANSACTION',
  SET_TRANSACTION_SUCCESS = 'USER/SET_TRANSACTION_SUCCESS',
  SET_TRANSACTION_INFO = 'USER/SET_TRANSACTION_INFO',
}
