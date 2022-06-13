import {ITicker} from "../models";

function findTicker(currencySymbol: string, tickers: ITicker[]) {
    let ethTicker = null;
    try {
        ethTicker = tickers ? tickers.find(value => value.currency === currencySymbol) : null;
    } catch (e) {
        console.info(`error searching for ticker ${currencySymbol}: ${e}`)
    }
    return ethTicker;
}

export const convertTokenToUSD = (value: number, tokenSymbol: string, tickers: ITicker[]): number | null => {
    let ethTicker = findTicker(tokenSymbol, tickers);
    let balanceUsd: number | null;
    if (ethTicker) {
        balanceUsd = value * ethTicker.price;
        console.info(`${value} ${tokenSymbol} = ${balanceUsd} USD -  Price 1 ${tokenSymbol} = ${ethTicker?.price} USD`)
    } else {
        console.info(`tickers are not available`)
        balanceUsd = null;
    }
    return balanceUsd;
};

export const convertUSDtoToken = (value: number, token: string, tickers: ITicker[]): number | null => {
    let ethTicker = findTicker(token, tickers);
    let balanceUsd: number | null;
    if (ethTicker) {
        balanceUsd = value / ethTicker.price;
        console.info(`${value} ${token} = ${balanceUsd} USD - Price 1 ${token} = ${ethTicker?.price} USD`)
    } else {
        console.info(`ticker are not available for ETH`)
        balanceUsd = null;
    }
    return balanceUsd;
};
