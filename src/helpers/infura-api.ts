import axios, { AxiosInstance } from "axios";
import { AssetData, GasPrices } from "./types";

//FIXME the url should be read from the config, as everywhere else
const ethereumApi: AxiosInstance = axios.create({
    baseURL: "https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09",
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export async function infuraGetAccountBalance(address: string, chainId: string): Promise<AssetData> {
    const ethChainId = chainId.split(":")[1];
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": [address, "latest"],
        "id": 1
    };
    const response = await ethereumApi.post(
        "",
        data
    );
    const { result } = response.data;

    const assetData = {
        symbol: "ETH",
        name: "Ether",
        decimals: "18",
        contractAddress: "",
        balance: result
    }
    return assetData;
}

/**
 * https://docs.infura.io/infura/networks/ethereum/json-rpc-methods/parity_nextnonce
 * @param address
 * @param chainId
 */
export const infuraGetAccountNonce = async (address: string, chainId: string): Promise<number> => {
    const ethChainId = chainId.split(":")[1];
    const data = {
        "jsonrpc": "2.0",
        "method": "parity_nextNonce",
        "params": [address],
        "id": 1
    };
    const response = await ethereumApi.post(
        "",
        data
    );
    const { result } = response.data;

    const assetData = {
        symbol: "ETH",
        name: "Ether",
        decimals: "18",
        contractAddress: "",
        balance: result
    }
    console.info(`got nonce: ${result}`)
    return result;
};

export const apiGetGasPrices = async (): Promise<GasPrices> => {
    const response = await ethereumApi.get(`/gas-prices`);
    const { result } = response.data;
    return result;
};
