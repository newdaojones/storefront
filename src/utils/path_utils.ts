export interface IOrderParams {
  externalOrderId: string,
  amount: number,
  orderTrackingId: string,
  merchantAddress: string,
}

export interface ITransactionStatus extends IOrderParams {
  transactionId: string,
}

export const extractOrderFromUrl = (url: string, requireStatusItems: boolean = false) : IOrderParams => {
  if (!url) {
    throw new Error("input url must be not empty");
  }
  let queryString = url;
  if (url.includes('?')) {
    queryString = url.substring(url.lastIndexOf('?'))
  }
  const parsed = new URLSearchParams(queryString);
  console.log(`url: ${url} queryString: ${queryString} parsed: ${parsed}`);
  const amount = Number(parsed.get("amount"));
  const externalOrderId = parsed.get("orderId");
  const orderTrackingId = parsed.get("orderTrackingId");
  const merchantAddress = parsed.get("merchantAddress");
  console.log(`trackingId: ${orderTrackingId} orderId: ${externalOrderId} amount: ${amount}`);

  if (!requireStatusItems && (!externalOrderId|| !amount || !merchantAddress)) {
    throw new Error("orderId, merchantAddress and amount are required.");
  }

  return {
    externalOrderId: externalOrderId || "",
    amount: amount,
    orderTrackingId: orderTrackingId || "",
    merchantAddress: merchantAddress || "",
  }
}

export const extractTransactionIdFromUrl = (url: string) : ITransactionStatus => {
  if (!url) {
    throw new Error("input url must be not empty");
  }
  let queryString = url;
  if (url.includes('?')) {
    queryString = url.substring(url.lastIndexOf('?'))
  }
  const parsed = new URLSearchParams(queryString);
  console.log(`url: ${url} queryString: ${queryString} parsed: ${parsed}`);
  const transactionId = parsed.get("transactionId");
  const orderTrackingId = parsed.get("orderTrackingId");

  if (!transactionId || !orderTrackingId) {
    throw new Error("transaction id or orderTrackingId are missing");
  }

  const orderData = extractOrderFromUrl(url, true);
  return {
    externalOrderId: orderData.externalOrderId,
    merchantAddress: orderData.merchantAddress,
    amount: orderData.amount,
    transactionId: transactionId,
    orderTrackingId: orderTrackingId,
  }
}
