import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { AccountModal } from '../../components';

import { MerchantDashboard } from './merchant_dashboard';
import { Landing } from '../landing';

import FindIcon from '../../assets/images/find.svg';
import StorefrontIcon from '../../assets/images/storefront.svg';
import SettingsIcon from '../../assets/images/settings.svg';

import { selectEnsName, selectMerchantInfo, selectUserLoading } from '../../store/selector';
import { useWalletConnectClient } from '../../contexts/walletConnect';
import { OrbitalMenu } from "../../components/menu/circular";
import { MerchantLogin } from "./merchant_login";
import { RegisterMerchant } from "../storefrontpay/register";
import menuBackground from "../../assets/images/background/menu_background.svg";

/**
 * http://localhost:3000/storefront/merchant
 * @constructor
 */
export const MerchantMain = () => {
    const ensName = useSelector(selectEnsName);
    const [openSwitchAccount, setOpenSwitchAccount] = useState(false);

    // Initialize the WalletConnect client.
    const {
        session,
        isInitializing,
        isWaitingForApproval,
        connect,
        disconnect,
        switchAccount,
        initialized,
        account,
        isLoading,
        accounts,
        merchantLogin,
    } = useWalletConnectClient();
    const merchantInfo = useSelector(selectMerchantInfo);
    const userLoading = useSelector(selectUserLoading);

    const onSelectAccount = (item: string) => {
        setOpenSwitchAccount(false);
        switchAccount(item);
    };

    const onDisconnect = () => {
        session && disconnect(true).then(r => {
            console.info(`disconnected. reloading page...`)
            setTimeout(() => {
                window.location.reload();
            }, 200);
        });
    };

    React.useEffect(() => {
        if (initialized && !session) {
            connect();
        }
    }, [initialized, connect, session]);

    let menuItems = [
        { route: '/merchant/profile', icon: StorefrontIcon, text: "Dashboard" },
        { route: '/merchant/order', icon: FindIcon, text: "Create Order" },
        { route: '/merchant/settings', icon: SettingsIcon, text: "Settings" },
    ];

    let ens = ensName;
    if (!ensName) {
        // ens = accountInfo?.memberENSAddress;
    }

    return (
        <div className="h-screen w-screen flex">
            {account && merchantLogin.merchantExists && !!merchantInfo &&
                <div>
                    <div className="flex items-center justify-between h-10"
                        style={{
                            width: '100%',
                            minWidth: '200px',
                            position: 'absolute',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundImage: `url(${menuBackground})`,
                        }} />

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
                </div>
            }
            {
                isLoading || isInitializing || userLoading ?
                    <Landing text={isWaitingForApproval ? "Waiting for signature..." : "Loading..."} />
                    : account ?
                        merchantLogin.merchantExists && merchantInfo ? <MerchantDashboard /> : <RegisterMerchant /> :
                        <MerchantLogin />
            }
            <AccountModal
                account={account}
                accounts={accounts}
                open={openSwitchAccount}
                onClose={() => setOpenSwitchAccount(false)}
                onSelect={onSelectAccount}
            />
        </div>
    );
}
    ;
