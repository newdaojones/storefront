export interface IOrder {
  orderId: string,
  amount: number,
}

export const extractOrderFromUrl = (url: string) : IOrder => {
  if (!url) {
    throw new Error("input url must be not empty");
  }

  const parsed = new URLSearchParams(url);
  console.log(`url: ${url} parsed: ${parsed}`);
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
