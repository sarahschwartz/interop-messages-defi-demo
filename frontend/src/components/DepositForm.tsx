import React, { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Abi, parseEther } from 'viem'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { CopyIcon } from './CopyIcon'
export default function DepositForm({
  chainId,
  copy,
  stakingContractAddress,
  abi
}: {
  chainId: number;
  copy: (hash: string) => void;
  stakingContractAddress: `0x${string}`,
  abi: Abi;
}) {
  const [amount, setAmount] = useState('');
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !chainId) return;

    writeContract({
      address: stakingContractAddress,
      abi,
      functionName: 'deposit',
      value: parseEther(amount),
    })
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="deposit-amount" className="block text-sm font-medium text-purple-200 mb-2">
          Amount (ETH or base token)
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
        disabled={!amount || isPending || isConfirming || isSuccess}
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
            <span>Deposit</span>
          </>
        )}
      </button>

      {hash && (
        <div className="flex justify-center">
          <CopyIcon copy={copy} hash={hash}/>
          <p className="text-sm text-purple-200">
            Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
        </div>
      )}
    </form>

        </>
  )
}