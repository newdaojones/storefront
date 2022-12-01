import axios, { AxiosInstance } from "axios";
import {AssetData, GasPrices, ParsedTx, TxDetails} from "../helpers/types";
import {toWad} from "../helpers";
import {RpcApi} from "./rpc-api";

const ethereumApi: AxiosInstance = axios.create({
    baseURL: "https://ethereum-api.xyz",
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// async function apiGetAccountAssets(address: string, chainId: string): Promise<AssetData[]> {
//     const ethChainId = chainId.split(":")[1];
//     const response = await ethereumApi.get(
//         `/account-assets?address=${address}&chainId=${ethChainId}`,
//     );
//     const { result } = response.data;
//     return result;
// }

async function apiGetAccountBalance(address: string, chainId: string): Promise<AssetData[]> {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(
        `/account-balance?address=${address}&chainId=${ethChainId}`,
    );
    const { result } = response.data;
    return [result];
}

async function apiGetAccountTransactions(
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

const apiGetAccountNonce = async (address: string, chainId: string): Promise<number> => {
    const ethChainId = chainId.split(":")[1];
    const response = await ethereumApi.get(`/account-nonce?address=${address}&chainId=${ethChainId}`);
    const { result } = response.data;
    return result;
};

/**
 * Sample response
 * {"success":true,"result":{"timestamp":1664460006089,"slow":{"time":84,"price":14.2},"average":{"time":84,"price":14.2},"fast":{"time":30,"price":53}}}
 * @param chainId
 */
const apiGetGasPrices = async (chainId: string): Promise<GasPrices> => {
    const ethChainId = chainId.split(":")[1];
    console.info(`apiGetGasPrices for chainId: ${chainId} ethChainId: ${ethChainId}`);
    const response = await ethereumApi.get(`/gas-prices?chainId=${ethChainId}`);
    const { result } = response.data;
    return result;
};


/**
 * TODO should remove this dependency in favor of some other RPC based solution like the infura.
 * See https://github.com/WalletConnect/web-examples/commit/6c23356a550d797558362a5d2d44ac865856f88d
 *
 * https://ethereum-api.xyz/supported-chains
 */
export class EthereumXyzApi implements RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData[]> {
        return apiGetAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        return apiGetAccountNonce(address, chainId);
    }

    async getGasPrices(chainId: string): Promise<string> {
        const gasPrices = await apiGetGasPrices(chainId);
        const toWad1 = toWad(`${gasPrices.fast.price}`, 9);
        const toHexString = toWad1.toHexString();
        console.info(`EthereumXyzApi gasPrices average: ${gasPrices.average.price} fast: ${gasPrices.fast.price} slow: ${gasPrices.fast.price} -->  ${toWad1} WAD hex: ${toHexString}`);
        return toHexString;
    }

    async getAccountTransactions(address: string, chainId: string): Promise<ParsedTx[]> {
        return apiGetAccountTransactions(address, chainId);
    }

    getTransactionByHash(hash: string, chainId: string): Promise<TxDetails> {
        //
        throw new Error("not impl");
    }

    getAccountPendingTransactions(address: string, chainId: string): Promise<TxDetails[]> {
        return Promise.resolve([]);
    }
}
