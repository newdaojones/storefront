import { EUserActionTypes } from '../../enums';
import {IAccountInfo, IMerchant, IOrder, ITicker, ITransactionInfo, IUserInfo, TransactionState} from '../../models';
import {ITransaction} from "../../helpers/tx";

//namespace, reference, address
const loginSuccess = (payload: IAccountInfo) => {
  return {
    type: EUserActionTypes.LOGIN_SUCCESS,
    payload,
  };
};

const getAccountInfoSuccess = (payload: IUserInfo) => {
  return {
    type: EUserActionTypes.GET_USER_INFO_SUCCESS,
    payload,
  };
};

const getMerchantInfoSuccess = (payload: IMerchant) => {
  return {
    type: EUserActionTypes.GET_MERCHANT_INFO_SUCCESS,
    payload,
  };
};

const getEnsNameSuccess = (payload: string) => {
  return {
    type: EUserActionTypes.GET_ENS_NAME_SUCCESS,
    payload,
  };
};

const getTickersSuccess = (payload: ITicker[]) => {
  return {
    type: EUserActionTypes.GET_PRICE_TICKERS_SUCCESS,
    payload,
  };
};

const setTransactionInProgress = (payload: TransactionState) => {
  console.info(`setTransactionInProgress as ${payload}`)
  return {
    type: EUserActionTypes.SET_TRANSACTION_IN_PROGRESS,
    payload,
  };
};

const setTransactionInfoWallet = (payload: ITransactionInfo) => {
  console.info(`setting transaction as hash: ${payload.transactionHash} value: ${payload.transaction?.value} toAddress: ${payload.transaction?.to}`)
  return {
    type: EUserActionTypes.SET_TRANSACTION_INFO,
    payload,
  };
};

const setCreateTransaction = (payload: { amount: number;  account: string; orderTrackingId: string}) => {
  return {
    type: EUserActionTypes.SET_CREATE_TRANSACTION,
    payload
  };
};

const unsetTransaction = () => {
  return {
    type: EUserActionTypes.UNSET_TRANSACTION,
  };
};

const setCreateTransactionSuccess = (payload: ITransaction | null) => {
  return {
    type: EUserActionTypes.SET_TRANSACTION_SUCCESS,
    payload,
  };
};

const setCreateOrderSuccess = (payload: IOrder) => {
  console.info(`setCreateOrderSuccess order ${payload.amount} ${payload.externalOrderId} tracking: ${payload.trackingId}`)
  return {
    type: EUserActionTypes.CREATE_ORDER_SUCCESS,
    payload
  };
};

const setOrderTransactionHash = (payload: {orderTrackingId: string, transactionHash: string }) => {
  return {
    type: EUserActionTypes.SET_ORDER_TRANSACTION_HASH,
    payload
  };
};


const merchantLoginSuccess = (payload: {address: string}) => {
  return {
    type: EUserActionTypes.MERCHANT_LOGIN_SUCCESS,
    payload
  };
};

const createOrder = (payload: IOrder) => {
  return {
    type: EUserActionTypes.CREATE_ORDER,
    payload
  };
};

export const userAction = {
  loginSuccess,
  getAccountInfoSuccess,
  getMerchantInfoSuccess,
  getEnsNameSuccess,
  getTickersSuccess,
  setTransactionInProgress,
  setTransactionInfoWallet,
  setCreateTransaction,
  unsetTransaction,
  setCreateTransactionSuccess,
  setCreateOrderSuccess,
  setOrderTransactionHash,
  createOrder,
  merchantLoginSuccess
};
