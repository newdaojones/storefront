import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {AccountModal, Menu} from '../components';

import {Dashboard} from './dashboard';
import {Login} from './login';
import {Landing} from './landing';

import VaultIcon from '../assets/images/menu_icon.svg';

import {selectEnsName} from '../store/selector';
import {useWalletConnectClient} from '../contexts/walletConnect';
import {toast} from "react-toastify";

export const Main = () => {
  const ensName = useSelector(selectEnsName);
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
    enableToasts
  } = useWalletConnectClient();

  const onSelectAccount = (item: string) => {
    setOpenSwitchAccount(false);
    switchAccount(item);
  };

  const onDisconnect = () => {
    console.info(`onDisconnect called session ${session}`);
    toast.info("Disconnecting...", {autoClose: 1000})
    enableToasts(false).then(r => {
      session && disconnect(true).then(r => {
        console.info(`disconnected. reloading page...`)
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      });
    });
  };

  React.useEffect(() => {
    if (initialized && !session) {
      connect();
    }
  }, [initialized, connect, session]);

  let menuItems = [
    { route: '/home', icon: VaultIcon },
  ];

  let ens = ensName || null;
  // if (!ensName) {
  //   ens = accountInfo?.memberENSAddress;
  // }

  return (
    <div className="h-screen w-screen flex flex-col">
      {account && <Menu
        status={isLoading ? 'Connecting...' : account ? 'Connected' : 'Disconnected'}
        onDisconnect={onDisconnect}
        onSelectAccount={() => setOpenSwitchAccount(true)}
        account={account}
        ensName={ens}
        items={menuItems}
        size={200}
        key={'topMenu'}
      />}
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
