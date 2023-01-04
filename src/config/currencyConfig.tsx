import {formatFixed} from "@ethersproject/bignumber";
import {BigNumber} from "ethers";

export const ETH_TOKEN = 'ETH';
export const ETH_DECIMALS = 18;

export const PAY_WITH_USDC_ENABLED = true;

export const USDC_TOKEN = 'USDC';
export const USDC_DECIMALS = 6;

const USDCContractAddressGorli = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; //on ethereum gorli
// const USDCContractAddressGorli = "0x179c54e1fea2cd75de3dc5fa61869b93d8c5b317"; //wyre USDC on ethereum gorli

const USDCContractAddressMainnet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; //on ethereum mainnet also on goerli, but using the wyre one here.

//TODO need to be extended to polygon

export const SUPPORTED_STABLETOKENS = [USDC_TOKEN];


//TODO this should be merged with the 'USDC' constant in some other files
//FIXME this should have a corresponding mainnet address

//TODO this would need chain, to be able to support usdc on both polygon & ethereum chains
export interface SupportedCurrency {
    chain: string;
    token: string;
    decimals: number;
    contractAddress: string;
}
export const supportedCurrencies: SupportedCurrency[] = [
    {chain: "eip155:5", token: USDC_TOKEN, decimals: USDC_DECIMALS, contractAddress: USDCContractAddressGorli},
    {chain: "eip155:1", token: USDC_TOKEN, decimals: USDC_DECIMALS, contractAddress: USDCContractAddressMainnet}
];

export function getCurrency(chainId: string, token: string): SupportedCurrency | null {
    return supportedCurrencies.find(value => value.chain.includes(chainId) && value.token === token) || null;
}

export function getCurrencyByToken(token: string): SupportedCurrency {
    const found = supportedCurrencies.find(value => value.token === token)
    if (found) return found
    else throw new Error(`token: ${token} is not supported`);
}

// FIXME remove 'ETH' & matic constants to the currencyConfig
// TODO put this into a inheritance and have currency subclasses implement their own way
export const getFormattedTokenValue = (token: string, value: BigNumber) => {
    if (token === USDC_TOKEN) {
        const paymentValueInTokenString = formatFixed(value, USDC_DECIMALS);
        return `${Number(paymentValueInTokenString).toFixed(2)} ${token}`;
    } else if (token === 'ETH' || token === 'MATIC') {
        const paymentValueInTokenString = formatFixed(value, 18);
        const trxValueAsNumber = Number(paymentValueInTokenString);
        return `${trxValueAsNumber.toFixed(6)} ${token}`;
    } else {
        throw Error(`token not handled ${token}`);
    }
}

export function isUSDStableToken(token: string) {
    return token === USDC_TOKEN || token === "USDT";
}
