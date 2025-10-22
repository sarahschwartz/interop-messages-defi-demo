import { InteropClient } from "zksync-ethers";

export const GATEWAY_RPC = "https://rpc.era-gateway-testnet.zksync.dev/";
export const GW_CHAIN_ID = BigInt("32657");
export const TOKEN_CONTRACT_ADDRESS =
  "0x772f68fb4b6aAbeAE0600A79965Df915054D27EC";
export const ABSTRACT_CONTRACT_ADDRESS =
  "0xeeaD0044812Cb4F4528fA69EF0aF7e154BeE507B";
export const SOPHON_CONTRACT_ADDRESS =
  "0xaCF11984a3463f643852d7aaDCBD7f86aD739e5D";

export const interopClient = new InteropClient({
  gateway: {
    env: "testnet",
    gwRpcUrl: GATEWAY_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});
