import axios, { AxiosInstance } from "axios";
import { AssetData, GasPrices, ParsedTx } from "../helpers/types";

// FIXME this should be done via the rpc provider to avoid using this hard-coded nodes, that result in 429 errors
// https://github.com/pedrouid/ethereum-api
// It doesn't support Ethereum KOVAN
const ethereumApi: AxiosInstance = axios.create({
    baseURL: "https://ethereum-api.xyz",
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

async function apiGetAccountAssets(address: string, chainId: string): Promise<AssetData[]> {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(
        `/account-assets?address=${address}&chainId=${ethChainId}`,
    );
    const { result } = response.data;
    return result;
}

export async function apiGetAccountBalance(address: string, chainId: string): Promise<AssetData> {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(
        `/account-balance?address=${address}&chainId=${ethChainId}`,
    );
    const { result } = response.data;
    return result;
}

export async function apiGetAccountTransactions(
    address: string,
    chainId: string,
): Promise<ParsedTx[]> {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(
        `/account-transactions?address=${address}&chainId=${ethChainId}`,
    );
    const { result } = response.data;
    return result;
}

export const apiGetAccountNonce = async (address: string, chainId: string): Promise<number> => {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(`/account-nonce?address=${address}&chainId=${ethChainId}`);
    const { result } = response.data;
    return result;
};

//FIXME no chain id, only for ethereum ??
export const apiGetGasPrices = async (chainId: string): Promise<GasPrices> => {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(`/gas-prices?chainId=${ethChainId}`);
    const { result } = response.data;
    return result;
};
