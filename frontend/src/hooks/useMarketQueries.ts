import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Market, GameType } from '../backend';

export function useGetAllMarkets() {
  const { actor, isFetching } = useActor();

  return useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMarkets();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetAllGameTypes() {
  const { actor, isFetching } = useActor();

  return useQuery<GameType[]>({
    queryKey: ['gameTypes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGameTypes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGameType(gameTypeId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<GameType | null>({
    queryKey: ['gameType', gameTypeId?.toString()],
    queryFn: async () => {
      if (!actor || gameTypeId === null) return null;
      return actor.getGameType(gameTypeId);
    },
    enabled: !!actor && !isFetching && gameTypeId !== null,
  });
}
