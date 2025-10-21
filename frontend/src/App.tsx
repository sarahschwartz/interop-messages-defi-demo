import { useAccount, useSwitchChain } from 'wagmi'
import WalletConnect from './components/WalletConnect'
import ChainSwitcher from './components/ChainSwitcher'
import MintForm from './components/MintForm'
import { Wallet, CircleDollarSign, Coins, Star } from 'lucide-react'
import { era } from './config/wagmi'
import { useState } from 'react'
import { LeaderboardTable } from './components/LeaderboardTable'
import Staking from './components/Staking'

function App() {
  const { isConnected, chain } = useAccount();
  const { chains } = useSwitchChain();
  const [updateNum, setUpdateNum] = useState(0);
  const [show, setShow] = useState(false);
  const isOnSupportedChain = chains.some((c) => c.id === chain?.id);

  function copy(hash: string) {
        if (hash) navigator.clipboard.writeText(hash);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
      }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background Pattern */}
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <CircleDollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Interop Rewards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected && <ChainSwitcher />}
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {!isConnected ? (
              <div className="text-center py-16">
                <Wallet className="h-16 w-16 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-purple-200 text-lg">
                  Connect your wallet to start interacting with smart contracts
                </p>
              </div>
            ) : (
              <>
              {!isOnSupportedChain || !chain ? (
            <>
              <div className="text-3xl font-bold text-white">Switch to a supported network</div>
            </>
          ) : (
              <div className="grid max-w-[820px] gap-8 mx-auto my-20">
                {chain.id !== era.id ? (
                  <Staking chainId={chain.id} copy={copy}/>
                ) : (
                  <>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Mint Rewards</h3>
                  </div>
                  <MintForm update={setUpdateNum}/>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">All Rewards by Chain</h3>
                  </div>
                  <LeaderboardTable update={updateNum} />
                </div>
                </>
              )}
              </div>
          )}
              </>
            )}
          </div>
        </main>
        <div className="w-100 grid place-items-center">
        <div id="toast" className={show ? "show space-x-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white" : ""}>
          Copied tx hash to clipboard
        </div>
        </div>
      </div>
      
    </div>
  )
}

export default App