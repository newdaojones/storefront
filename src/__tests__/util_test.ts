import {isNumeric} from "../utils";
import {fromWad} from "../helpers";
import {USDC_DECIMALS} from "../config/currencyConfig";
import {BigNumber, utils} from "ethers";

test('verify isNumber', async () => {
  expect(isNumeric(".01")).toBeTruthy();
  expect(isNumeric("0.01")).toBeTruthy();

  expect(isNumeric("001")).toBeTruthy(); //really?

  expect(isNumeric("a001")).toBeFalsy();
  expect(isNumeric("#a001")).toBeFalsy();
  expect(isNumeric("#{a001")).toBeFalsy();
});

test('verify notmalized Decimal', async () => {
  let amount = ".01";
  expect(isNumeric(amount)).toBeTruthy();
  const amountNumber = Number(amount)
  const fixedNumber = amountNumber.toFixed(2) //need to avoid '.01' entry which will be considered 0 in backend
  console.info(`amount parsed: ${fixedNumber}`)

});

test('verify transaction filters', async () => {
  const filtered = [];
  console.info(`TEST STAR`)
  expect(filtered.length).toBeGreaterThan(0)
});


test('verify bignumber for usdc', async () => {
  console.info(`TEST STAR`)

  const numValue = fromWad("7.011643", USDC_DECIMALS);
  console.info(`found USDC balanceUSDC = ${numValue}`);
  const balance = BigNumber.from(numValue || 0);
  expect(balance).toBeGreaterThan(0)
});


test('verify date to local timezone', async () => {
  const myDate: Date = new Date("2018-02-08T10:30:35Z");
  console.log('My date and time is = ' + myDate);
});
