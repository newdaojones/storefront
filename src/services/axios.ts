import axios from 'axios';

// axios.defaults.baseURL = 'https://api.jxndao.com/';
// axios.defaults.baseURL = 'http://localhost:5000/';
// axios.defaults.baseURL = 'http://fundapi-test.us-east-2.elasticbeanstalk.com/';
axios.defaults.baseURL = 'https://test-api.jxndao.com/';

axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  response => response,
  err => {
    const error = err.response;

    throw error || err;
  }
);

const AxiosService = function () {
  let AuthorizationToken: any = '';
  let Nonce: any = '';

  function addHeaders(userConfig: any) {
    const globalHeaders: any = {};

    // You can set global headers here
    if (AuthorizationToken) {
      globalHeaders['Authorization'] = `${AuthorizationToken}`;
    }

    if (Nonce) {
      globalHeaders['WWW-Authenticate'] = `${Nonce}`;
    }

    const { headers } = userConfig;

    // Return extended config
    return {
      headers: {
        ...globalHeaders,
        ...headers,
      },
    };
  }

  // Set authorization token
  function setAuthorizationToken(token: string) {
    AuthorizationToken = token;
  }

  function setNonce(nonce: string) {
    Nonce = nonce;
  }

  // GET method
  function get(endPoint: string, userConfig = {}) {
    return axios.get(endPoint, addHeaders(userConfig));
  }

  // POST method
  function post(endPoint: string, params = {}, userConfig = {}) {
    return axios.post(endPoint, params, addHeaders(userConfig));
  }

  // Patch method
  function patch(endPoint: string, params = {}, userConfig = {}) {
    return axios.patch(endPoint, params, addHeaders(userConfig));
  }

  function put(endPoint: string, params = {}, userConfig = {}) {
    return axios.put(endPoint, params, addHeaders(userConfig));
  }

  function del(endPoint: string, userConfig = {}) {
    return axios.delete(endPoint, addHeaders(userConfig));
  }

  return {
    setAuthorizationToken,
    setNonce,
    get,
    post,
    put,
    patch,
    del,
  };
};

// let's return back our create method as the default.
export default AxiosService();
