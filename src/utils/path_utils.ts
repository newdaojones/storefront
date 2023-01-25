export interface IOrderParams {
  orderTrackingId: string | null,
}

export interface ExternalPayUrlParams {
  trackingId: string | null,
  // subtotal: number,
  // feePercentage: number,
}

export interface ITransactionStatus extends IOrderParams {
  transactionId: string,
  externalOrderId: string,
  merchantAddress: string,
  amount: number,
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
  const orderTrackingId = parsed.get("orderTrackingId");
  console.log(`trackingId: ${orderTrackingId}`);
  if (!orderTrackingId) {
    throw new Error("orderTrackingId is required.");
  }
  return {
    orderTrackingId: orderTrackingId,
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

  //const orderData = extractOrderFromUrl(url, true);
  const amount = Number(parsed.get("amount"));
  const externalOrderId = parsed.get("orderId");
  const merchantAddress = parsed.get("merchantAddress");

  return {
    merchantAddress: merchantAddress || "",
    externalOrderId: externalOrderId || "",
    amount: amount,
    transactionId: transactionId,
    orderTrackingId: orderTrackingId,
  }
}
