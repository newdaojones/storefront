export interface IOrder {
  orderId: string,
  amount: number,
}

export interface ITransactionStatus extends IOrder {
  transactionId: string,
}

export const extractOrderFromUrl = (url: string) : IOrder => {
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
  const orderId = parsed.get("orderId");
  console.log(`orderId: ${orderId} amount: ${amount}`);

  if (!orderId || !amount) {
    throw new Error("orderId or amount missing");
  }

  return {
    orderId: orderId,
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
    orderId: orderData.orderId,
    transactionId: transactionId
  }
}
