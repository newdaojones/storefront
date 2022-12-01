//TODO inherit this from the environment / build system like in gradle
const DEVELOPMENT = 0;
const TEST = 1;

const MAINNET_MODE = false;

// export const BUILD_CONFIG = DEVELOPMENT;
const BUILD_CONFIG = TEST;

// @ts-ignore
// read only
export const isDevMode = () => BUILD_CONFIG === DEVELOPMENT;

export const isTestnetMode = () => !MAINNET_MODE;

const ethereumGorliTestnetRpcUrl = "https://goerli.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09";
const ethereumMainnetRpcUrl = 'https://mainnet.infura.io/v3/cd5b0778994b4e34b166f2569a1166c0';

//TODO Move to move to another INFURA account, since polygon mumbai api requires credit card
const polygonTestnetRpcUrl = "https://matic-testnet-archive-rpc.bwarelabs.com/";
const polygonMainnetRpcUrl = "https://rpc-mainnet.matic.network";



export const ethereumRpcUrl = MAINNET_MODE && !isDevMode() ? ethereumMainnetRpcUrl : ethereumGorliTestnetRpcUrl;
export const polygonRpcUrl = MAINNET_MODE && !isDevMode() ?  polygonMainnetRpcUrl : polygonTestnetRpcUrl;
