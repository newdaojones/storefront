import * as encoding from "@walletconnect/encoding";

import { apiGetAccountNonce, apiGetGasPrices } from "./api";
import { toWad } from "./utilities";

export async function getGasPrice(chainId: string): Promise<string> {
    if (chainId === "eip155:1") return toWad("20", 9).toHexString();
    const gasPrices = await apiGetGasPrices();
    return toWad(`${gasPrices.slow.price}`, 9).toHexString();
}


/**
 * See transaction https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/0x346fd04ddb4a0727e1a7d6ee68c752261eb8ee3c2a5b6f579f7bfcbcbd0ee034/
 * by hash
 *
 *
 * @param account
 */
export async function formatTestTransaction(account: string) {
    const toAddress = '0x96fca7a522A4Ff7AA96B62a155914a831fe2aC05';

    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    let _nonce;
    try {
        _nonce = await apiGetAccountNonce(address, chainId);
    } catch (error) {
        throw new Error(`Failed to fetch nonce for address ${address} on chain ${chainId}`);
    }

    const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

    // gasPrice
    const _gasPrice = await getGasPrice(chainId);
    const gasPrice = encoding.sanitizeHex(_gasPrice);

    // gasLimit
    const _gasLimit = 21000;
    const gasLimit = encoding.sanitizeHex(encoding.numberToHex(_gasLimit));

    // value
    const _value = 12340000;
    const value = encoding.sanitizeHex(encoding.numberToHex(_value));

    const tx = { from: address, to: toAddress, data: "0x", nonce, gasPrice, gasLimit, value };
    return tx;
}