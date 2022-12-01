import axios, {AxiosInstance} from "axios";
import {AssetData, ParsedTx, TxDetails} from "../helpers/types";
import {ethereumRpcUrl, polygonRpcUrl} from "../config/appconfig";
import {web3} from "../utils/walletConnect";
import {AbiInput, AbiOutput, AbiType, StateMutabilityType} from "web3-utils";
import {getCurrency, PAY_WITH_USDC_ENABLED, USDC_TOKEN} from "../config/currencyConfig";
import {toWad} from "../helpers";
import {RpcApi} from "./rpc-api";


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

async function infuraGetAccountBalances(address: string, chainId: string): Promise<AssetData[]> {
    const ethBalance = await infuraGetAccountBalance(address, chainId);

    if (PAY_WITH_USDC_ENABLED) {
        const usdcEthBalance = await infuraGetCustomTokenAccountBalance(address, USDC_TOKEN, chainId);
        return [ethBalance, usdcEthBalance];
    } else {
        return [ethBalance];
    }

}

async function infuraGetAccountBalance(address: string, chainId: string): Promise<AssetData> {
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": [address, "latest"],
        "id": 1
    };
    //FIXME this should be removed when support for polygon mainnet is ready
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

export const getERC20TransferData = async (fromAddress: string, toAddress: string, sendAmount: number, token: string, chainId: string) => {
    const currency = getCurrency(chainId, token);

    /**
     * let contract = new Web3js.eth.Contract(contractABI, tokenAddress, { from: fromAddress })

     let amount = Web3js.utils.toHex(Web3js.utils.toWei("1")); //1 DEMO Token

     let data = contract.methods.transfer(toAddress, amount).encodeABI()
     */

    let minABI: AbiItem[] = [
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "type": "function"
        }
    ];
    const contract = new web3.eth.Contract(minABI, currency?.contractAddress, {from: fromAddress});
    console.debug(`got contract instance ${contract}`)
    const _value = toWad(sendAmount.toString(), currency?.decimals);
    console.info(`send amount ${sendAmount} toWad -> ${_value} for ${token} with decimals: ${currency?.decimals}`)

    const balanceAbi = await contract.methods.transfer(toAddress, _value).encodeABI();
    console.warn(`transfer encoded abi call ${balanceAbi}`)
    return balanceAbi;
}

export async function infuraGetCustomTokenAccountBalance(address: string, token: string, chainId: string): Promise<AssetData> {
    const currency = getCurrency(chainId, token);

    if (!currency) {
        throw new Error(`currency not supported: ${token} on chain: ${chainId}`);
    }

    let minABI: AbiItem[] = [
        {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
        {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
        {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}
    ];
    const contract = new web3.eth.Contract(minABI, currency?.contractAddress);
    const balance = await contract.methods.balanceOf(address).call()
    await balance
    console.debug(`balance for custom token ${balance}`)

    const assetData = {
        symbol: currency?.token,
        name: currency?.token,
        decimals: currency?.decimals,
        contractAddress: currency?.contractAddress,
        balance: balance
    }
    console.debug(`asset data ${assetData}`)
    return assetData;
}

async function infuraGetEthAccountBalance(data: any): Promise<AssetData> {
    const response = await ethInstance.post(
        "",
        data
    );
    const {result} = response.data;
    //FIXME this constants should go to the currency stuff
    const assetData = {
        symbol: "ETH",
        name: "Ether",
        decimals: 18,
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
    //FIXME this constants should go to the currency stuff
    const assetData = {
        symbol: "MATIC",
        name: "Matic",
        decimals: 18,
        contractAddress: "",
        balance: result
    }
    return assetData;
}

/**
 * Subscribe to pend trxs.
 * SEE https://docs.infura.io/infura/tutorials/ethereum/subscribe-to-pending-transactions#4.-subscribe-to-pending-transactions
 */

export const getPendingTransactions = async (address: string, chainId: string): Promise<TxDetails[]> => {
    ///"eth_subscribe", "params": ["newPendingTransactions"]}'
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_subscribe",
        "params": ["newPendingTransactions"],
        "id": 1
    };
    const response = await ethInstance.post(
        "",
        data
    );
    const {result} = response.data;
    console.info(`got getPendingTransactions: ${result}`)
    return result;
}



/**

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


/**
 * {"jsonrpc":"2.0","id":1,"result":
 * {"accessList":[],"blockHash":null,"blockNumber":null,"chainId":"0x5","from":"0xa6fbde8dfae4526fd486bf6828657d8e904931c4",
 * "gas":"0x18af8","gasPrice":"0x34e62ce00","hash":"0x106376ce712aca5cc1287804395568456d8289bfd110f80e05af72b805637c60","input":"0x",
 * "maxFeePerGas":"0x34e62ce00","maxPriorityFeePerGas":"0x34e62ce00","nonce":"0x3","r":"0x84602d5118103dc3bebe9e8249f4a16f23b8b565a88f49f0515585e3e29a54c6",
 * "s":"0x7890c0073ce1337f2858446fdff9b030e0c4fed9caac568afd426cceab6cbbc0",
 * "to":"0xc41fac9a01c1ad46dcb7c51af63c653fbd9decf5","transactionIndex":null,"type":"0x2","v":"0x1","value":"0x10f10d0ddb6ff"}}
 * @param hash
 * @param chainId
 */
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
        "method": "eth_getTransactionCount",
        "params": [address, "latest"],
        "id": 1
    };
    const response = await ethInstance.post(
        "",
        data
    );
    const {result} = response.data;
    console.warn(`got nonce: ${result}`)
    return result;
};

const infuraGetGasPrices = async (chainId: string): Promise<string> => {
    const data = {
        "jsonrpc": "2.0",
        "method": "eth_gasPrice",
        "params": [],
        "id": 1
    };
    const response = await ethInstance.post('', data);
    const {result} = response.data;
    console.debug(`infura got gas price for chainId ${chainId} response ${result}`);
    return result;
};

export class InfuraApi implements RpcApi {
    // getAccountBalance(address: string, chainId: string): Promise<AssetData> {
    //     return infuraGetAccountBalance(address, chainId);
    // }

    getAccountBalance(address: string, chainId: string): Promise<AssetData[]> {
        return infuraGetAccountBalances(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        return infuraGetAccountNonce(address, chainId);
    }

    //https://eth.wiki/json-rpc/API
    //curl 'https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09' -X POST -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0' -H 'Accept: application/json' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Origin: http://localhost:3000' -H 'Connection: keep-alive' -H 'Referer: http://localhost:3000/' -H 'Sec-Fetch-Dest: empty' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-GPC: 1' -H 'TE: trailers' --data-raw '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x778dAac766b448cf0Ea7D9ac9422fC7c0D2e12f2","latest"],"id":1 }'
    getGasPrices(chainId: string): Promise<string> {
        return infuraGetGasPrices(chainId);
    }

    getTransactionByHash(hash: string, chainId: string): Promise<TxDetails> {
        return infuraGetTransactionByHash(hash, chainId);
    }

    getAccountTransactions(address: string, chainId: string): Promise<ParsedTx[]> {
        return Promise.resolve([]);
    }

    getAccountPendingTransactions(address: string, chainId: string): Promise<TxDetails[]> {
        return getPendingTransactions(address, chainId);
    }

}
