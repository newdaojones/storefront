import {all, call, put, takeLatest} from 'redux-saga/effects';
import {AxiosResponse} from 'axios';
import {EUserActionTypes} from '../../enums';
import {UserService} from '../../services';
import {userAction} from '../actions';
import {toast} from 'react-toastify';
import {ens} from '../../utils/walletConnect';
import {IMerchant, IOrder, ITicker, ITransactionOrder} from '../../models';
import {currentRpcApi, encodeTransaction, ITransaction} from "../../helpers/tx";
import * as H from "history";
import {createBrowserHistory} from "history";
import {getAccountChainId} from "../../utils";
import {ParsedTx} from "../../helpers";
import {etherscanGetAccountTransactions, EtherscanTx} from "../../rpc/etherscan-api";
import {isBlockchainTestnetMode} from "../../config/appconfig";

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

    takeLatest(EUserActionTypes.GET_MERCHANT_INFO as any, watchGetMerchantInfo),

    takeLatest(EUserActionTypes.GET_ORDER as any, watchGetOrderInfo),

    takeLatest(EUserActionTypes.CREATE_MERCHANT as any, watchCreateMerchant),

    takeLatest(EUserActionTypes.UPDATE_MERCHANT_SETTINGS as any, watchUpdateMerchant),

    takeLatest(EUserActionTypes.UNSET_CURRENT_ORDER as any, watchUnsetOrder),

    takeLatest(EUserActionTypes.GET_PENDING_TRANSACTIONS as any, watchGetPendingTransactions),

    // maybe not needed
    //takeLatest(EUserActionTypes.UPDATE_MERCHANT_SUCCESS as any, watchGetMerchantInfo)
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

function* watchGetMerchantInfo(action: { type: EUserActionTypes; payload: {address: string}}) {
  try {
    console.log(`watchGetMerchantInfo`)
    const res: AxiosResponse<IMerchant> = yield call(() => UserService.getMerchantInfoApi(action.payload.address));
    yield put(userAction.getMerchantInfoSuccess(res.data));
  } catch (err: any) {
    console.error(`watchGetMerchantInfo ${err.message}`)
    //toast.error(err.message);
  }
}

function* watchGetOrderInfo(action: { type: EUserActionTypes; payload: {orderTrackingId: string}}) {
  try {
    console.log(`watchGetOrderInfo orderTrackingId: ${action.payload.orderTrackingId}`)
    const res: AxiosResponse<IOrder> = yield call(() => UserService.getOrderApi(action.payload.orderTrackingId));
    yield put(userAction.getOrderSuccess(res.data));
  } catch (err: any) {
    console.warn(`watchGetOrderInfo ${err.message}`)
    //toast.error(`watchGetOrderInfo ${err.message}`);
  }
}

function* watchCreateNewOrder(action: { type: EUserActionTypes; payload: IOrder}) {
  try {
    const res: AxiosResponse<IOrder> = yield call(() => UserService.createNewOrder(action.payload.toAddress, action.payload));
    console.info(`calling create new order got externalOrderId: ${res.data.externalOrderId} amount ${res.data.amount} trackingId: ${res.data.trackingId}`)
    yield put(userAction.setCreateOrderSuccess(res.data));
  } catch (err: any) {
    console.error(`watchCreateNewOrder ${err.status} msg: ${err.message} ${err.error} ${err.data}`)
    //toast.error(`watchCreateNewOrder error ${err.message}`);
  }
}

function* watchLinkOrderTransaction(action: { type: EUserActionTypes; payload: { orderTrackingId: string, transactionHash: string, nativeAmount: number, token: string }}) {
  try {
    yield call(() => UserService.linkOrderTransaction(action.payload.orderTrackingId, action.payload.transactionHash, action.payload.nativeAmount, action.payload.token));
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
    console.error(`get tickers failed ${err.message}`)
    //toast.error(err.message);
  }
}

function* watchCreateTransactions(action: { type: EUserActionTypes; payload: {account: string; toAddress: string; amount: number, token: string, orderTrackingId: string }}) {
  try {
    const res: ITransaction = yield call(() => encodeTransaction(action.payload.account, action.payload.toAddress, action.payload.amount,
        action.payload.token, action.payload.orderTrackingId));

    const chainId = getAccountChainId(action.payload.account);
    const order : IOrder = {
      externalOrderId: "",
      amount: action.payload.amount,
      tip: 0, //FIXME add correct numbers
      fees: 0,
      totalAmount: 0,
      nativeAmount: '0',
      orderDescription: null,
      testnet: isBlockchainTestnetMode(),
      toAddress: action.payload.toAddress,
      token: action.payload.token,
      trackingId: action.payload.orderTrackingId,
      transactionHash: null,
      chainId: chainId,
      customerPhoneNumber: null,
      paymentProvider: null,
    }
    const transactionOrder: ITransactionOrder = {
      transaction: res,
      order: order
    }
    yield put(userAction.setCreateTransactionSuccess(transactionOrder));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchUnsetTransaction(action: { type: EUserActionTypes}) {
  try {
    yield put(userAction.setCreateTransactionSuccess(null));
    yield put(userAction.setCreateOrderSuccess(null));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchUnsetOrder(action: { type: EUserActionTypes}) {
  try {
    yield put(userAction.setCreateOrderSuccess(null));
  } catch (err: any) {
    toast.error(err.message);
  }
}

function* watchCreateMerchant(action: { type: EUserActionTypes; payload: {merchant: IMerchant, history: H.History}}) {
  try {
    const res: AxiosResponse = yield call(() => UserService.createNewMerchant(action.payload.merchant)
        // .catch(
        // onrejectionhandled => {
        //   console.warn(`called failed ${onrejectionhandled.response.data} ${onrejectionhandled.data}`);
        //   if (onrejectionhandled && onrejectionhandled.includes("There's already a merchant for the same member")) {
        //     action.payload.history.replace("/merchant/profile");
        //   }
        // }
    // )
  );
    console.info(`createMerchant response ${res} ${res.status} ${res.data}`)
    if (res.status !== 200) {
      console.error(`error result in create new merchant`);
    }
    yield put(userAction.setCreateMerchantSuccess(res.data));
    action.payload.history.replace("/merchant/profile");
  } catch (err: any) {
    console.error(`error while creating merchant ${err}`)
    toast.error(err.data.message ? `${err.data.message}` : `Error ${err.status}`);
  }
}

function* watchUpdateMerchant(action: { type: EUserActionTypes; payload: {merchant: IMerchant}}) {
  try {
    const res: AxiosResponse = yield call(() => UserService.updateMerchantSettings(action.payload.merchant));
    console.info(`updateMerchant response ${res} ${res.status} ${res.data}`)
    if (res.status !== 200) {
      console.error(`error result in create new merchant`);
    }
    yield put(userAction.updateMerchantSuccess(res.data));
  } catch (err: any) {
    console.error(`error while creating merchant ${err}`)
    toast.error(err.data.message ? `${err.data.message}` : `Error ${err.status}`);
  }
}

function* watchGetPendingTransactions(action: { type: EUserActionTypes; payload: { address: string, chainId: string}}) {
  try {
    console.log(`watchGetPendingTransactions address: ${action.payload.address} chainId: ${action.payload.chainId}`)

    // const res: AxiosResponse<EtherscanTx[]> = yield call(() => etherscanGetAccountTransactions(action.payload.address, action.payload.chainId));
    const res: EtherscanTx[] = yield call(() => etherscanGetAccountTransactions(action.payload.address, action.payload.chainId));
    // const res: AxiosResponse<ParsedTx[]> = yield call(() => currentRpcApi.getAccountTransactions(action.payload.address, action.payload.chainId));
    console.warn(`watchGetPendingTransactions results: ${res} itesm: ${res.length}`)
    yield put(userAction.getPendingTransactionsSuccess(res));
  } catch (err: any) {
    toast.error(err.message);
  }
}


