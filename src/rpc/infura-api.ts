import axios, {AxiosInstance} from "axios";
import {AssetData} from "../helpers/types";

// Infura-Api only used for kovan & polygon at the moment
// FIXME the url should be read from the config, as everywhere else,
// not hardcoded here

//TODO extract config rpc urls
const ethKovanRpcUrl = "https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09";
// TODO infure polygon needs a credit card to be added to be enabled
// const polygonMumbainRpcUrl = "https://polygon-mainnet.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09";

const polygonMumbainRpcUrl = "https://matic-testnet-archive-rpc.bwarelabs.com/";



const ethInstance: AxiosInstance = axios.create({
    baseURL: ethKovanRpcUrl,
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const polygonInstance: AxiosInstance = axios.create({
    baseURL: polygonMumbainRpcUrl,
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
