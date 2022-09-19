import Web3 from 'web3';
import * as ethers from 'ethers';
import {ethereumRpcUrl} from "../config/appconfig";
const ENS = require('@ensdomains/ensjs').default;
const getEnsAddress = require('@ensdomains/ensjs').getEnsAddress;

const provider = new ethers.providers.JsonRpcProvider(ethereumRpcUrl);
export const web3 = new Web3(ethereumRpcUrl);
export const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
