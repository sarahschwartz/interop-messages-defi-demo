import { Banknote, Coins } from "lucide-react";
import DepositForm from "./DepositForm";
import WithdrawForm from "./WithdrawForm";
import STAKING_JSON from "../../../contracts/artifacts/contracts/Staking.sol/Staking.json";
import { getContractAddress } from "../config/wagmi";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { type Abi } from "viem";

export default function Staking({
  chainId,
  copy,
}: {
  chainId: number;
  copy: (hash: string) => void;
}) {
  const { address } = useAccount();
  const { data: balance} = useBalance({
    address,
    chainId
  })
  const stakingContractAddress = getContractAddress(chainId) as `0x${string}`;
  const abi = STAKING_JSON.abi as Abi;
  
  const { data: depositsData } = useReadContract({
    address: stakingContractAddress,
    abi,
    functionName: "deposits",
    chainId,
    args: [address],
  });
  
  
  const hasFundsForDeposit = balance && balance.value > 0n;
  const withdrawAmountAvailable = Array.isArray(depositsData)
    ? depositsData[0]
    : undefined;

  return (
    <>
    {hasFundsForDeposit ? (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Staking Deposit</h3>
        </div>
        <p className="text-purple-200 mb-6">
          Deposit ETH to a staking contract
        </p>
        <DepositForm chainId={chainId} copy={copy} stakingContractAddress={stakingContractAddress} abi={abi} />
      </div>
      ) : (
        <div className="text-2xl font-bold text-white">
          No funds available for deposit.
        </div>
      )}

      {withdrawAmountAvailable && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Banknote className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Withdraw Funds</h3>
          </div>
          <p className="text-purple-200 mb-6">
            Withdraw all funds from the staking contract
          </p>
          <WithdrawForm chainId={chainId} stakingContractAddress={stakingContractAddress} abi={abi} />
        </div>
      )}
    </>
  );
}
