import { http, createConfig } from '@wagmi/core';
import { defineChain } from 'viem';
import { TOKEN_CONTRACT_ADDRESS, ABSTRACT_CONTRACT_ADDRESS, LENS_CONTRACT_ADDRESS } from './constants';

export const abstract = defineChain({
  id: 11124,
  name: 'Abstract Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.abs.xyz'],
      webSocket: ['wss://api.testnet.abs.xyz/ws'],
    },
  },
})

export const lens = defineChain({
  id: 37111,
  name: 'Lens Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Grass',
    symbol: 'GRASS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.lens.xyz']
    },
  },
})


export const era = defineChain({
  id: 300,
  name: 'ZKsync Era Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.era.zksync.dev'],
      webSocket: ['wss://sepolia.era.zksync.dev/ws'],
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [era, abstract, lens],
  transports: {
    [era.id]: http(),
    [abstract.id]: http(),
    [lens.id]: http(),
  },
});

export function getChainInfo(chainId: number){
  return wagmiConfig.chains.find((c) => c.id === chainId);
}

export function getContractAddress(chainId: number){
  switch(chainId){
    case era.id:
    return TOKEN_CONTRACT_ADDRESS;
    break;
  case abstract.id:
    return ABSTRACT_CONTRACT_ADDRESS;
    break;
  case lens.id:
    return LENS_CONTRACT_ADDRESS;
    break;
  default:
    return null;
  }
}