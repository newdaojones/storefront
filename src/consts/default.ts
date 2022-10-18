import {isTestnetMode} from "../config/appconfig";

export const DEFAULT_MAIN_CHAINS = [
  "eip155:1",// ethereum mainnet
  // "eip155:10",
  // "eip155:100",
  //"eip155:137",// polygon mainnet infura inodes requires that the account enters a payment method
  // "eip155:42161",
  // "eip155:42220",
  // "cosmos:cosmoshub-4",
  // "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ",
];

export const DEFAULT_TEST_CHAINS = [
  // testnets
  "eip155:5",//ethereum gorli
  // "eip155:42",//ethereum kovan
  // "eip155:69",
  "eip155:80001",//polygon mumbai
  // "eip155:421611",
  // "eip155:44787",
  // "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K",
];

export const DEFAULT_CHAINS = isTestnetMode() ? DEFAULT_TEST_CHAINS: DEFAULT_MAIN_CHAINS;

// Wallet connect project ID
export const DEFAULT_PROJECT_ID = 'f17194a7efd15ee24623a532ccff7c77';
export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com';

export const DEFAULT_LOGGER = 'info';

const APP_URL = isTestnetMode() ? 'https://test.jxndao.com/storefront': 'https://jxndao.com/storefront'
const MERCHANT_APP_URL = isTestnetMode() ? 'https://test.jxndao.com/storefront/merchant': 'https://jxndao.com/storefront/merchant'

// TODO Change app data
export const DEFAULT_APP_METADATA = {
  name: 'NDJ Storefront',
  description: 'StoreFront Pay DApp',
  url: APP_URL,
  icons: ['https://jxndao.com/logo192.png'],
};

export const DEFAULT_MERCHANT_APP_METADATA = {
  name: 'Storefront Merchant',
  description: 'StoreFront Merchant Dashboard',
  url: MERCHANT_APP_URL,
  icons: ['https://jxndao.com/logo192.png'],
};

/**
 * EIP155
 */
export enum DEFAULT_EIP155_METHODS {
  ETH_SEND_TRANSACTION = "eth_sendTransaction",
  ETH_SIGN_TRANSACTION = "eth_signTransaction",
  ETH_SIGN = "eth_sign",
  PERSONAL_SIGN = "personal_sign",
}

export enum DEFAULT_EIP_155_EVENTS {
  ETH_CHAIN_CHANGED = "chainChanged",
  ETH_ACCOUNTS_CHANGED = "accountsChanged",
}

/**
 * COSMOS
 */
export enum DEFAULT_COSMOS_METHODS {
  COSMOS_SIGN_DIRECT = "cosmos_signDirect",
  COSMOS_SIGN_AMINO = "cosmos_signAmino",
}

export enum DEFAULT_COSMOS_EVENTS {}

/**
 * SOLANA
 */
export enum DEFAULT_SOLANA_METHODS {
  SOL_SIGN_TRANSACTION = "solana_signTransaction",
  SOL_SIGN_MESSAGE = "solana_signMessage",
}

export enum DEFAULT_SOLANA_EVENTS {}
