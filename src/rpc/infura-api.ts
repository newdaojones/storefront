import axios, {AxiosInstance} from "axios";
import {AssetData, TxDetails} from "../helpers/types";
import {ethereumRpcUrl, polygonRpcUrl} from "../config/appconfig";

const ethInstance: AxiosInstance = axios.create({
    baseURL: ethereumRpcUrl,
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const polygonInstance: AxiosInstance = axios.create({
    baseURL: polygonRpcUrl,
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export async function infuraGetAccountBalance(address: string, chainId: string): Promise<AssetData> {
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": [address, "latest"],
        "id": 1
    };
    if (chainId.includes("80001")) {
        return infuraGetPolygonAccountBalance(data);
    }
    return infuraGetEthAccountBalance(data);
}

async function infuraGetEthAccountBalance(data: any): Promise<AssetData> {
    const response = await ethInstance.post(
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

async function infuraGetPolygonAccountBalance(data: any): Promise<AssetData> {
    const response = await polygonInstance.post(
        "",
        data
    );
    const { result } = response.data;
    const assetData = {
        symbol: "MATIC",
        name: "Matic",
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
export const infuraGetAccountTransactions = async (address: string, chainId: string): Promise<number> => {
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": [address],
        "id": 1
    };
    const response = await ethInstance.post(
        "",
        data
    );
    const { result } = response.data;
    console.info(`got nonce: ${result}`)
    return result;
};

export const infuraGetTransactionByHash = async (hash: string, chainId: string): Promise<TxDetails> => {
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": [hash],
        "id": 1
    };
    const response = await ethInstance.post(
        "",
        data
    );
    const { result } = response.data;
    console.info(`got trx details: ${result}`)
    return result;
};

/**
 * https://docs.infura.io/infura/networks/ethereum/json-rpc-methods/parity_nextnonce
 * @param address
 * @param chainId
 */
export const infuraGetAccountNonce = async (address: string, chainId: string): Promise<number> => {
    const data = {
        "jsonrpc": "2.0",
        "method": "parity_nextNonce",
        "params": [address],
        "id": 1
    };
    const response = await ethInstance.post(
        "",
        data
    );
    const { result } = response.data;
    console.info(`got nonce: ${result}`)
    return result;
};

export const infuraGetGasPrices = async (chainId: string): Promise<string> => {
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_gasPrice",
        "params": [],
        "id": 1
    };
    const response = await ethInstance.post('', data);
    const { result } = response.data;
    console.debug(`gas price for chainId ${chainId} response ${result}`);
    return result;
};
