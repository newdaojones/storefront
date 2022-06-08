export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  'eip155:1',
  'eip155:137',
  'bep20:1',
  'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
  'bip122:000000000019d6689c085ae165831e93',
  // testnets
  'eip155:42',
];
// example 2 - bitcoin mainnet
//bip122:000000000019d6689c085ae165831e93:3JKr1213uKtMbymvtxtuie5twTKgniEp2h
// see https://github.com/WalletConnect/WCIPs/issues/12
export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS];

// Wallet connect project ID
export const DEFAULT_PROJECT_ID = 'f17194a7efd15ee24623a532ccff7c77';

export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com';

export enum DEFAULT_EIP155_METHODS {
  ETH_SEND_TRANSACTION = 'eth_sendTransaction',
  ETH_SIGN_TRANSACTION = 'eth_signTransaction',
  ETH_SIGN = 'eth_sign',
  PERSONAL_SIGN = 'personal_sign',
  ETH_SIGN_TYPED_DATA = 'eth_signTypedData',
  ETH_GET_BALANCE = 'eth_getBalance',

}

export enum DEFAULT_COSMOS_METHODS {
  COSMOS_SIGN_DIRECT = 'cosmos_signDirect',
  COSMOS_SIGN_AMINO = 'cosmos_signAmino',
}

export enum DEFAULT_SOLANA_METHODS {
  SOL_SIGN_TRANSACTION = 'solana_signTransaction',
  SOL_SIGN_MESSAGE = 'solana_signMessage',
}

export enum DEFAULT_BIP122_METHODS {
  BTC_SIGN_TRANSACTION = 'signTransaction',
  BTC_SIGN_MESSAGE = 'signMessage',
}

export const DEFAULT_LOGGER = 'info';

// TODO Change app data
export const DEFAULT_APP_METADATA = {
  name: 'NDJ Storefront',
  description: 'New DAO Jones StoreFront DApp',
  url: 'https://test.jxndao.com/storefront',
  icons: ['https://jxndao.com/logo192.png'],
};
