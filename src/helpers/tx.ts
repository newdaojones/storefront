import * as encoding from "@walletconnect/encoding";
import {BigNumber, utils} from "ethers";

import {fromWad, toWad} from "./utilities";
import {AccountBalances} from "./types";
import {web3} from "../utils/walletConnect";
import {RpcApi, RpcSourceAdapter} from "../rpc/rpc-api";
import {
    ETH_DECIMALS,
    getCurrency,
    isUSDStableToken,
    PAY_WITH_USDC_ENABLED,
    USDC_DECIMALS,
    USDC_TOKEN
} from "../config/currencyConfig";
import {getERC20TransferData} from "../rpc/infura-api";

export const DEFAULT_GAS_LIMIT = 21000;
export const currentRpcApi: RpcApi = new RpcSourceAdapter();

export async function getGasPrice(chainId: string): Promise<string> {
    return await currentRpcApi.getGasPrices(chainId)
}

export function debugTransaction(trx: ITransaction) {
    return `transaction from: ${trx.from} to: ${trx.to} value: ${trx.value} nonce: ${trx.nonce} data: ${trx.data}  gasLimit: ${trx.gasLimit} `;
}


function debugTransactionEncodingDecoding(_value: any, value: string) {
    //TODO this is only debug code
    const bigN = BigNumber.from(_value.toString())
    const formatted = utils.formatUnits(bigN, "ether")
    console.info(`transaction value: ${_value} number bigN: ${bigN} formatted: ${formatted} - hex: ${value}`)
    const val1 = web3.utils.hexToNumber(value);
    const val2 = web3.utils.toDecimal(value);
    const val3 = encoding.hexToNumber(value);
    console.debug(`TRANS decoded value 1:${val1} 2:${val2} 3:${val3}`)
}

/**
 * See transaction https://explorer.anyblock.tools/ethereum/ethereum/kovan/tx/0x346fd04ddb4a0727e1a7d6ee68c752261eb8ee3c2a5b6f579f7bfcbcbd0ee034/
 * by hash
 *
 * transaction value: 123500000000000 WEI formatted: 0.0001235 ETH produces problems when converting to hex
 * make tests for it. The hex below doesn't contain the full value but only a small part
 * transaction value: 123500000000000 number bigN: 123500000000000 formatted: 0.0001235 - hex: 95a13800 sanitized: 0x95a13800 tx.ts:64
 * transaction value hex2: 0x705295a13800 hex3: 0x705295a13800 sanitized: 0x705295a13800
 * TRANS decoded value:2510370816000000000000000000 WEI decimal:2510370816 decoded:2510370816 ETH - f: 0.000000002510370816
 *
 * FIXME it seems that including small numbers as hex into the data value works, but not with big numbers, such as a large screen encoded to hex
 *
 *
 * @param account
 * @param toAddress
 * @param sendAmount
 * @param orderTrackingId
 */
async function encodeNativeTransaction(account: string, toAddress: string, sendAmount: number, orderTrackingId: string, decimals: number = 18): Promise<ITransaction> {
    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;

    let _nonce;
    try {
        _nonce = await currentRpcApi.getAccountNonce(address, chainId);
        console.info(`nonce: ${_nonce}`);
    } catch (error) {
        throw new Error(`failed to fetch nonce for address ${address} on chain ${chainId}`);
    }

    const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

    const _gasPrice = await getGasPrice(chainId);
    const gasNumber = Number(_gasPrice);//something like 14200000000 WEI
    const gasPrice = _gasPrice;
    console.info(`gasPrice-> hex:${_gasPrice} number: ${gasNumber} encodedGasPrice: ${gasPrice}`);


    // FIXME this should also be a param
    const _gasLimit = DEFAULT_GAS_LIMIT;
    const gasLimit = encodeNumberAsHex(_gasLimit)
    console.info(`gasLimit-> number: ${_gasLimit} encodedGasLimit: ${gasLimit}`);

    const _value = toWad(sendAmount.toString(), decimals);
    console.info(`send amount ${sendAmount} toWad -> ${_value} `)
    // const _value = 123500000000000; //transaction value: 123500000000000 WEI formatted: 0.0001235 ETH

    const value = encoding.sanitizeHex(_value.toHexString());
    //debugTransactionEncodingDecoding(_value, value);

    const to = encoding.sanitizeHex(toAddress);

    // TODO add transaction id here, maybe a hash function of the qrcode & timestamp could be good
    // const orderIdEncoded = encoding.utf8ToHex(orderTrackingId);
    // const data = encoding.sanitizeHex(orderIdEncoded);
    // console.info(`encoding orderId: ${orderTrackingId} -> ${orderIdEncoded}`)

    const data = '0x'

    return {
        from: address,
        to: to,
        data: data,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value
    };
}


/**
 * Encode an ERC20 transaction
 *
 * example amount in ETH
 *
 * @param account
 * @param toAddress
 * @param sendAmount
 * @param token
 * @param orderTrackingId
 */
async function encodeERC20Transaction(account: string, toAddress: string, sendAmount: number,
                                             token: string, orderTrackingId: string): Promise<ITransaction> {
    console.warn(`encoding ERC20 trx for ${sendAmount} ${token}`);
    const [namespace, reference] = account.split(":");
    const chainId = `${namespace}:${reference}`;
    const currency = getCurrency(chainId, token);

    const tx = await encodeNativeTransaction(account, toAddress, sendAmount, orderTrackingId, currency?.decimals);
    console.warn(`got native trx result: ${debugTransaction(tx)}}`);

    console.info(`toAddress: ${toAddress} to: ${tx.to}}`);
    const data = await getERC20TransferData(tx.from, tx.to, sendAmount, token, chainId)
    console.warn(`got erc20 trx data: ${data}`);

    if (!currency?.contractAddress) {
        throw new Error("contract address not defined");
    }

    const contractTransactionGasLimit = DEFAULT_GAS_LIMIT * 3.5;
    const gasLimit = encodeNumberAsHex(contractTransactionGasLimit)
    console.info(`gasLimit-> number: ${contractTransactionGasLimit} encodedGasLimit: ${gasLimit}`);
    return {
        from: tx.from,
        to: currency?.contractAddress,
        data: data,
        nonce: tx.nonce,
        gasPrice: tx.gasPrice,
        gasLimit: gasLimit,
        value: '0x00'
    };

}

/**
 * Encode an ETHEREUM / MATIC native or ERC20 transaction
 *
 * example amount in ETH
 *
 * @param account
 * @param toAddress
 * @param sendAmount
 * @param token
 * @param orderTrackingId
 */
export async function encodeTransaction(account: string, toAddress: string, sendAmount: number,
                                        token: string, orderTrackingId: string): Promise<ITransaction> {
    try {
        if (isUSDStableToken(token)) {
            return encodeERC20Transaction(account, toAddress, sendAmount, token, orderTrackingId);
        } else {
            return encodeNativeTransaction(account, toAddress, sendAmount, orderTrackingId);
        }
    } catch (e: any) {
        console.warn(`encodeTrx: ${e?.message}`);
        throw e;
    }
}


export const encodeNumberAsHex = (value: number): string => {
    const hex3 = web3.utils.numberToHex(value);
    return encoding.sanitizeHex(hex3);
}

export const getHexValueAsBigNumberUsingNumber = (value: string): string => {
    const decoded = web3.utils.hexToNumber(value);
    return utils.formatUnits(decoded, "ether")
}

export const getHexValueAsBigNumber = (value: string): BigNumber => {
    return BigNumber.from(value);
}
export const getHexValueAsString = (value: string): string => {
    //const decoded = web3.utils.big(value);
    const bigNumber = BigNumber.from(value);
    return utils.formatUnits(bigNumber, "ether")
}

export const getWeiToString = (value: string): string => {
    return utils.formatUnits(value, "ether")
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
    decimals: number;
    balanceUsd: number;
    balanceString: string;
    token: string;
}


/**
 *
 * @param accounts
 * @param balances
 *
 * @return the first account with USDC tokens, or first found account with non-zero balance for any token
 */
export function getPreferredAccountBalance(accounts: string[], balances: AccountBalances): AccountBalance {
    if (!balances) {
        console.error("undefined or null balances");
        throw Error("undefined AccountBalances");
    }

    if (PAY_WITH_USDC_ENABLED) {
        const accountWithUSDC = getAccountWithNonZeroUSDCBalance(accounts, balances);
        if (accountWithUSDC) {
            console.info(`Found USDC account using that ${accountWithUSDC.balance} ${accountWithUSDC.token}`)
            return accountWithUSDC;
        }
    }

    return getNonZeroAccountBalance(accounts, balances);
}

/**
 *  @returns the first account in the list with non-zero balance of any token
 *
 */
function getNonZeroAccountBalance(accounts: string[], balances: AccountBalances): AccountBalance {
    if (!accounts || accounts.length === 0) {
        throw new Error('no accounts')
    }
    let balanceString = "0.00";
    let firstNonZeroAccount = accounts[0];
    let accountBalance = BigNumber.from(0);
    let accountBalanceUSD = BigNumber.from(0);
    let balanceToken: string | null = null;
    accounts.forEach(value => {
        let accountBalances = balances[value];
        if (!accountBalances) {
            console.warn(`getBalanceInUSD: account balances not defined for account: ${value}`)
            //FIXME an error here would prevent other accounts from being added
            return;
        }
        let balanceElement = accountBalances[0];
        let balance = BigNumber.from(0);
        try {
            balance = BigNumber.from(balanceElement.balance || "0");
        } catch (e) {
            console.log(`balance parse error ${e}`);
        }

        if (balance.gt(0) || balanceToken == null) {
            let formatEther = utils.formatEther(balance);
            console.debug(`getBalanceInUSD account ${value} with balance ${balance}. formatted balance ${formatEther}`)

            firstNonZeroAccount = value;
            accountBalance = utils.parseUnits(balance.toString(), "ether")
            accountBalanceUSD = accountBalance;
            balanceString = formatEther;
            balanceToken = balanceElement.symbol;
        }
    })
    if (!balanceToken) {
        const accountBalances = balances[firstNonZeroAccount];
        const balanceString = accountBalances.map(value => `${value.symbol} ${value.balance}`).join(",");
        throw new Error(`unsupported token accounts: ${accounts[0]} balances: ${balanceString}`);
    }

    return {
        token: balanceToken,
        account: firstNonZeroAccount,
        balance: accountBalance,
        decimals: ETH_DECIMALS,//FIXME what if it is matic?
        balanceUsd: 0,
        balanceString: balanceString,
    }
}


function getAccountWithNonZeroUSDCBalance(accounts: string[], balances: AccountBalances): AccountBalance | null {
    for (const account of accounts) {
        let accountBalances = balances[account];
        const usdcTokenAsset = accountBalances.find(value => value.symbol === USDC_TOKEN && Number(value.balance) > 0);
        if (usdcTokenAsset && usdcTokenAsset.balance) {

            const numValue = fromWad(usdcTokenAsset.balance, USDC_DECIMALS);
            console.info(`found USDC account ${account} balanceUSDC = ${numValue}
                    with tokens ${accountBalances.map(value => `${value.symbol} ${value.balance}`).join(",")}`);

            return {
                token: USDC_TOKEN,
                account: account,
                balance: BigNumber.from(usdcTokenAsset.balance),
                decimals: USDC_DECIMALS,
                //Error: invalid BigNumber string (argument="value", value="7.011643", code=INVALID_ARGUMENT, version=bignumber/5.5.0)
                balanceUsd: Number(numValue),
                balanceString: numValue.toString(),
            }
        }

    }
    return null;
}
