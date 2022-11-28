import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ProfilePage} from "./profile";
import {SettingsPage} from "./settings";
import {CreateOrderPage} from "./create_order";
import {Menu} from "../../components";
import {useWalletConnectClient} from "../../contexts/walletConnect";
import StorefrontIcon from "../../assets/images/storefront.svg";
import FindIcon from "../../assets/images/find.svg";
import SettingsIcon from "../../assets/images/settings.svg";
import {useSelector} from "react-redux";
import {selectEnsName} from "../../store/selector";

/**
 * http://localhost:3000/storefront/merchant
 * @constructor
 */
export const MerchantDashboard = () => {
    let mainPage = ProfilePage;

    const onDisconnect = () => {
        session && disconnect(true).then(r => {
            console.info(`disconnected. reloading page...`)
            setTimeout(() => {
                window.location.reload();
            }, 200);
        });
    };

    // Initialize the WalletConnect client.
    const {
        session,
        disconnect,
        account,
        isLoading,
    } = useWalletConnectClient();
    const ensName = useSelector(selectEnsName);

    let menuItems = [
        { route: '/merchant/profile', icon: StorefrontIcon, text: "Dashboard" },
        { route: '/merchant/order', icon: FindIcon, text: "Create Order" },
        { route: '/merchant/settings', icon: SettingsIcon, text: "Settings" },
    ];
    let ens = ensName;

    return (
      <div className="w-full h-full flex-1">
          {account && <Menu
              status={isLoading ? 'Connecting...' : account ? 'Connected' : 'Disconnected'}
              onDisconnect={onDisconnect}
              onSelectAccount={() => {}}
              account={account}
              ensName={ens || null}
              items={menuItems}
              size={200}
              key={'topMenu'}
              merchantLogin={true}
          />}
        <Switch>
          <Route path="/merchant/profile" component={mainPage} />
          <Route path="/merchant/settings" component={SettingsPage} />
          <Route path="/merchant/order" component={CreateOrderPage} />
          <Redirect to="/merchant/profile" />
        </Switch>
      </div>
    );
}
