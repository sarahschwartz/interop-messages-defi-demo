import React from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { type Abi } from 'viem'
import { Send, Loader2, CheckCircle } from 'lucide-react'
export default function WithdrawForm({
  chainId,
  stakingContractAddress,
  abi
}: {
  chainId: number;
  stakingContractAddress: `0x${string}`,
  abi: Abi;
}) {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chainId) return;

    writeContract({
      address: stakingContractAddress,
      abi,
      functionName: 'withdraw',
    })
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <button
        type="submit"
        disabled={isPending || isConfirming || isSuccess}
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
            <span>Withdraw Staked Base Token</span>
          </>
        )}
      </button>
    </form>

        </>
  )
}