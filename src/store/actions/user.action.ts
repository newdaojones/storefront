import { EUserActionTypes } from '../../enums';
import { ITicker, IUserInfo } from '../../models';

//namespace, reference, address
const loginSuccess = (payload: { namespace: string; reference: string; address: string;}) => {
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
export const userAction = {
  loginSuccess,
  getAccountInfoSuccess,
  getEnsNameSuccess,
  getTickersSuccess,
};
