import { all, put, takeLatest, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { EUserActionTypes } from '../../enums';
import { UserService } from '../../services';
import { userAction } from '../actions/user.action';
import { toast } from 'react-toastify';
import { ens } from '../../utils/walletConnect';
import { ITicker, IUserInfo } from '../../models';

export function storageKey(storagePrefix: string): string {
  return `${storagePrefix}`;
}

export default function* root() {
  yield all([
    // takeLatest(EUserActionTypes.LOGIN_SUCCESS as any, watchGetAccountInfo),
    takeLatest(EUserActionTypes.LOGIN_REQUEST as any, watchGetEnsName),
    takeLatest(EUserActionTypes.LOGIN_SUCCESS as any, watchGetTickers),

    //After login success api
    //takeLatest(EUserActionTypes.GET_ACCOUNT_INFO_SUCCESS as any, watchGetFundBalances),
  ]);
}

// function* watchGetAccountInfo() {
//   try {
//     const res: AxiosResponse<IUserInfo> = yield call(UserService.getMeApi);
//     yield put(userAction.getAccountInfoSuccess(res.data));
//   } catch (err: any) {
//     toast.error(err.message);
//   }
// }

function* watchGetEnsName(action: { type: EUserActionTypes; payload: string }) {
  try {
    let ensName = null;
    let address: string = '';
    ({ name: ensName } = yield ens.getName(action.payload));

    if (ensName) {
      address = yield ens.name(ensName).getAddress();
    }

    if (ensName && address !== action.payload) {
      ensName = '';
    }

    yield put(userAction.getEnsNameSuccess(ensName));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchGetTickers() {
  try {
    const res: AxiosResponse<ITicker[]> = yield call(() => UserService.getTickersApi());
    yield put(userAction.getTickersSuccess(res.data));
  } catch (err: any) {
    toast.error(err.message);
  }
}