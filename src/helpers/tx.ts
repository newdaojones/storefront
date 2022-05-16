import * as encoding from "@walletconnect/encoding";
import {BigNumber, utils} from "ethers";

import {apiGetAccountNonce, apiGetGasPrices} from "./api";
import {toWad} from "./utilities";
import {AccountBalances} from "./types";
import {web3} from "../utils/walletConnect";
import {infuraGetAccountNonce} from "./infura-api";

export async function getGasPrice(chainId: string): Promise<string> {
    if (chainId === "eip155:1") return toWad("20", 9).toHexString();
    const gasPrices = await apiGetGasPrices();
    return toWad(`${gasPrices.slow.price}`, 9).toHexString();
}


/**
 * See transaction https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/0x346fd04ddb4a0727e1a7d6ee68c752261eb8ee3c2a5b6f579f7bfcbcbd0ee034/
 * by hash
 *
 * FIXME
 * transaction value: 123500000000000 WEI formatted: 0.0001235 ETH produces problems when converting to hex
 * make tests for it. The hex below doesn't contain the full value but only a small part
 * transaction value: 123500000000000 number bigN: 123500000000000 formatted: 0.0001235 - hex: 95a13800 sanitized: 0x95a13800 tx.ts:64
 * transaction value hex2: 0x705295a13800 hex3: 0x705295a13800 sanitized: 0x705295a13800
 * TRANS decodvalue:2510370816000000000000000000 WEI decimal:2510370816 decoded:2510370816 ETH - f: 0.000000002510370816
 *
 *
 * @param account
 */
export async function formatTestTransaction(account: string, sendAmount: number): Promise<ITransaction> {
    const toAddress = '0x96fca7a522A4Ff7AA96B62a155914a831fe2aC05';

    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    let _nonce;
    try {
        _nonce = await infuraGetAccountNonce(address, chainId);
        //_nonce = await apiGetAccountNonce(address, chainId);
    } catch (error) {
        throw new Error(`failed to fetch nonce for address ${address} on chain ${chainId}`);
    }

    const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

    const _gasPrice = await getGasPrice(chainId);
    const gasPrice = encodeNumberAsHex(Number(_gasPrice));

    // FIXME this should also be a param
    //  gasLimit
    const _gasLimit = 21000;
    const gasLimit = encodeNumberAsHex(_gasLimit)


    const _value = toWad(sendAmount.toString());
    console.info(`send amount ${sendAmount} toWat -> ${_value} `)
    // const _value = 123500000000000; //transaction value: 123500000000000 WEI formatted: 0.0001235 ETH

    const value = encoding.sanitizeHex(_value.toHexString());

    //TODO this is only debug code
    const bigN = BigNumber.from(_value.toString())
    const formatted = utils.formatUnits(bigN, "ether")
    console.info(`transaction value: ${_value} number bigN: ${bigN} formatted: ${formatted} - hex: ${value}`)
    const val1  = web3.utils.hexToNumber(value);
    const val2  = web3.utils.toDecimal(value);
    const val3 = encoding.hexToNumber(value);
    console.debug(`TRANS decoded value 1:${val1} 2:${val2} 3:${val3}`)

    const tx = { from: address, to: toAddress, data: "0x", nonce: nonce, gasPrice: gasPrice, gasLimit: gasLimit, value: value };
    return tx;
}

export const encodeNumberAsHex = (value: number): string => {
    const hex3 = web3.utils.numberToHex(value);
    const sanitized = encoding.sanitizeHex(hex3);
    return sanitized;
}

export const getHexValueAsBigNumber = (value: string): string => {
    const decoded = web3.utils.hexToNumber(value);
    return utils.formatUnits(decoded, "ether")
}

export const getWeiToString = (value: string): string => {
    const formatted = utils.formatUnits(value, "ether")
    return formatted
}


export interface ITransaction {
    from: string;
    to: string;
    data: string;
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    value: string;
}

export interface AccountBalance {
    account: string;
    balance: BigNumber;
    balanceUsd: BigNumber;
    balanceString: string;
}

export function getBalanceInUSD(accounts: string[], balances: AccountBalances): AccountBalance {
    let balanceString = "0.00";
    let firstNonZeroAccount = accounts[0];
    let accountBalance = BigNumber.from(0);
    let accountBalanceUSD = BigNumber.from(0);
    accounts.forEach(value => {
        let accountBalances = balances[value];
        if (!accountBalances) {
            console.info(`getBalanceInUSD: account balances not defined for account: ${value}`)
            return;
        }
        let balanceElement = accountBalances[0];
        const balance = BigNumber.from(balanceElement.balance || "0");
        if (balance.gt(0)) {
            let formatEther = utils.formatEther(balance);
            console.debug(`getBalanceInUSD account ${value} with balance ${balance}. formatted balance ${formatEther}`)

            firstNonZeroAccount = value;
            accountBalance = utils.parseUnits(balance.toString(), "ether")
            accountBalanceUSD = accountBalance;
            balanceString = formatEther;
        }
    })
    return {
        account: firstNonZeroAccount,
        balance: accountBalance,
        balanceUsd: accountBalanceUSD,
        balanceString: balanceString,
    }
}
