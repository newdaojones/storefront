import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Routes, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './assets/styles/index.scss';

import { Main } from './pages';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import {JsonRpcContextProvider} from "./contexts/JsonRpcContext";
import {Pay} from "./pages/pay";
import {WalletConnectProvider} from "./contexts/walletConnect";

ReactDOM.render(
  <Provider store={store}>
    <WalletConnectProvider>
        <JsonRpcContextProvider>
      <Router basename={'/storefront'}>
          <Routes>
              <Route path={'/pay'} element={Pay}></Route>
              <Route path={'/'} element={Main}></Route>
          </Routes>
        <ToastContainer
          toastClassName="w-full m-w-45 flex bg-white bg-opacity-25 border-2 border-secondary rounded-16xl shadow-md p-4 text-sm"
          bodyClassName={() => 'text-sm font-white font-med block p-1'}
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
