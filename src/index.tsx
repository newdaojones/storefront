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
      <Router basename={'/walletconnect-v2'}>
        <Main />
        <ToastContainer
          toastClassName="w-full m-w-45 flex bg-white bg-opacity-25 border-2 border-secondary rounded-16xl shadow-md p-4 text-sm"
          bodyClassName={() => 'text-sm font-white font-med block p-1'}
          autoClose={false}
          position="top-center"
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
