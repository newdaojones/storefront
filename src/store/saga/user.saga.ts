import { all, put, takeLatest, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { EUserActionTypes } from '../../enums';
import { UserService } from '../../services';
import { userAction } from '../actions';
import { toast } from 'react-toastify';
import { ens } from '../../utils/walletConnect';
import { ITicker } from '../../models';
import {formatTestTransaction, ITransaction} from "../../helpers/tx";

export function storageKey(storagePrefix: string): string {
  return `${storagePrefix}`;
}

export default function* root() {
  yield all([
    takeLatest(EUserActionTypes.LOGIN_REQUEST as any, watchGetEnsName),
    takeLatest(EUserActionTypes.LOGIN_SUCCESS as any, watchGetTickers),

    takeLatest(EUserActionTypes.SET_CREATE_TRANSACTION as any, watchCreateTransactions),
    takeLatest(EUserActionTypes.UNSET_TRANSACTION as any, watchUnsetTransaction),
  ]);
}

function* watchGetEnsName(action: { type: EUserActionTypes; payload: string }) {
  try {
    let ensName;
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

function* watchCreateTransactions(action: { type: EUserActionTypes; payload: {account: string; amount: number, orderId: string }}) {
  try {
    const res: ITransaction = yield call(() => formatTestTransaction(action.payload.account, action.payload.amount, action.payload.orderId));
    yield put(userAction.setCreateTransactionSuccess(res));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchUnsetTransaction(action: { type: EUserActionTypes}) {
  try {
    yield put(userAction.setCreateTransactionSuccess(null));
  } catch (err: any) {
    toast.error(err.message);
  }
}

