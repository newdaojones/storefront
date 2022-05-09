import { EUserActionTypes } from '../../enums';
import {IAccountInfo, ITicker, ITransactionInfo, IUserInfo, TransactionState} from '../../models';
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
    type: EUserActionTypes.GET_ACCOUNT_INFO_SUCCESS,
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
  console.info(`setting transaction as hash: ${payload.transactionHash} value: ${payload.value} toAddress: ${payload.toAddress}`)
  return {
    type: EUserActionTypes.SET_TRANSACTION_INFO,
    payload,
  };
};

const setCreateTransaction = (account: string) => {
  return {
    type: EUserActionTypes.SET_CREATE_TRANSACTION,
    account,
  };
};

const setCreateTransactionSuccess = (payload: ITransaction) => {
  return {
    type: EUserActionTypes.SET_TRANSACTION_SUCCESS,
    payload,
  };
};

export const userAction = {
  loginSuccess,
  getAccountInfoSuccess,
  getEnsNameSuccess,
  getTickersSuccess,
  setTransactionInProgress,
  setTransactionInfoWallet,
  setCreateTransaction,
  setCreateTransactionSuccess
};
