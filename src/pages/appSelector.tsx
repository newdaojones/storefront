import React from 'react';
import {useWalletConnectClient} from '../contexts/walletConnect';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

const Main = React.lazy(() =>    import(".").then((module) => ({
      default: module.Main,
    }))
);

const MerchantMain = React.lazy(() =>
    import("./merchant/merchantIndex").then((module) => ({
      default: module.MerchantMain,
    }))
);

export const AppSelector = () => {
  const {
    merchantLogin,
  } = useWalletConnectClient();


  React.useEffect(() => {
    if (merchantLogin) {

    }
  }, [merchantLogin]);

    return (<Router>
        <Switch>
            <Route path={'/'} component={merchantLogin.isMerchantUser ? MerchantMain : Main} />
        </Switch>
    </Router>)
};
