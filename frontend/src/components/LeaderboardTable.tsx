import { useEffect, useMemo } from "react";
import { useReadContracts } from "wagmi";
import { era, wagmiConfig } from "../config/wagmi";
import TOKEN_JSON from "../../../contracts/artifacts/contracts/InteropToken.sol/InteropToken.json";
import { TOKEN_CONTRACT_ADDRESS } from "../config/constants";
import type { Abi } from "viem";

export function LeaderboardTable(
  { update }: { update: number }
) {
  const chains = wagmiConfig.chains.filter(c => c.id !== era.id);
  const { data, 
    refetch
   } = useReadContracts({
    allowFailure: true,
    contracts: chains.map((c) => ({
      abi: TOKEN_JSON.abi as Abi,
      address: TOKEN_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "rewardsByChain",
      chainId: era.id,
      args: [c.id],
    }))
  });

  useEffect(() => { refetch(); }, [update, refetch]);

  const rows = useMemo(() => {
    if (!data) return [];
    return chains.map((c, i) => {
      const numberofMints = data[i].result;

      return { id: c.id, name: c.name, mints: numberofMints as bigint };
    })
    .sort((a, b) => (a.mints === b.mints ? a.id - b.id : a.mints > b.mints ? -1 : 1));
  }, [chains, data]);

  return (
<div className="overflow-hidden rounded-xl border border-white/20 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-white/90">
          <thead>
            <tr className="text-white/80">
              <th className="px-5 py-3 text-left font-semibold">
                <div>Chain Name</div>
                <div className="mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              </th>
              <th className="px-5 py-3 text-right font-semibold">
                <div># of Mints</div>
                <div className="mt-2 ml-auto h-0.5 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              </th>
            </tr>
          </thead>

            <tbody className="[&>tr:last-child>td]:border-b-0">
            {rows.map(({ id, name, mints }) => (
              <tr
                key={id}
                className="border-b border-white/10 transition-colors hover:bg-white/10"
              >
                <td className="px-5 py-3">
                  <span className="font-medium text-white">{name}</span>
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">
                  {mints.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
