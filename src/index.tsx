import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/index.scss';

import reportWebVitals from './reportWebVitals';
import {store} from './store';
import {JsonRpcContextProvider} from "./contexts/JsonRpcContext";
import {WalletConnectProvider} from "./contexts/walletConnect";
import {ErrorPage} from "./pages/storefrontpay/error";
import {Landing} from "./pages/landing";

const Pay = React.lazy(() =>
    import("./pages/storefrontpay/pay").then((module) => ({
        default: module.Pay,
    }))
);

const TransactionStatus = React.lazy(() =>
    import("./pages/storefrontpay/transactionStatus").then((module) => ({
        default: module.TransactionStatus,
    }))
);

const Main = React.lazy(() =>    import("./pages").then((module) => ({
        default: module.Main,
    }))
);

const MerchantMain = React.lazy(() =>
    import("./pages/merchant/merchantIndex").then((module) => ({
        default: module.MerchantMain,
    }))
);

ReactDOM.render(
  <Provider store={store}>
    <WalletConnectProvider>
      <JsonRpcContextProvider>
          <Suspense fallback={Landing}>
          <Router basename={'/'}>
              <Switch>
                  <Route path={'/pay'} component={Pay}/>
                  <Route path={'/status'} component={TransactionStatus}/>
                  <Route path={'/error'} component={ErrorPage}/>
                  <Route path={'/merchant'} component={MerchantMain}/>
                  <Route path={'/'} component={Main} />
              </Switch>
          </Router>
          <ToastContainer
              toastClassName="w-full flex bg-black bg-opacity-90 shadow-md p-4 text-sm"
              bodyClassName="w-full text-sm text-white font-med block p-1"
              autoClose={false}
              icon={false}
              position="bottom-center"
              hideProgressBar={true}
              closeOnClick={false}
          />
          </Suspense>
        </JsonRpcContextProvider>
    </WalletConnectProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
