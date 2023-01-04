import {AssetData, ParsedTx, TxDetails} from "../helpers/types";
import {
    EthereumXyzApi
} from "./ethereumxyz-api";
import {InfuraApi} from "./infura-api";

export interface RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData[]>;

    getAccountNonce(address: string, chainId: string): Promise<number>;

    getGasPrices(chainId: string): Promise<string>;

    getAccountTransactions(address: string, chainId: string): Promise<ParsedTx[]>;

    getTransactionByHash(address: string, chainId: string): Promise<TxDetails>;

    getAccountPendingTransactions(address: string, chainId: string): Promise<TxDetails[]>;
}

export class RpcSourceAdapter implements RpcApi {
    infuraRpcApi: RpcApi = new InfuraApi();
    ethereumXyzRpcApi = new EthereumXyzApi();

    getAccountBalance(address: string, chainId: string): Promise<AssetData[]> {
        if (chainId.includes('eip155:80001')) {
            //EthereumXYZ does not support polygon! ()
            return this.infuraRpcApi.getAccountBalance(address, chainId);
        }
        return this.infuraRpcApi.getAccountBalance(address, chainId);
        //return this.ethereumXyzRpcApi.getAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        // return this.ethereumXyzRpcApi.getAccountNonce(address, chainId);
        return this.infuraRpcApi.getAccountNonce(address, chainId);
    }

    async getGasPrices(chainId: string): Promise<string> {
        //FIXME default api for prices
        // return this.infuraRpcApi.getGasPrices(chainId);
        return this.ethereumXyzRpcApi.getGasPrices(chainId);
    }

    getAccountTransactions(address: string, chainId: string): Promise<ParsedTx[]> {
        //TODO add infura support for this to break eth.xyz dep
        return this.ethereumXyzRpcApi.getAccountTransactions(address, chainId);
    }

    getTransactionByHash(hash: string, chainId: string): Promise<TxDetails> {
        return this.infuraRpcApi.getTransactionByHash(hash, chainId);
    }

    getAccountPendingTransactions(address: string, chainId: string): Promise<TxDetails[]> {
        return this.infuraRpcApi.getAccountPendingTransactions(address, chainId);
    }
}
