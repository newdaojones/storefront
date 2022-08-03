import { produce } from 'immer';

import { createReducer } from '.';
import { userActionTypes } from '../../consts';
import {
  IAccountInfo,
  IAction,
  IMerchant, IOrder,
  ITicker,
  ITransactionInfo, ITransactionOrder,
  IUserInfo,
  IUserState,
  TransactionState
} from '../../models';
import { userState } from '../states/user.state';
import {ITransaction} from "../../helpers/tx";

export const userReducer = createReducer<IUserState>(userState, {
  [userActionTypes.LOGIN_SUCCESS]: setLoginSuccessStatus,
  [userActionTypes.GET_ENS_NAME_SUCCESS]: setEnsNameStatus,
  [userActionTypes.GET_USER_INFO_SUCCESS]: setUserInfo,
  [userActionTypes.GET_MERCHANT_INFO_SUCCESS]: setMerchantInfo,
  [userActionTypes.GET_PRICE_TICKERS_SUCCESS]: setTickersStatus,
  [userActionTypes.SET_TRANSACTION_IN_PROGRESS]: setTransactionInProgress,
  [userActionTypes.SET_TRANSACTION_INFO]: setTransactionInfo,
  [userActionTypes.SET_TRANSACTION_SUCCESS]: setTransactionData,
  [userActionTypes.CREATE_ORDER_SUCCESS]: setOrderData,
  [userActionTypes.GET_ORDER_SUCCESS]: setOrderData,
});

function setLoginSuccessStatus(state: IUserState, { payload }: IAction<IAccountInfo>) {
  return produce(state, draft => {
    draft.loading = false;
    draft.isLogged = true;
    draft.accountInfo = payload;
  });
}

function setEnsNameStatus(state: IUserState, { payload }: IAction<string>) {
  return produce(state, draft => {
    draft.ensName = payload;
  });
}

function setTickersStatus(state: IUserState, { payload }: IAction<ITicker[]>) {
  return produce(state, draft => {
    draft.tickers = payload;
  });
}

function setTransactionInProgress(state: IUserState, { payload }: IAction<TransactionState>) {
  return produce(state, draft => {
    draft.transactionInProgress = payload;
  });
}

function setTransactionInfo(state: IUserState, { payload }: IAction<ITransactionInfo>) {
  return produce(state, draft => {
    draft.transactionInfo = payload;
  });
}

function setUserInfo(state: IUserState, { payload }: IAction<IUserInfo>) {
  return produce(state, draft => {
    draft.userInfo = payload;
  });
}

function setMerchantInfo(state: IUserState, { payload }: IAction<IMerchant>) {
  return produce(state, draft => {
    draft.merchantInfo = payload;
  });
}

function setTransactionData(state: IUserState, { payload }: IAction<ITransactionOrder>) {
  return produce(state, draft => {
    draft.transactionData = payload;
  });
}

function setOrderData(state: IUserState, { payload }: IAction<IOrder>) {
  return produce(state, draft => {
    draft.order = payload;
  });
}
