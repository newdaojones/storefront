import { all, put, takeLatest, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { EUserActionTypes } from '../../enums';
import { UserService } from '../../services';
import { userAction } from '../actions';
import { toast } from 'react-toastify';
import { ens } from '../../utils/walletConnect';
import {IMerchant, IOrder, ITicker, IUserInfo} from '../../models';
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


    takeLatest(EUserActionTypes.CREATE_ORDER as any, watchCreateNewOrder),

    takeLatest(EUserActionTypes.SET_ORDER_TRANSACTION_HASH as any, watchLinkOrderTransaction),
    //TODO this automatically?
    //takeLatest(EUserActionTypes.GET_USER_INFO_SUCCESS as any, watchGetMerchantInfo),
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

function* watchGetAccountInfo() {
  try {
    const res: AxiosResponse<IUserInfo> = yield call(UserService.getMeApi);
    yield put(userAction.getAccountInfoSuccess(res.data));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchGetMerchantInfo(action: { type: EUserActionTypes; payload: {address: string}}) {
  try {
    const res: AxiosResponse<IMerchant> = yield call(() => UserService.getMerchantInfoApi(action.payload.address));
    yield put(userAction.getMerchantInfoSuccess(res.data));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchCreateNewOrder(action: { type: EUserActionTypes; payload: IOrder}) {
  try {
    const res: AxiosResponse<IOrder> = yield call(() => UserService.createNewOrder(action.payload.toAddress, action.payload));
    if (res.status != 200) {
      console.error(`error result in create new order`);
    }
    console.info(`calling create new order got externalOrderId: ${res.data.externalOrderId} amount ${res.data.amount} trackingId: ${res.data.trackingId}`)
    yield put(userAction.setCreateOrderSuccess(res.data));
  } catch (err: any) {
    console.error(`error while creating order ${err}`)
    toast.error(`error ${err.message}`);
  }
}

function* watchLinkOrderTransaction(action: { type: EUserActionTypes; payload: { orderTrackingId: string, transactionHash: string }}) {
  try {
    yield call(() => UserService.linkOrderTransaction(action.payload.orderTrackingId, action.payload.transactionHash));
    //yield put(userAction.setLinkTransactionSuccess(res));
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

function* watchCreateTransactions(action: { type: EUserActionTypes; payload: {account: string; amount: number, orderTrackingId: string }}) {
  try {
    const res: ITransaction = yield call(() => formatTestTransaction(action.payload.account, action.payload.amount, action.payload.orderTrackingId));
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

