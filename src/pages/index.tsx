import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {AccountModal, Menu} from '../components';

import {Dashboard} from './dashboard';
import {Login} from './login';
import {Landing} from './landing';

import BookIcon from '../assets/images/book.svg';
import PlayIcon from '../assets/images/play.svg';
import ProfileIcon from '../assets/images/profile.svg';
import VaultIcon from '../assets/images/vault.svg';

import { selectAccountInfo, selectEnsName } from '../store/selector';
import {useWalletConnectClient, WalletConnectProvider} from '../contexts/walletConnect';

export const Main = () => {
  const ensName = useSelector(selectEnsName);
  const accountInfo = useSelector(selectAccountInfo);
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
    { route: '/vault', icon: VaultIcon },
    { route: '/priceWatchers', icon: BookIcon },
    { route: '/play', icon: PlayIcon },
    { route: '/home', icon: ProfileIcon },
  ];

  let ens = ensName || null;
  // if (!ensName) {
  //   ens = accountInfo?.memberENSAddress;
  // }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Menu
        status={isLoading ? 'Connecting...' : account ? 'Connected' : 'Disconnected'}
        onDisconnect={onDisconnect}
        onSelectAccount={() => setOpenSwitchAccount(true)}
        account={account}
        ensName={ens}
        items={menuItems}
        size={200}
        key={'orbitalMenu'}
      />
      {isLoading || isInitializing ? <Landing /> : account ? <Dashboard /> : <Login />}
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
