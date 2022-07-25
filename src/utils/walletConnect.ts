import Web3 from 'web3';
import * as ethers from 'ethers';
const ENS = require('@ensdomains/ensjs').default;
const getEnsAddress = require('@ensdomains/ensjs').getEnsAddress;
// TODO extract network config
// const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/cd5b0778994b4e34b166f2569a1166c0');
export const ethereumRpcUrl = 'https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09';

const provider = new ethers.providers.JsonRpcProvider(ethereumRpcUrl);
export const web3 = new Web3(ethereumRpcUrl);
export const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
