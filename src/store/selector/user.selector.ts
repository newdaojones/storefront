import { createSelector } from 'reselect';

import { IUserState, IRootState } from '../../models';

export const selectUserState = (rootState: IRootState): IUserState => {
  return rootState.userState;
};

export const selectIsLogged = createSelector([selectUserState], userState => {
  return userState.isLogged;
});

export const selectUserLoading = createSelector([selectUserState], userState => {
  return userState.loading;
});

export const selectAccount = createSelector([selectUserState], userState => {
  return userState.account;
});

export const selectUserNonce = createSelector([selectUserState], userState => {
  return userState.nonce;
});

export const selectUserAccount = createSelector([selectUserState], userState => {
  return userState.account;
});

export const selectAccountInfo = createSelector([selectUserState], userState => {
  return userState.accountInfo;
});

export const selectEnsName = createSelector([selectUserState], userState => {
  return userState.ensName;
});

export const selectTickers = createSelector([selectUserState], userState => {
  return userState.tickers;
});
