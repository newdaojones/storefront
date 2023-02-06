// Blockchain mainnet/testnet flag
export const MAINNET_MODE = false;

// Api backend configuration flavor (devMode true points api to localhost: 5000)
export const isDevMode = () => false;


//use flavors gradle like feature
/*
MAINNET = true isDevMode = false
 => mainnet with test api

MAINNET = false
   isDevMode = true
     => devmode with localhost api
     => devmode with test api

 */

