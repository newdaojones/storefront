import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './assets/styles/index.scss';

import { Main } from './pages';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { WalletConnectProvider } from './contexts/walletConnect';
import {JsonRpcContextProvider} from "./contexts/JsonRpcContext";

ReactDOM.render(
  <Provider store={store}>
    <WalletConnectProvider>
        <JsonRpcContextProvider>
        <Router basename={'/storefront'}>
        <Main />
        <ToastContainer className="p-4"
          toastClassName="w-full m-w-45 flex bg-black bg-opacity-90 shadow-md p-4 text-sm"
          bodyClassName="text-sm font-white font-med block p-4"
          autoClose={false}
          icon={true}
          position="bottom-center"
          hideProgressBar={true}
          closeOnClick={false}
        />
      </Router>
        </JsonRpcContextProvider>
    </WalletConnectProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
