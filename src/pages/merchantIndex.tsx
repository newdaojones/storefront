import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { AccountModal } from '../components';

import { MerchantDashboard} from './merchant_dashboard';
import { Login } from './login';
import { Landing } from './landing';

import PlayIcon from '../assets/images/play.svg';
import ProfileIcon from '../assets/images/profile.svg';

import { selectAccountInfo, selectEnsName } from '../store/selector';
import { useWalletConnectClient } from '../contexts/walletConnect';
import {OrbitalMenu} from "../components/menu/circular";


/**
 * http://localhost:3000/storefront/merchant
 * @constructor
 */
export const MerchantMain = () => {
  const ensName = useSelector(selectEnsName);
  const accountInfo = useSelector(selectAccountInfo);
  const [openSwitchAccount, setOpenSwitchAccount] = useState(false);

  console.info(`loading MerchantMain`);
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
    { route: '/merchant/settings', icon: PlayIcon },
    { route: '/merchant/profile', icon: ProfileIcon },
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
        {isLoading || isInitializing ? <Landing /> : account ? <MerchantDashboard /> : <Login />}
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
