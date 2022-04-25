export const chainData: any = {
  bep20: {
    '1': {
      id: 'bep20:1',
      name: 'Smart Chain',
      rpc: ['https://bsc-dataseed.binance.org'],
      slip44: 60,
      testnet: false,
      logo: '/bnb.png',
      rgb: '243, 186, 44',
      symbol: 'BSC',
    },
  },
  solana: {
    '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ': {
      id: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
      name: 'Solana Mainnet',
      rpc: ['https://api.mainnet-beta.solana.com', 'https://solana-api.projectserum.com'],
      slip44: 501,
      testnet: false,
      logo: '/solana_logo.png',
      rgb: '0, 0, 0',
      symbol: 'SOL',
    },
  },
  eip155: {
    '1': {
      name: 'Ethereum Mainnet',
      id: 'eip155:1',
      rpc: ['https://api.mycryptoapi.com/eth'],
      slip44: 60,
      testnet: false,
      logo: 'https://blockchain-api.xyz/logos/eip155:1.png',
      rgb: '99, 125, 234',
      symbol: 'ETH',
    },
    '137': {
      name: 'Polygon Mainnet',
      id: 'eip155:137',
      rpc: ['https://rpc-mainnet.matic.network'],
      slip44: 60,
      testnet: false,
      logo: 'https://blockchain-api.xyz/logos/eip155:137.png',
      rgb: '130, 71, 229',
      symbol: 'MATIC',
    },
  },
};
