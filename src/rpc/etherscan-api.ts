import axios, {AxiosInstance, AxiosResponse} from "axios";
import {isBlockchainTestnetMode} from "../config/appconfig";

export interface EtherscanTx {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: number;
    blockHash: string;
    transactionIndex: number;
    from: string;
    to:string;
    value:string;
    gas:number;
    gasPrice:number;
    isError:number;
    txreceipt_status:number;
    input:string;
    contractAddress:string;
    cumulativeGasUsed:number;
    gasUsed:number;
    confirmations:number;
    methodId:string;
    functionName:string;
}

const baseUrl = isBlockchainTestnetMode() ? 'https://api-goerli.etherscan.io/api?module=account&apikey=X8RUJY6VJ5YKXCQG9PV3ZWQW4KYUYY7BCJ' : 'https://api.etherscan.io/api?module=account&apikey=X8RUJY6VJ5YKXCQG9PV3ZWQW4KYUYY7BCJ';

const axiosApi: AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // 30 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});



/*
    https://docs.etherscan.io/api-endpoints/accounts
https://api.etherscan.io/api
   ?module=account
   &action=txlist
   &address=0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC
   &startblock=0
   &endblock=99999999
   &page=1
   &offset=10
   &sort=asc
   &apikey=YourApiKeyToken
 */
export async function etherscanGetAccountTransactions(
    address: string,
    chainId: string,
): Promise<EtherscanTx[]> {
    const ethChainId = chainId.split(":")[1];
    const response = await axiosApi.get(
        `&address=${address}&action=txlist&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`,
    );
    const { result } = response.data;
    console.warn(`etherscan got result: ${result} items: ${result.length} trx from etherscan. first: ${result[0].hash}`);
    //return response;
    return result;
}
