import Web3 from 'web3';
import * as ethers from 'ethers';
import { avalancheRpcUrl, ethereumRpcUrl } from "../config/appconfig";
const ENS = require('@ensdomains/ensjs').default;
const getEnsAddress = require('@ensdomains/ensjs').getEnsAddress;

const provider = new ethers.providers.JsonRpcProvider(ethereumRpcUrl);
export const avalancheWeb3 = new Web3(avalancheRpcUrl);
export const ethereumWeb3 = new Web3(ethereumRpcUrl)
export const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
