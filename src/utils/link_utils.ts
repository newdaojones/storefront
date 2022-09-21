import {storefrontPayBaseUrl} from "../StorefrontPaySdk";

export const transactionStatusLink = (transactionHash: string, orderTrackingId: string) : string => {
  return `${storefrontPayBaseUrl}/storefront/status?transactionId=${transactionHash}&orderTrackingId=${orderTrackingId}`;
}

/**
 * @param orderTrackingId
 */
export const payLink = (orderTrackingId: string) : string => {
  return `${storefrontPayBaseUrl}/storefront/pay?orderTrackingId=${orderTrackingId}`;
}
