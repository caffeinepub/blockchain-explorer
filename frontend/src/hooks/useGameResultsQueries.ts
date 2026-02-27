import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MarketResults, Result } from '../backend';

/**
 * Fetch game results for a list of market names (IDs as strings).
 * Polls every 30 seconds, consistent with markets query.
 */
export function useGetGameResults(marketNames: string[]) {
  const { actor, isFetching } = useActor();

  return useQuery<MarketResults[]>({
    queryKey: ['gameResults', marketNames.join(',')],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getResults(marketNames, null);
    },
    enabled: !!actor && !isFetching && marketNames.length > 0,
    refetchInterval: 30000,
  });
}

/**
 * Get the latest result for a specific market from the results array.
 */
export function getLatestResultForMarket(
  allResults: MarketResults[],
  marketName: string
): Result | null {
  const marketData = allResults.find((mr) => mr.marktetId === marketName);
  if (!marketData || marketData.results.length === 0) return null;
  // Sort by time descending, return the most recent
  const sorted = [...marketData.results].sort((a, b) =>
    Number(b.time - a.time)
  );
  return sorted[0];
}
