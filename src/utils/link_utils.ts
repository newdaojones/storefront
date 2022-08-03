import {storefrontPayBaseUrl} from "../StorefrontPaySdk";

export const transactionStatusLink = (transactionHash: string, orderTrackingId: string) : string => {
  const link = `${storefrontPayBaseUrl}/storefront/status?transactionId=${transactionHash}&orderTrackingId=${orderTrackingId}`;
  return link;
}
