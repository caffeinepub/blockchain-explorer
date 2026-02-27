import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetPendingDepositRequests,
  useGetPendingWithdrawalRequests,
  useGetPlatformStats,
  useCreateMarket,
} from '../hooks/useAdminQueries';
import { useGetAllMarkets } from '../hooks/useMarketQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import PlatformStatsCard from '../components/PlatformStatsCard';
import DepositRequestsTable from '../components/DepositRequestsTable';
import WithdrawalRequestsTable from '../components/WithdrawalRequestsTable';
import ResultDeclarationForm from '../components/ResultDeclarationForm';
import MarketManagementTable from '../components/MarketManagementTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  ArrowDownCircle,
  ArrowUpCircle,
  Trophy,
  Store,
  PlusCircle,
  Loader2,
  LogIn,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { mergeMarkets } from '../lib/staticMarkets';

// Preset Matka game schedules for quick-fill
const MATKA_PRESETS = [
  { name: 'Time Bazar', openHour: '13', openMin: '00', closeHour: '14', closeMin: '00' },
  { name: 'Milan Day', openHour: '15', openMin: '00', closeHour: '17', closeMin: '00' },
  { name: 'Kalyan', openHour: '15', openMin: '45', closeHour: '17', closeMin: '45' },
  { name: 'Sridevi', openHour: '11', openMin: '30', closeHour: '12', closeMin: '30' },
  { name: 'Milan Night', openHour: '21', openMin: '00', closeHour: '23', closeMin: '00' },
  { name: 'Main Bazar', openHour: '21', openMin: '00', closeHour: '23', closeMin: '30' },
];

function CreateMarketForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = React.useState('');
  const [openHour, setOpenHour] = React.useState('10');
  const [openMin, setOpenMin] = React.useState('00');
  const [closeHour, setCloseHour] = React.useState('12');
  const [closeMin, setCloseMin] = React.useState('00');
  const createMarketMutation = useCreateMarket();

  const applyPreset = (preset: typeof MATKA_PRESETS[0]) => {
    setName(preset.name);
    setOpenHour(preset.openHour);
    setOpenMin(preset.openMin);
    setCloseHour(preset.closeHour);
    setCloseMin(preset.closeMin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a market name');
      return;
    }

    // Build time as nanoseconds from today's date with given hour/min
    const now = new Date();
    const openDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(openHour), parseInt(openMin));
    const closeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(closeHour), parseInt(closeMin));
    const openTimeNs = BigInt(openDate.getTime()) * 1_000_000n;
    const closeTimeNs = BigInt(closeDate.getTime()) * 1_000_000n;

    try {
      await createMarketMutation.mutateAsync({ name: name.trim(), openTime: openTimeNs, closeTime: closeTimeNs });
      toast.success(`Market "${name}" created!`);
      setName('');
      onSuccess();
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e?.message || 'Failed to create market');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Quick presets */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold text-xs flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-matkaGold" />
          Quick Fill — Standard Matka Games
        </Label>
        <div className="flex flex-wrap gap-2">
          {MATKA_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 text-xs rounded-md bg-matkaDark-raised border border-matkaGold/30 text-matkaGold hover:bg-matkaGold/10 hover:border-matkaGold/60 transition-colors font-semibold"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-foreground font-semibold">Market Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Kalyan, Milan Day, Time Bazar..."
          className="bg-matkaDark border-border focus:border-matkaGold/60"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-foreground font-semibold text-xs">Open Time (HH:MM)</Label>
          <div className="flex gap-1">
            <Input
              type="number"
              value={openHour}
              onChange={(e) => setOpenHour(e.target.value)}
              min="0"
              max="23"
              className="bg-matkaDark border-border focus:border-matkaGold/60 text-center"
              placeholder="HH"
            />
            <span className="flex items-center text-muted-foreground font-bold">:</span>
            <Input
              type="number"
              value={openMin}
              onChange={(e) => setOpenMin(e.target.value)}
              min="0"
              max="59"
              className="bg-matkaDark border-border focus:border-matkaGold/60 text-center"
              placeholder="MM"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground font-semibold text-xs">Close Time (HH:MM)</Label>
          <div className="flex gap-1">
            <Input
              type="number"
              value={closeHour}
              onChange={(e) => setCloseHour(e.target.value)}
              min="0"
              max="23"
              className="bg-matkaDark border-border focus:border-matkaGold/60 text-center"
              placeholder="HH"
            />
            <span className="flex items-center text-muted-foreground font-bold">:</span>
            <Input
              type="number"
              value={closeMin}
              onChange={(e) => setCloseMin(e.target.value)}
              min="0"
              max="59"
              className="bg-matkaDark border-border focus:border-matkaGold/60 text-center"
              placeholder="MM"
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={createMarketMutation.isPending}
        className="w-full btn-matka-gold rounded-md py-2.5 font-bold"
      >
        {createMarketMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Market
          </>
        )}
      </Button>
    </form>
  );
}

export default function AdminPanel() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: pendingDeposits, isLoading: depositsLoading } = useGetPendingDepositRequests();
  const { data: pendingWithdrawals, isLoading: withdrawalsLoading } = useGetPendingWithdrawalRequests();
  const { data: platformStats, isLoading: statsLoading } = useGetPlatformStats();
  const { data: backendMarkets, isLoading: marketsLoading, refetch: refetchMarkets } = useGetAllMarkets();

  // Merge backend markets with static fallback for display
  const markets = mergeMarkets(backendMarkets ?? []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center mx-auto mb-5">
          <LogIn className="w-8 h-8 text-matkaRed-bright" />
        </div>
        <h2 className="font-matka text-2xl tracking-wide text-foreground mb-2">LOGIN REQUIRED</h2>
        <p className="text-muted-foreground mb-6">Please login to access the admin panel.</p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="btn-matka-primary px-6 py-2.5 rounded-md font-bold"
        >
          {isLoggingIn ? 'Logging in...' : 'Login Now'}
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48 bg-matkaDark-raised" />
        <Skeleton className="h-32 rounded-xl bg-matkaDark-raised" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-matka text-2xl sm:text-3xl tracking-wide text-matkaGold">
          ADMIN PANEL
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform management dashboard</p>
      </div>

      <div className="divider-gold mb-5" />

      {/* Platform stats */}
      <div className="mb-6">
        <h2 className="font-matka text-lg tracking-wide text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-matkaGold" />
          PLATFORM STATISTICS
        </h2>
        {statsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl bg-matkaDark-raised" />
            ))}
          </div>
        ) : platformStats ? (
          <PlatformStatsCard stats={platformStats} />
        ) : null}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="w-full bg-matkaDark-surface border border-border mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger
            value="markets"
            className="flex-1 min-w-[120px] data-[state=active]:bg-matkaGold/20 data-[state=active]:text-matkaGold text-xs sm:text-sm"
          >
            <Store className="w-3.5 h-3.5 mr-1" />
            Markets
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="flex-1 min-w-[120px] data-[state=active]:bg-matkaGold/20 data-[state=active]:text-matkaGold text-xs sm:text-sm"
          >
            <Trophy className="w-3.5 h-3.5 mr-1" />
            Results
          </TabsTrigger>
          <TabsTrigger
            value="deposits"
            className="flex-1 min-w-[120px] data-[state=active]:bg-matkaGold/20 data-[state=active]:text-matkaGold text-xs sm:text-sm"
          >
            <ArrowDownCircle className="w-3.5 h-3.5 mr-1" />
            Deposits
            {pendingDeposits && pendingDeposits.length > 0 && (
              <span className="ml-1.5 bg-matkaRed text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {pendingDeposits.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="withdrawals"
            className="flex-1 min-w-[120px] data-[state=active]:bg-matkaGold/20 data-[state=active]:text-matkaGold text-xs sm:text-sm"
          >
            <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
            Withdrawals
            {pendingWithdrawals && pendingWithdrawals.length > 0 && (
              <span className="ml-1.5 bg-matkaRed text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {pendingWithdrawals.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-6">
          {/* Market Management Table */}
          <div className="p-4 sm:p-5 rounded-xl bg-matkaDark-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-matka text-lg tracking-wide text-foreground flex items-center gap-2">
                <Store className="w-4 h-4 text-matkaGold" />
                MARKET MANAGEMENT
              </h3>
              <span className="text-xs text-muted-foreground">
                {markets.length} market{markets.length !== 1 ? 's' : ''}
              </span>
            </div>
            {marketsLoading ? (
              <Skeleton className="h-32 rounded-xl bg-matkaDark-raised" />
            ) : (
              <MarketManagementTable markets={markets} />
            )}
          </div>

          {/* Create Market Form */}
          <div className="p-4 sm:p-5 rounded-xl bg-matkaDark-surface border border-border">
            <h3 className="font-matka text-lg tracking-wide text-foreground mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-matkaGold" />
              CREATE NEW MARKET
            </h3>
            <CreateMarketForm onSuccess={() => refetchMarkets()} />
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          <div className="p-4 sm:p-5 rounded-xl bg-matkaDark-surface border border-border">
            <h3 className="font-matka text-lg tracking-wide text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-matkaGold" />
              DECLARE RESULT
            </h3>
            <ResultDeclarationForm markets={markets} />
          </div>
        </TabsContent>

        {/* Deposits Tab */}
        <TabsContent value="deposits">
          <div className="p-4 sm:p-5 rounded-xl bg-matkaDark-surface border border-border">
            <h3 className="font-matka text-lg tracking-wide text-foreground mb-4 flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-matkaGold" />
              PENDING DEPOSITS
            </h3>
            {depositsLoading ? (
              <Skeleton className="h-32 rounded-xl bg-matkaDark-raised" />
            ) : (
              <DepositRequestsTable requests={pendingDeposits ?? []} />
            )}
          </div>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals">
          <div className="p-4 sm:p-5 rounded-xl bg-matkaDark-surface border border-border">
            <h3 className="font-matka text-lg tracking-wide text-foreground mb-4 flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-matkaGold" />
              PENDING WITHDRAWALS
            </h3>
            {withdrawalsLoading ? (
              <Skeleton className="h-32 rounded-xl bg-matkaDark-raised" />
            ) : (
              <WithdrawalRequestsTable requests={pendingWithdrawals ?? []} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
