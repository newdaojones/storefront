// read only
import { isDevMode, MAINNET_MODE } from "./flavorconfig";


export const isBlockchainTestnetMode = () => !MAINNET_MODE;

const ethereumGorliTestnetRpcUrl = "https://eth-goerli.g.alchemy.com/v2/8mNYdB7w7T8HvwsEKVm5NvCpe9SQCX3d";
const ethereumMainnetRpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/1j5efiwDVHct1bOwBTMCt5wBkaN8FfVH';

const avalancheProvider =
    'https://avalanche-mainnet.infura.io/v3/cd5b0778994b4e34b166f2569a1166c0';
const avalancheTestnetProvider =
    'https://avalanche-fuji.infura.io/v3/cd5b0778994b4e34b166f2569a1166c0';

//TODO Move to another INFURA account, since polygon mumbai api requires credit card
const polygonTestnetRpcUrl = "https://matic-testnet-archive-rpc.bwarelabs.com/";
const polygonMainnetRpcUrl = "https://rpc-mainnet.matic.network";

export const ethereumRpcUrl = MAINNET_MODE && !isDevMode() ? ethereumMainnetRpcUrl : ethereumGorliTestnetRpcUrl;
export const polygonRpcUrl = MAINNET_MODE && !isDevMode() ? polygonMainnetRpcUrl : polygonTestnetRpcUrl;
export const avalancheRpcUrl = MAINNET_MODE && !isDevMode() ? avalancheProvider : avalancheTestnetProvider

/**
 * App url configs
 */

const merchantUrl = 'merchant.storefrontpay.app';
const consumerUrl = 'customer.storefrontpay.app';

const testMerchantUrl = 'test.storefrontpay.app/merchant';
const testConsumerUrl = 'test.storefrontpay.app';

export const APP_URL = isBlockchainTestnetMode() ? `https://${testConsumerUrl}` : `https://${consumerUrl}`;
export const MERCHANT_APP_URL = isBlockchainTestnetMode() ? `https://${testMerchantUrl}` : `https://${merchantUrl}`;


export function isMerchantUrl(hostname: string | undefined, pathname: string) {
    if (hostname && (hostname === merchantUrl || hostname.includes(merchantUrl))) {
        return true;
    }
    return pathname.includes('/merchant') || pathname.includes(merchantUrl) || pathname === merchantUrl;
}
