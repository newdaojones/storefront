//TODO maybe this should be fixed
// This chain data is used in the menu, and account modal to show info about selected chains.
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
  // bip122: {
  //   '000000000019d6689c085ae165831e93': {
  //     id: 'bip122:000000000019d6689c085ae165831e93',
  //     name: 'Bitcoin Mainnet',
  //     rpc: ['https://bsc-dataseed.binance.org'],
  //     slip44: 60,
  //     testnet: false,
  //     logo: '/btc.png',
  //     rgb: '243, 186, 44',
  //     symbol: 'BTC',
  //   },
  // },
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
    '42': {
      name: 'Ethereum Kovan',
      id: 'eip155:42',
      rpc: ['https://kovan.infura.io/v3/f785cca3f0854d5a9b04078a6e380b09'],
      slip44: 60,
      testnet: true,
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
