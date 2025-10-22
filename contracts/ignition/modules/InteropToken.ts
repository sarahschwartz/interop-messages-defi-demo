import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ABSTRACT_CONTRACT_ADDRESS = "0xeeaD0044812Cb4F4528fA69EF0aF7e154BeE507B";
const SOPHON_CONTRACT_ADDRESS = "0xaCF11984a3463f643852d7aaDCBD7f86aD739e5D";

const ABSTRACT_CHAIN_ID = "11124";
const SOPHON_CHAIN_ID = "531050104";

export default buildModule("InteropTokenModule", (m) => {
  const approvedChainIds = [ABSTRACT_CHAIN_ID, SOPHON_CHAIN_ID];
  const approvedStakingContracts = [ABSTRACT_CONTRACT_ADDRESS, SOPHON_CONTRACT_ADDRESS];
  console.log("Approved staking contracts:", approvedStakingContracts)
  const counter = m.contract("InteropToken", [approvedChainIds, approvedStakingContracts]);

  return { counter };
});
