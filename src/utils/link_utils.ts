import { storefrontPayBaseUrl } from "../StorefrontPaySdk";
import { isBlockchainTestnetMode } from "../config/appconfig";

export const transactionStatusLink = (transactionHash: string, orderTrackingId: string): string => {
  return `${storefrontPayBaseUrl}/status?transactionId=${transactionHash}&orderTrackingId=${orderTrackingId}`;
}

/**
 * @param orderTrackingId
 */
export const payLink = (orderTrackingId: string): string => {
  return `${storefrontPayBaseUrl}/pay?orderTrackingId=${orderTrackingId}`;
}



/**
 * @param orderTrackingId
 */
export const orderPaymentLink = (orderTrackingId: string): string => {
  return `${storefrontPayBaseUrl}/home?orderTrackingId=${orderTrackingId}`;
}


export const transactionBlockExplorerLink = (network: string, transactionHash: string): string => {
  const isTest = isBlockchainTestnetMode()

  if (network === 'avalanche') {
    if (isTest) {
      return `https://testnet.snowtrace.io/tx/${transactionHash}`
    }
    return `https://snowtrace.io/token/tx/${transactionHash}`

  }

  if (network === 'ethereum') {
    if (isTest) {
      return `https://goerli.etherscan.io/tx/${transactionHash}`;
    }
    return `https://etherscan.io/tx/${transactionHash}`
  }

  throw new Error(`unsupported explorer for chain ${network}`)
}
