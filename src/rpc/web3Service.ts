import { avalancheWeb3, ethereumWeb3 } from "../utils/walletConnect";

class Web3Service {
  async getTransactionReceipt(hash: string) {
    try {
      const avalancheReceipt = await avalancheWeb3.eth.getTransactionReceipt(hash);

      if (avalancheReceipt) {
        return {
          network: 'avalanche',
          receipt: avalancheReceipt
        }
      }

      const ethereumReceipt = await ethereumWeb3.eth.getTransactionReceipt(hash);

      if (ethereumReceipt) {
        return {
          network: 'ethereum',
          receipt: ethereumReceipt
        }
      }

      return null
    } catch (err) {
      console.log('receipt error')

      return null
    }
  }
}

export const web3Service = new Web3Service()