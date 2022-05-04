import axios from './axios';

export const UserService = (function () {
  // const loginApi = async (payload: string) => {
  //   return axios.get(`fund/members/${payload}/login`);
  // };
  //
  // const getMeApi = async () => {
  //   return axios.get('/fund/members/me');
  // };

  const getTickersApi = async () => {
    return axios.get('/tickers');
  };

  return {
    getTickersApi,
  };
})();
