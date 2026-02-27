import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DepositRequest, WithdrawalRequest, Market, Variant_closed_open } from '../backend';

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingDepositRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ['pendingDeposits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingDepositRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['pendingWithdrawals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlatformStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['platformStats'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDepositRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Not connected');
      return actor.approveDepositRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
    },
  });
}

export function useRejectDepositRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Not connected');
      return actor.rejectDepositRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
    },
  });
}

export function useApproveWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Not connected');
      return actor.approveWithdrawalRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
    },
  });
}

export function useRejectWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Not connected');
      return actor.rejectWithdrawalRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
  });
}

export function useDeclareGameResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      openNumber,
      closeNumber,
      jodi,
      singlePanna,
      doublePanna,
      triplePanna,
    }: {
      marketId: bigint;
      openNumber: string;
      closeNumber: string;
      jodi: string;
      singlePanna: bigint[];
      doublePanna: bigint[];
      triplePanna: bigint[];
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.declareGameResult(marketId, openNumber, closeNumber, jodi, singlePanna, doublePanna, triplePanna);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['betHistory'] });
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
    },
  });
}

export function useUpdateMarketStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketId, status }: { marketId: bigint; status: Variant_closed_open }) => {
      if (!actor) throw new Error('Not connected');
      return actor.updateMarketStatus(marketId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
}

export function useCreateMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      openTime,
      closeTime,
    }: {
      name: string;
      openTime: bigint;
      closeTime: bigint;
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.createMarket(name, openTime, closeTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
}
