import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Bet } from '../backend';

export function useGetBetHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Bet[]>({
    queryKey: ['betHistory', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getBetHistory(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
