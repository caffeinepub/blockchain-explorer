import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BetType, GameTypeId } from '../backend';

export function usePlaceBet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameTypeId,
      betType,
      number,
      amount,
    }: {
      gameTypeId: GameTypeId;
      betType: BetType;
      number: string;
      amount: bigint;
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.placeBet(gameTypeId, betType, number, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['betHistory'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
