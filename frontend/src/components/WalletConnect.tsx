import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showConnectors, setShowConnectors] = React.useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConnectors(!showConnectors)}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-all duration-200"
        >
          <Wallet className="h-4 w-4" />
          <span className="font-medium">{formatAddress(address!)}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        
        {showConnectors && (
          <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 min-w-[200px]">
            <button
              onClick={() => disconnect()}
              className="flex items-center space-x-2 w-full px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
        disabled={isPending}
      >
        <Wallet className="h-4 w-4" />
        <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
      
      {showConnectors && (
        <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 min-w-[200px]">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector })
                setShowConnectors(false)
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <span>{connector.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}