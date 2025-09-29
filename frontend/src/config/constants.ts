import { InteropClient } from "zksync-ethers";

export const GATEWAY_RPC = "http://localhost:3150/";
export const GW_CHAIN_ID = BigInt("506");
export const TOKEN_CONTRACT_ADDRESS =
  "0x8CdfcF26e9f7Ae1c49111cd165f3cE5711601f49";
export const STAKING_CHAIN_1_CONTRACT_ADDRESS =
  "0x7A03C544695751Fe78FC75C6C1397e4601579B1f";
export const STAKING_CHAIN_2_CONTRACT_ADDRESS =
  "0xD75Bf167785EAe2197ef92637337259bfD16bDE9";

export const interopClient = new InteropClient({
  gateway: {
    env: "local",
    gwRpcUrl: GATEWAY_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});
