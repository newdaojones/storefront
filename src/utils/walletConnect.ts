import Web3 from 'web3';
import * as ethers from 'ethers';
const ENS = require('@ensdomains/ensjs').default;
const getEnsAddress = require('@ensdomains/ensjs').getEnsAddress;
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/cd5b0778994b4e34b166f2569a1166c0');

export const web3 = new Web3('https://mainnet.infura.io/v3/cd5b0778994b4e34b166f2569a1166c0');
export const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
