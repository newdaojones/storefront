import { IUserState } from '../../models';

export const userState: IUserState = {
  isLogged: false,
  loading: false,
  nonce: '',
  account: '',
  ensName: '',
  signature: '',
  tickers: [],
};
