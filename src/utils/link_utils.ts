import {storefrontPayBaseUrl} from "../StorefrontPaySdk";

export const transactionStatusLink = (transactionHash: string, orderTrackingId: string) : string => {
  return `${storefrontPayBaseUrl}/status?transactionId=${transactionHash}&orderTrackingId=${orderTrackingId}`;
}

/**
 * @param orderTrackingId
 */
export const payLink = (orderTrackingId: string) : string => {
  return `${storefrontPayBaseUrl}/pay?orderTrackingId=${orderTrackingId}`;
}



/**
 * @param orderTrackingId
 */
export const orderPaymentLink = (orderTrackingId: string) : string => {
  return `${storefrontPayBaseUrl}/home?orderTrackingId=${orderTrackingId}`;
}
