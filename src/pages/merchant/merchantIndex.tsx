import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { AccountModal } from '../../components';

import { MerchantDashboard} from './merchant_dashboard';
import { Landing } from '../landing';

import FindIcon from '../../assets/images/find.svg';
import StorefrontIcon from '../../assets/images/storefront.svg';
import SettingsIcon from '../../assets/images/settings.svg';

import { selectAccountInfo, selectEnsName } from '../../store/selector';
import { useWalletConnectClient } from '../../contexts/walletConnect';
import {OrbitalMenu} from "../../components/menu/circular";
import {MerchantLogin} from "./merchant_login";


/**
 * http://localhost:3000/storefront/merchant
 * @constructor
 */
export const MerchantMain = () => {
  const ensName = useSelector(selectEnsName);
  // const accountInfo = useSelector(selectAccountInfo);
  const [openSwitchAccount, setOpenSwitchAccount] = useState(false);

  // Initialize the WalletConnect client.
  const {
    session,
    isInitializing,
    connect,
    disconnect,
    switchAccount,
    initialized,
    account,
    isLoading,
    accounts,
    merchantLogin,
  } = useWalletConnectClient();

  const onSelectAccount = (item: string) => {
    setOpenSwitchAccount(false);
    switchAccount(item);
  };

  const onDisconnect = () => {
    session && disconnect();
  };

  React.useEffect(() => {
    if (initialized && !session) {
      connect();
    }
  }, [initialized, connect, session]);

  let menuItems = [
    { route: '/merchant/profile', icon: StorefrontIcon },
    { route: '/merchant/order', icon: FindIcon },
    { route: '/merchant/settings', icon: SettingsIcon },
  ];

  let ens = ensName;
  if (!ensName) {
    // ens = accountInfo?.memberENSAddress;
  }

  return (
      <div className="h-screen w-screen flex">
        <OrbitalMenu
            status={isLoading ? 'Connecting...' : account ? 'Connected' : 'Disconnected'}
            onDisconnect={onDisconnect}
            onSelectAccount={() => setOpenSwitchAccount(true)}
            account={account}
            ensName={ens}
            items={menuItems}
            size={450}
            key={'orbMenu'}
        />
        {isLoading || isInitializing ? <Landing /> : account && merchantLogin ? <MerchantDashboard /> : <MerchantLogin />}
        <AccountModal
            account={account}
            accounts={accounts}
            open={openSwitchAccount}
            onClose={() => setOpenSwitchAccount(false)}
            onSelect={onSelectAccount}
        />
      </div>
  );
};
