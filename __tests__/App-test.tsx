// import * as encoding from "@walletconnect/encoding";
// import {utf8ToNumber} from "@walletconnect/encoding";
import { BigNumber, utils } from "ethers";

test('verify transaction balances', async () => {
 const _value = 123500000000000;
 //transaction value: 123500000000000 WEI formatted: 0.0001235 ETH
 const bigN = BigNumber.from(_value.toString())
 const formatted = utils.formatUnits(bigN, "ether")
 //12340000000000 wei -> 0.0001234 ETH (18 decimals)

 // let hex = encoding.numberToHex(_value);
 // const value = encoding.sanitizeHex(hex);
 console.info(`transaction value: ${_value} WEI - formatted: ${formatted} ETH - hex: ${formatted} `)

 // const valueHexBack = encoding.hexToNumber(value)
 // const value2 = utf8ToNumber(value);
 // const valueHexBack = encoding.hexToNumber(value)
 // let weiNumber = BigNumber.from(value);
 // const rformatted = utils.formatUnits(valueHexBack, "ether")
 // console.info(`TRANSACTION value: ${valueHexBack} WEI - ${value2}  ${weiNumber} ETH - f: ${rformatted} `)


});

it('renders correctly', () => {
 console.info(`bla bla`)
});
