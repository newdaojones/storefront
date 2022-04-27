import { produce } from 'immer';

import { createReducer } from '.';
import { userActionTypes } from '../../consts';
import { IAction, ITicker, IUserState } from '../../models';
import { userState } from '../states/user.state';

export const userReducer = createReducer<IUserState>(userState, {
  [userActionTypes.LOGIN_SUCCESS]: setLoginSuccessStatus,
  [userActionTypes.GET_ENS_NAME_SUCCESS]: setEnsNameStatus,
  [userActionTypes.GET_PRICE_TICKERS_SUCCESS]: setTickersStatus,
  [userActionTypes.SET_TRANSACTION_INFO]: setTransactionInfo,
});

function setLoginSuccessStatus(state: IUserState, { payload }: IAction<{ account: string; nonce: string; signature: string }>) {
  return produce(state, draft => {
    draft.loading = false;
    draft.isLogged = true;
    draft.account = payload.account;
    draft.nonce = payload.nonce;
    draft.signature = payload.signature;
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
