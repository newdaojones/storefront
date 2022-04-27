import { EUserActionTypes } from '../../enums';
import {IAccountInfo, ITicker, IUserInfo} from '../../models';

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

const setTransactionInfoWallet = (payload: boolean) => {
  console.info(`setting transactinon as ${payload}`)
  return {
    type: EUserActionTypes.SET_TRANSACTION_INFO,
    payload,
  };
};
export const userAction = {
  loginSuccess,
  getAccountInfoSuccess,
  getEnsNameSuccess,
  getTickersSuccess,
  setTransactionInfoWallet
};
