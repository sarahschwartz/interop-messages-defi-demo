import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { rewardsChain, stakingChain1, stakingChain2 } from "../config/wagmi";
import { Network, ChevronDown } from "lucide-react";

export default function ChainSwitcher() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showChains, setShowChains] = React.useState(false);
  const chainId = chain?.id;

  const allChains = [rewardsChain, stakingChain1, stakingChain2];
  const currentChain = allChains.find((c) => c.id === chainId);
  const otherChains = allChains.filter((c) => c.id !== chainId);

  return (
    <div className="relative">
      <button
        onClick={() => setShowChains(!showChains)}
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Network className="h-4 w-4" />
        <span className="font-medium">
          {currentChain ? currentChain.name : "Unsupported Chain"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {showChains && (
        <>
          <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 min-w-[150px]">
            {otherChains.map((otherChain) => (
              <button
                key={otherChain.id}
                onClick={() => {
                  switchChain({ chainId: otherChain.id });
                  setShowChains(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <Network className="h-4 w-4" />
                <span>{otherChain.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
