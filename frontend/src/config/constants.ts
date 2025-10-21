import { InteropClient } from "zksync-ethers";

export const GATEWAY_RPC = "https://rpc.era-gateway-testnet.zksync.dev/";
export const GW_CHAIN_ID = BigInt("32657");
export const TOKEN_CONTRACT_ADDRESS =
  "0x26CE6F67792C76c586e0e3E0b857f12D179B67B9";
export const ABSTRACT_CONTRACT_ADDRESS =
  "0xeeaD0044812Cb4F4528fA69EF0aF7e154BeE507B";
export const LENS_CONTRACT_ADDRESS =
  "0x2D1Be6b6C0AD5CC09840e9B4Be253af15b3C3440";

export const interopClient = new InteropClient({
  gateway: {
    env: "testnet",
    gwRpcUrl: GATEWAY_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});
