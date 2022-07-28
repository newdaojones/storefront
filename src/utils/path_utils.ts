export interface IOrderParams {
  externalOrderId: string,
  amount: number,
  orderTrackingId: string | null,
}

export interface ITransactionStatus extends IOrderParams {
  transactionId: string,
}

export const extractOrderFromUrl = (url: string) : IOrderParams => {
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
  console.log(`trackingId: ${orderTrackingId} orderId: ${externalOrderId} amount: ${amount}`);

  if (!externalOrderId|| !amount) {
    throw new Error("orderId or amount missing");
  }

  return {
    externalOrderId: externalOrderId,
    orderTrackingId: orderTrackingId || null,
    amount: amount,
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
  if (!transactionId) {
    throw new Error("transaction id missing");
  }

  const orderData = extractOrderFromUrl(url);
  return {
    amount: orderData.amount,
    orderTrackingId: orderData.orderTrackingId,
    externalOrderId: orderData.externalOrderId,
    transactionId: transactionId
  }
}
