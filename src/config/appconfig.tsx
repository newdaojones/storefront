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
