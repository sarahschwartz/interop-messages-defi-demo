import {
  Contract,
  Provider,
  utils,
  Wallet,
  InteropClient,
  getGwBlockForBatch,
} from "zksync-ethers";
import hre from "hardhat";
import { type HardhatEthers } from "@nomicfoundation/hardhat-ethers/types";

const TOKEN_CONTRACT = "0x8CdfcF26e9f7Ae1c49111cd165f3cE5711601f49";
const STAKING_CHAIN_1_CONTRACT_ADDRESS =
  "0x7A03C544695751Fe78FC75C6C1397e4601579B1f";
const STAKING_CHAIN_2_CONTRACT_ADDRESS =
  "0xD75Bf167785EAe2197ef92637337259bfD16bDE9";

// verify this value in zksync-era/chains/gateway/ZkStack.yaml
const GW_CHAIN_ID = BigInt("506");

let connection;

let ethers: HardhatEthers;

async function main() {
  connection = await hre.network.connect("stakingChain1");
  ethers = connection.ethers;

  const GW_RPC = (hre.userConfig.networks as any).zksyncGateway.url;

  const interop = new InteropClient({
    gateway: {
      env: "local",
      gwRpcUrl: GW_RPC,
      gwChainId: GW_CHAIN_ID,
    },
  });

  // Staking Chain 1
  const providerStakingChain1 = new Provider(
    (hre.userConfig.networks as any).stakingChain1.url
  );

  // Rewards Chain
  const providerRewardsChain = new Provider(
    (hre.userConfig.networks as any).rewardsChain.url
  );

  let [signer] = await ethers.getSigners();
  const stakingContract = await ethers.getContractAt(
    "Staking",
    STAKING_CHAIN_1_CONTRACT_ADDRESS,
    signer
  );

  const tx = await stakingContract.deposit({
    value: ethers.parseEther("0.01"),
  });
  await tx.wait();
  const txHash = tx.hash as `0x${string}`;
  console.log("TX HASH", txHash);

  // for local testing
  // on testnet or mainnet the wait period will be much longer
  let status: any = "QUEUED";
  while (status !== "EXECUTED") {
    await utils.sleep(20000);
    status = await interop.getMessageStatus(providerStakingChain1, txHash);
    console.log("status", status);
  }

  // for local testing only
  // forces interop root to update on local rewards chain by sending txns
  // for testnet or mainnet, use `waitForGatewayInteropRoot` method from `zksync-ethers`
  const root = await updateLocalChainInteropRoot(
    txHash,
    providerStakingChain1,
    providerRewardsChain,
    GW_RPC
  );
  console.log("interop root is updated", root);

  const canVerify = await interop.verifyMessage({
    txHash,
    srcProvider: providerStakingChain1,
    targetChain: providerRewardsChain,
  });
  console.log("canVerify", canVerify.verified);

  if (!canVerify.verified) {
    throw new Error("Unable to verify message");
  }

  const args = await interop.getVerificationArgs({
    txHash,
    srcProvider: providerStakingChain1,
    targetChain: providerRewardsChain,
  });

  connection = await hre.network.connect("rewardsChain");
  ethers = connection.ethers;
  [signer] = await ethers.getSigners();

  const tokenContract = await ethers.getContractAt(
    "InteropToken",
    TOKEN_CONTRACT,
    signer
  );
  const mintTx = await tokenContract.mint(
    args.srcChainId,
    args.l1BatchNumber,
    args.l2MessageIndex,
    args.msgData,
    args.gatewayProof
  );
  await mintTx.wait();

  const tokenBalance = await tokenContract.balanceOf(signer.address);
  console.log("tokenBalance", tokenBalance);
}

// force interop root to update on leaderboard chain
async function updateLocalChainInteropRoot(
  txHash: `0x${string}`,
  srcProvider: Provider,
  rewardsChainProvider: Provider,
  GW_RPC: string,
  timeoutMs = 120_000
): Promise<string> {
  const PRIVATE_KEY =
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet = new Wallet(PRIVATE_KEY, rewardsChainProvider);
  const receipt = await (
    await srcProvider.getTransaction(txHash)
  ).waitFinalize();
  const gw = new ethers.JsonRpcProvider(GW_RPC);
  const gwBlock = await getGwBlockForBatch(
    BigInt(receipt.l1BatchNumber!),
    srcProvider,
    gw as any
  );

  // fetch the interop root from target chain
  const InteropRootStorage = new Contract(
    utils.L2_INTEROP_ROOT_STORAGE_ADDRESS,
    utils.L2_INTEROP_ROOT_STORAGE_ABI,
    wallet
  );

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const root: string = await InteropRootStorage.interopRoots(
      GW_CHAIN_ID,
      gwBlock
    );
    if (root && root !== "0x" + "0".repeat(64)) return root;
    // send tx just to get chain2 to seal batch
    const t = await wallet.sendTransaction({
      to: wallet.address,
      value: BigInt(1),
    });
    await (await wallet.provider.getTransaction(t.hash)).waitFinalize();
  }
  throw new Error(
    `Chain2 did not import interop root for (${GW_CHAIN_ID}, ${gwBlock}) in time`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
