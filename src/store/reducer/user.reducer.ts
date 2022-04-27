import { produce } from 'immer';

import { createReducer } from '.';
import { userActionTypes } from '../../consts';
import {IAccountInfo, IAction, ITicker, IUserState} from '../../models';
import { userState } from '../states/user.state';

export const userReducer = createReducer<IUserState>(userState, {
  [userActionTypes.LOGIN_SUCCESS]: setLoginSuccessStatus,
  [userActionTypes.GET_ENS_NAME_SUCCESS]: setEnsNameStatus,
  [userActionTypes.GET_PRICE_TICKERS_SUCCESS]: setTickersStatus,
  [userActionTypes.SET_TRANSACTION_INFO]: setTransactionInfo,
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

function setTransactionInfo(state: IUserState, { payload }: IAction<boolean>) {
  return produce(state, draft => {
    draft.transactionInfo = payload;
  });
}
