import React, { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Abi, parseEther } from 'viem'
import { getContractAddress } from '../config/wagmi'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import STAKING_JSON from "../../../contracts/artifacts/contracts/Staking.sol/Staking.json"
export default function DepositForm({
  chainId,
  copy
}: {
  chainId: number;
  copy: (hash: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const stakingContractAddress = getContractAddress(chainId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !chainId) return;

    writeContract({
      address: stakingContractAddress as `0x${string}`,
      abi: STAKING_JSON.abi as Abi,
      functionName: 'deposit',
      value: parseEther(amount),
    })
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="deposit-amount" className="block text-sm font-medium text-purple-200 mb-2">
          Amount (ETH)
        </label>
        <input
          id="deposit-amount"
          type="number"
          step="0.0000000001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        disabled={!amount || isPending || isConfirming}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{isPending ? 'Confirming...' : 'Processing...'}</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Success!</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Deposit ETH</span>
          </>
        )}
      </button>

      {hash && (
        <div className="flex justify-center">
            <div
          style={{ height: 20, width: 20, cursor: "pointer" }}
          onClick={() => copy(hash)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"
            />
          </svg>
        </div>
          <p className="text-sm text-purple-200">
            Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
        </div>
      )}
    </form>

        </>
  )
}