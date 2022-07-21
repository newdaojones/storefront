import {AssetData} from "../helpers/types";
import {apiGetAccountBalance, apiGetAccountNonce, apiGetGasPrices} from "./api";
import {infuraGetAccountBalance, infuraGetAccountNonce, infuraGetGasPrices} from "./infura-api";
import {toWad} from "../helpers";

export interface RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData>;
    getAccountNonce(address: string, chainId: string): Promise<number>;
    getGasPrices(chainId: string): Promise<string>;
}

export class InfuraApi implements RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData> {
        return infuraGetAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        return infuraGetAccountNonce(address, chainId);
    }

    //https://eth.wiki/json-rpc/API
    //curl 'https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09' -X POST -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0' -H 'Accept: application/json' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Origin: http://localhost:3000' -H 'Connection: keep-alive' -H 'Referer: http://localhost:3000/' -H 'Sec-Fetch-Dest: empty' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-GPC: 1' -H 'TE: trailers' --data-raw '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x778dAac766b448cf0Ea7D9ac9422fC7c0D2e12f2","latest"],"id":1 }'
    getGasPrices(chainId: string): Promise<string> {
        return infuraGetGasPrices(chainId);
    }

}

export class EthereumXyzApi implements RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData> {
        return apiGetAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        return apiGetAccountNonce(address, chainId);
    }

    async getGasPrices(chainId: string): Promise<string> {
        const gasPrices = await apiGetGasPrices(chainId);
        console.info(`got gas prices ${gasPrices}`);
        return toWad(`${gasPrices.slow.price}`, 9).toHexString();
    }
}

export class RpcSourceAdapter implements RpcApi {
    infuraRpcApi: RpcApi = new InfuraApi();
    ethereumXyzRpcApi = new EthereumXyzApi();

    getAccountBalance(address: string, chainId: string): Promise<AssetData> {
        if (chainId.includes('eip155:80001')) {
            //EthereumXYZ does not support polygon! ()
            return this.infuraRpcApi.getAccountBalance(address, chainId);
        }
        return this.ethereumXyzRpcApi.getAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        // if (chainId.includes('eip155:42')) {
        //     return this.infuraRpcApi.getAccountNonce(address, chainId);
        // }
        return this.ethereumXyzRpcApi.getAccountNonce(address, chainId);
    }

    async getGasPrices(chainId: string): Promise<string> {
        // if (chainId.includes('eip155:42')) {
        //     let gasPrices = this.infuraRpcApi.getGasPrices(chainId);
        //     return gasPrices;
        // }
        return this.ethereumXyzRpcApi.getGasPrices(chainId);
    }

}
