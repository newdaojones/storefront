import axios from './axios';
import {IMerchant, IOrder} from "../models";

export const UserService = (function () {
  const loginApi = async (payload: string) => {
    return axios.get(`/fund/members/${payload}/login`);
  };

  const getMeApi = async () => {
    return axios.get('/fund/members/me');
  };

  const getTickersApi = async () => {
    return axios.get('/tickers');
  };

  const nonceApi = async (payload: string) => {
    return axios.get(`/merchants/${payload}/nonce`);
  };

  const getMerchantInfoApi = async (address: string) => {
    return axios.get(`/merchants/${address}`);
  };

  const getOrderApi = async (orderTrackingId: string) => {
    return axios.get(`/merchants/orders/${orderTrackingId}`);
  };

  const createNewOrder = async (address: string, order: IOrder) => {
    return axios.post(`/merchants/${address}/orders`, order);
  };

  const createNewMerchant = async (order: IMerchant) => {
    return axios.post(`/merchants?nonce=${axios.getNonce()}&signature=${axios.getSignature()}`, order, {}, false);
  };

  const linkOrderTransaction = async (orderTrackingId: string, transactionHash: string, nativeAmount: number) => {
    return axios.post(`/merchants/orders/${orderTrackingId}/transaction`, {transactionHash: transactionHash, nativeAmount: nativeAmount});
  };

  return {
    loginApi,
    getMeApi,
    getTickersApi,
    getMerchantInfoApi,
    createNewOrder,
    getOrderApi,
    linkOrderTransaction,
    createNewMerchant,
    nonceApi
  };
})();
