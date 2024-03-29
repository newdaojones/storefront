import {formatDate, getCurrentMonthDateRange, isNumeric} from "../utils";
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


test('verify date range', async () => {
  const dateRange = getCurrentMonthDateRange();
  console.log(`My date and time is = [${dateRange.startDate}, ${dateRange.endDate}]`);
  expect(dateRange.startDate).toEqual("2023-02-01T00:00:00.000Z")
  expect(dateRange.endDate).toEqual("2023-02-28T23:59:59.999Z")

});

test('verify date format', async () => {
  const date = new Date()
  const result = formatDate(date);
  console.log(`result ${result}`); //  👉️ "2022-03-07 16:10:22"
  expect(result).toEqual("February 1 2023")

});


