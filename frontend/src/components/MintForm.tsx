import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import {
  getChainInfo,
  getContractAddress,
  rewardsChain,
  stakingChain1,
  stakingChain2,
} from "../config/wagmi";
import { TOKEN_CONTRACT_ADDRESS } from "../config/constants";
import { Coins, CheckCircle, XCircle } from "lucide-react";
import { Abi } from "viem";
import TOKEN_JSON from "../../../contracts/artifacts/contracts/InteropToken.sol/InteropToken.json";
import { Provider } from "zksync-ethers";
import {
  checkIfTxIsFinalized,
  getProveScoreArgs,
  updateLocalChainInteropRoot,
} from "../utils/prove";
import { Status } from "./Status";

export default function MintForm({
  update,
}: {
  update: Dispatch<SetStateAction<number>>;
}) {
  const { address, chain } = useAccount();
  const [chainId, setChainId] = useState<number>(stakingChain1.id);
  const [txHash, setTxHash] = useState<string>("");
  const [isSubmitPending, setIsSubmitPending] = useState<boolean>(false);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);
  const [isRootUpdated, setIsRootUpdated] = useState<boolean>(false);
  const { writeContract, data: hash, isError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const thisChainId = chain?.id;

  const { data: tokenData } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_JSON.abi as Abi,
    functionName: "addressesThatMinted",
    chainId: rewardsChain.id,
    args: [address],
  });

  useEffect(() => {
    update((prev) => prev + 1);
  }, [isSuccess]);

  const isCorrectChain = thisChainId === rewardsChain.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash || !chainId) {
      alert("missing tx hash");
      return;
    }
    const chain = getChainInfo(chainId);
    const stakingContractAddress = getContractAddress(chainId);
    if (!chain || !stakingContractAddress) {
      alert("Staking chain not supported");
      return;
    }
    setIsSubmitPending(true);
    const provider = new Provider(chain.rpcUrls.default.http[0]);
    const status = await checkIfTxIsFinalized(txHash, provider);
    if (status !== "EXECUTED") {
      alert("Deposit txn is not yet finalized.");
      setIsSubmitPending(false);
      return;
    }
    setIsFinalized(true);
    await updateLocalChainInteropRoot(txHash, provider);
    setIsRootUpdated(true);
    const args = await getProveScoreArgs(txHash, provider);

    writeContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: TOKEN_JSON.abi as Abi,
      functionName: "mint",
      args: [
        args.srcChainId,
        args.l1BatchNumber,
        args.l2MessageIndex,
        args.msgData,
        args.gatewayProof,
      ],
    });
  };

  if (!isCorrectChain) {
    return (
      <div className="text-center py-8">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 font-medium">
          Please switch to {rewardsChain.name} to mint tokens
        </p>
      </div>
    );
  }
  if (tokenData) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <p className="text-green-600 font-medium">
          You have already minted the reward token
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isSubmitPending && (
        <div>
          <label
            htmlFor="txn-hash"
            className="block text-sm font-medium text-purple-200 mb-2"
          >
            Transaction Hash
          </label>
          <input
            id="txn-hash"
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />

          <label className="block text-sm font-medium text-purple-200 my-2">
            Staking Chain:
          </label>
          <select
            id="selectedStakingChain"
            name="selectedStakingChain"
            onChange={(e) => setChainId(Number(e.target.value))}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-all duration-200"
          >
            <option value={stakingChain1.id}>{stakingChain1.name}</option>
            <option value={stakingChain2.id}>{stakingChain2.name}</option>
          </select>
        </div>
      )}

      <div className="text-white">
        {isSubmitPending && (
          <Status
            isLoading={!isFinalized}
            text={
              isFinalized
                ? "Deposit Transaction Finalized"
                : "Deposit Transaction Finalizing"
            }
          />
        )}
        {isFinalized && (
          <Status
            isLoading={!isRootUpdated}
            text={
              isRootUpdated
                ? "Interop Root Updated"
                : "Waiting for Interop Root"
            }
          />
        )}
        {isRootUpdated && (
          <Status
            isLoading={!isSuccess}
            text={
              isError
                ? "Error minting token"
                : isSuccess
                ? "Token Minted"
                : "Minting token"
            }
          />
        )}
      </div>

      {!isSubmitPending && (
        <button
          type="submit"
          disabled={!txHash}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <>
            <Coins className="h-5 w-5" />
            <span>Mint Tokens</span>
          </>
        </button>
      )}
    </form>
  );
}
