import axios from './axios';

export const UserService = (function () {
  const loginApi = async (payload: string) => {
    return axios.get(`fund/members/${payload}/login`);
  };

  const getMeApi = async () => {
    return axios.get('/fund/members/me');
  };

  const getFundInfoApi = async () => {
    return axios.get('/fund/info');
  };

  const getFundBalancesApi = async () => {
    return axios.get('/fund/balances');
  };

  const getAumApi = async () => {
    return axios.get('/fund/aum');
  };

  const getDepositsApi = async () => {
    return axios.get('/fund/deposits');
  };

  const getDepositorInfoApi = async (address: string) => {
    return axios.get(`/fund/depositors/${address}/info`);
  };

  const getDepositorsApi = async () => {
    return axios.get('/fund/depositors');
  };

  const getPriceWatchersApi = async () => {
    return axios.get('/fund/prices');
  };

  const getTickersApi = async () => {
    return axios.get('/fund/prices/tickers');
  };

  return {
    loginApi,
    getMeApi,
    getFundInfoApi,
    getFundBalancesApi,
    getDepositorInfoApi,
    getDepositorsApi,
    getAumApi,
    getDepositsApi,
    getPriceWatchersApi,
    getTickersApi,
  };
})();
