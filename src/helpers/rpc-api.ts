import {AssetData, GasPrices} from "./types";
import {apiGetAccountBalance, apiGetAccountNonce, apiGetGasPrices} from "./api";
import {infuraGetAccountBalance, infuraGetAccountNonce, infuraGetGasPrices} from "./infura-api";

export interface RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData>;
    getAccountNonce(address: string, chainId: string): Promise<number>;
    getGasPrices(chainId: string): Promise<GasPrices>;
}

export class InfuraApi implements RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData> {
        return infuraGetAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        return infuraGetAccountNonce(address, chainId);
    }

    getGasPrices(chainId: string): Promise<GasPrices> {
        return infuraGetGasPrices();
    }

}

export class EthereumXyzApi implements RpcApi {
    getAccountBalance(address: string, chainId: string): Promise<AssetData> {
        return apiGetAccountBalance(address, chainId);
    }

    getAccountNonce(address: string, chainId: string): Promise<number> {
        return apiGetAccountNonce(address, chainId);
    }

    getGasPrices(chainId: string): Promise<GasPrices> {
        return apiGetGasPrices(chainId);
    }

}
