import { formatFixed } from "@ethersproject/bignumber";
import { BigNumber } from "ethers";

export const ETH_TOKEN = 'ETH';
export const ETH_DECIMALS = 18;

export const PAY_WITH_USDC_ENABLED = true;

export const USDC_TOKEN = 'USDC';
export const USDC_DECIMALS = 6;

const USDCContractAddressGorli = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; //on ethereum gorli
const USDCContractAddressFuji = "0x5425890298aed601595a70ab815c96711a31bc65"; //on avalanche fuji
// const USDCContractAddressGorli = "0x179c54e1fea2cd75de3dc5fa61869b93d8c5b317"; //wyre USDC on ethereum gorli

const USDCContractAddressMainnet = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; //on ethereum mainnet also on goerli, but using the wyre one here.
const USDCContractAddressAvalanche = "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e";

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
    { chain: "eip155:5", token: USDC_TOKEN, decimals: USDC_DECIMALS, contractAddress: USDCContractAddressGorli },
    { chain: "eip155:1", token: USDC_TOKEN, decimals: USDC_DECIMALS, contractAddress: USDCContractAddressMainnet },
    { chain: "eip155:43113", token: USDC_TOKEN, decimals: USDC_DECIMALS, contractAddress: USDCContractAddressFuji },
    { chain: "eip155:43114", token: USDC_TOKEN, decimals: USDC_DECIMALS, contractAddress: USDCContractAddressAvalanche },
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
