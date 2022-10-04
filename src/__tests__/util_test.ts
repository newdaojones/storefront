import {isNumeric} from "../utils";

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
