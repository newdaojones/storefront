export enum EUserActionTypes {
  LOGIN_REQUEST = 'USER/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'USER/LOGIN_SUCCESS',
  GET_MERCHANT_INFO = 'USER/MERCHANT_LOGIN_SUCCESS',
  LOGIN_FAILED = 'USER/LOGIN_FAILED',
  LOGOUT_REQUEST = 'USER/LOGOUT_REQUEST',
  GET_USER_INFO_SUCCESS = 'USER/GET_USER_INFO_SUCCESS',
  GET_MERCHANT_INFO_SUCCESS = 'USER/GET_MERCHANT_INFO_SUCCESS',
  GET_ENS_NAME_SUCCESS = 'USER/GET_ENS_NAME_SUCCESS',
  GET_PRICE_TICKERS_SUCCESS = 'USER/GET_PRICE_TICKERS_SUCCESS',
  SET_TRANSACTION_IN_PROGRESS = 'USER/SET_TRANSACTION_IN_PROGRESS',
  SET_CREATE_TRANSACTION = 'USER/SET_CREATE_TRANSACTION',
  UNSET_TRANSACTION = 'USER/UNSET_TRANSACTION',
  SET_TRANSACTION_SUCCESS = 'USER/SET_TRANSACTION_SUCCESS',
  SET_TRANSACTION_INFO = 'USER/SET_TRANSACTION_INFO',
  CREATE_ORDER = 'USER/CREATE_ORDER',
  CREATE_ORDER_SUCCESS = 'USER/CREATE_ORDER_SUCCESS',
  GET_ORDER_SUCCESS = 'USER/GET_ORDER_SUCCESS',
  GET_ORDER = 'USER/GET_ORDER',
  SET_ORDER_TRANSACTION_HASH = 'USER/SET_ORDER_TRANSACTION_HASH',
  UNSET_CURRENT_ORDER = 'USER/UNSET_CURRENT_ORDER',
  CREATE_MERCHANT = 'USER/CREATE_MERCHANT',
  CREATE_MERCHANT_SUCCESS = 'USER/CREATE_MERCHANT_SUCCESS',
  UPDATE_MERCHANT_SETTINGS = 'USER/UPDATE_MERCHANT_SETTINGS',
  UPDATE_MERCHANT_SUCCESS = 'USER/UPDATE_MERCHANT_SUCCESS',
  GET_PENDING_TRANSACTIONS = 'USER/GET_PENDING_TRANSACTIONS',
}
