import { EUserActionTypes } from '../../enums';
import {
  IAccountInfo,
  IMerchant,
  IOrder,
  ITicker,
  ITransactionInfo,
  ITransactionOrder,
  IUserInfo,
  TransactionState
} from '../../models';
import * as H from "history";
import {toast} from "react-toastify";
import {options} from "numeral";

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

const setCreateTransactionSuccess = (payload: ITransactionOrder | null) => {
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


const setCreateMerchantSuccess = (payload: IMerchant) => {
  console.info(`setCreateMerchantSuccess order ${payload.merchantName} ${payload.memberAddress}`)
  return {
    type: EUserActionTypes.CREATE_MERCHANT_SUCCESS,
    payload
  };
};

const updateMerchantSuccess = (payload: IMerchant) => {
  console.info(`updateMerchantSuccess order ${payload.merchantName} ${payload.memberAddress}`)
  toast.success("Settings updated", {autoClose: 2000})
  return {
    type: EUserActionTypes.UPDATE_MERCHANT_SUCCESS,
    payload
  };
};

const getOrderSuccess = (payload: IOrder) => {
  console.info(`getOrderSuccess order ${payload.amount} ${payload.externalOrderId} tracking: ${payload.trackingId}`)
  return {
    type: EUserActionTypes.GET_ORDER_SUCCESS,
    payload
  };
};

const setOrderTransactionHash = (payload: {orderTrackingId: string, transactionHash: string, nativeAmount: string }) => {
  return {
    type: EUserActionTypes.SET_ORDER_TRANSACTION_HASH,
    payload
  };
};


const merchantLoginSuccess = (payload: {address: string}) => {
  return {
    type: EUserActionTypes.GET_MERCHANT_INFO,
    payload
  };
};

const createOrder = (payload: IOrder) => {
  return {
    type: EUserActionTypes.CREATE_ORDER,
    payload
  };
};

const createMerchant = (payload: IMerchant, history: H.History) => {
  return {
    type: EUserActionTypes.CREATE_MERCHANT,
    payload: {merchant: payload, history: history}
  };
};

const updateMerchant = (payload: IMerchant) => {
  return {
    type: EUserActionTypes.UPDATE_MERCHANT_SETTINGS,
    payload: {merchant: payload}
  };
};

const getOrder = (payload: { orderTrackingId: String }) => {
  return {
    type: EUserActionTypes.GET_ORDER,
    payload
  };
};

export const userAction = {
  loginSuccess,
  getAccountInfoSuccess,
  getMerchantInfoSuccess,
  getOrderSuccess,
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
  getOrder,
  merchantLoginSuccess,
  createMerchant,
  setCreateMerchantSuccess,
  updateMerchant,
  updateMerchantSuccess
};
