import {ITicker} from "../models";

function findETHTicker(tickers: ITicker[]) {
    let ethTicker = null;
    try {
        ethTicker = tickers ? tickers.find(value => value.currency === 'ETH') : null;
    } catch (e) {
        console.info(`error searching for ticker ETH: ${e}`)
    }
    return ethTicker;
}

export const convertETHtoUSD = (value: number, tickers: ITicker[]): number | null => {
    let ethTicker = findETHTicker(tickers);
    let balanceUsd: number | null;
    if (ethTicker) {
        balanceUsd = value * ethTicker.price;
        console.debug(`${value} ETH -> ${balanceUsd} USD. price eth: ${ethTicker?.price}`)
    } else {
        console.info(`tickers are not available`)
        balanceUsd = null;
    }
    return balanceUsd;
};

export const convertUSDtoETH = (value: number, tickers: ITicker[]): number | null => {
    let ethTicker = findETHTicker(tickers);
    let balanceUsd: number | null;
    if (ethTicker) {
        balanceUsd = value / ethTicker.price;
        console.debug(`${value} USD -> ${balanceUsd} ETH. price eth: ${ethTicker?.price}`)
    } else {
        console.info(`ticker are not available for ETH`)
        balanceUsd = null;
    }
    return balanceUsd;
};
