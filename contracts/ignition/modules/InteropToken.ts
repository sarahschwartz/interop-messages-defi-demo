import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ABSTRACT_CONTRACT_ADDRESS = "0xeeaD0044812Cb4F4528fA69EF0aF7e154BeE507B";
const LENS_CONTRACT_ADDRESS = "0x2D1Be6b6C0AD5CC09840e9B4Be253af15b3C3440";
// const SOPHON_CONTRACT_ADDRESS = "0x";

const ABSTRACT_CHAIN_ID = "11124";
const LENS_CHAIN_ID = "37111";
// const SOPHON_CHAIN_ID = "531050104";

export default buildModule("InteropTokenModule", (m) => {
  const approvedChainIds = [ABSTRACT_CHAIN_ID, LENS_CHAIN_ID];
  const approvedStakingContracts = [ABSTRACT_CONTRACT_ADDRESS, LENS_CONTRACT_ADDRESS];
  console.log("Approved staking contracts:", approvedStakingContracts)
  const counter = m.contract("InteropToken", [approvedChainIds, approvedStakingContracts]);

  return { counter };
});
