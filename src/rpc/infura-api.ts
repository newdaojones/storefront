import axios, { AxiosInstance } from "axios";
import { AssetData, GasPrices } from "../helpers/types";
import {getHexValueAsBigNumber} from "../helpers/tx";

//FIXME the url should be read from the config, as everywhere else,
// not hardcoded here
const rpcUrl = "https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: rpcUrl,
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
    const response = await axiosInstance.post(
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
    const response = await axiosInstance.post(
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

export const infuraGetGasPrices = async (chainId: string): Promise<string> => {
    const ethChainId = chainId.split(":")[1];
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_gasPrice",
        "params": [],
        "id": 1
    };
    const response = await axiosInstance.post('', data);
    const { result } = response.data;
    console.debug(`gas price response ${result}`);
    return result;
};
