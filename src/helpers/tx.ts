import * as encoding from "@walletconnect/encoding";
import { BigNumber, utils } from "ethers";

import { apiGetAccountNonce, apiGetGasPrices } from "./api";
import {convertHexToNumber, toWad} from "./utilities";
import {AccountBalances} from "./types";

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
export async function formatTestTransaction(account: string): Promise<ITransaction> {
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
    const _value = 123500000000000;
    const bigN = BigNumber.from(_value.toString())
    const formatted = utils.formatUnits(bigN, "ether")
    console.info(`transaction value: ${_value} WEI formatted: ${formatted} ETH`)
    //12340000000000 wei -> 0.0001234 ETH (18 decimals)

    const value = encoding.sanitizeHex(encoding.numberToHex(_value));

    const tx = { from: address, to: toAddress, data: "0x", nonce, gasPrice, gasLimit, value };
    return tx;
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
    console.info(`there are ${accounts.length} registered accounts`)
    let balanceString = "0.00";
    let firstNonZeroAccount = accounts[0];
    let accountBalance = BigNumber.from(0);
    let accountBalanceUSD = BigNumber.from(0);
    accounts.forEach(value => {
        let accountBalances = balances[value];
        if (!accountBalances) {
            console.error(`account balances not defined for account: ${value}`)
            return;
        }
        let balanceElement = accountBalances[0];
        const balance = BigNumber.from(balanceElement.balance || "0");
        console.info(`account: ${value} balance = ${balance}`)
        if (balance.gt(0)) {
            console.info(`selecting account ${value} with balance ${balance}`)
            firstNonZeroAccount = value;
            let formatEther = utils.formatEther(balance);
            console.log(`formatted balance ${formatEther}`);
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
