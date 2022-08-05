import {storefrontPayBaseUrl} from "../StorefrontPaySdk";

export const transactionStatusLink = (transactionHash: string, orderTrackingId: string) : string => {
  const link = `${storefrontPayBaseUrl}/storefront/status?transactionId=${transactionHash}&orderTrackingId=${orderTrackingId}`;
  return link;
}

/**
 * orderId=1&amount=0.25&merchantAddress=0x1151B4Fd37d26B9c0B59DbcD7D637B46549AB004
 * @param amount
 * @param orderId
 */
export const payLink = (amount: number, orderId: string, merchantAddress: string) : string => {
  const link = `${storefrontPayBaseUrl}/storefront/pay?orderId=${orderId}&amount=${amount}&merchantAddress=${merchantAddress}`;
  return link;
}
