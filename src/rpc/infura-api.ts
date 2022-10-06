import axios, {AxiosInstance} from "axios";
import {AssetData, TxDetails} from "../helpers/types";
import {ethereumRpcUrl, polygonRpcUrl} from "../config/appconfig";
import {web3} from "../utils/walletConnect";
import {AbiInput, AbiOutput, AbiType, StateMutabilityType} from "web3-utils";
import {PAY_WITH_USDC_ENABLED} from "../helpers/tx";

//TODO this should be merged with the 'USDC' constant in some other files
//FIXME this should have a corresponding mainnet address
const USDCContractAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";

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

export async function infuraGetAccountBalances(address: string, chainId: string): Promise<AssetData[]> {
    const ethBalance = await infuraGetAccountBalance(address, chainId);

    //TODO this should be extended to mainnet
    if (PAY_WITH_USDC_ENABLED && chainId.includes("5")) {
        const usdcEthBalance = await infuraGetCustomTokenAccountBalance(address, USDCContractAddress, chainId);
        return [ethBalance, usdcEthBalance];
    } else {
        return [ethBalance];
    }

}

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


interface AbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs?: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    payable?: boolean;
    stateMutability?: StateMutabilityType;
    type: AbiType;
    gas?: number;
}

export async function infuraGetCustomTokenAccountBalance(address: string, contractAddress: string, chainId: string): Promise<AssetData> {
    // const data = {
    //     "jsonrpc": "2.0",
    //     "method": "eth_getBalance",
    //     "params": [{"to": contractAddress, "data": address}, "latest"],
    //     "id": 1
    // };
    //see https://chainstack.com/ultimate-guide-erc20-token-balance/

    let minABI: AbiItem[] = [
        {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
        {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
        {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}
    ];
    const contract = new web3.eth.Contract(minABI, USDCContractAddress);
    const balance = await contract.methods.balanceOf(address).call()
    await balance
    console.log(`balance for custom token ${balance}`)
    const assetData = {
        symbol: "USDC",
        name: "USDC",
        decimals: "6",
        contractAddress: USDCContractAddress,
        balance: balance
    }
    return assetData;

    // const data = {
    //     "jsonrpc": "2.0",
    //     "method": "eth_getBalance",
    //     "params": [address, contractAddress, "latest"],
    //     "id": 1
    // };
    // if (chainId.includes("80001")) {
    //     return infuraGetPolygonAccountBalance(data);
    // }
    // return infuraGetEthAccountBalance(data);
}

async function infuraGetEthAccountBalance(data: any): Promise<AssetData> {
    const response = await ethInstance.post(
        "",
        data
    );
    const {result} = response.data;
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
    const {result} = response.data;
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
    const {result} = response.data;
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
    const {result} = response.data;
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
    const {result} = response.data;
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
    const {result} = response.data;
    console.debug(`gas price for chainId ${chainId} response ${result}`);
    return result;
};
