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


export const transactionBlockExplorerLink = (chainId: string, transactionHash: string) : string => {
  if (!chainId) {
    return `https://goerli.etherscan.io/tx/${transactionHash}`;
  }
  if (chainId.includes("eip155:5")) {
    return `https://goerli.etherscan.io/tx/${transactionHash}`
  } else if (chainId.includes("eip155:1")) {
    return `https://goerli.etherscan.io/tx/${transactionHash}`
  } else {
    throw new Error(`unsupported explorer for chain ${chainId}`)
  }

}
