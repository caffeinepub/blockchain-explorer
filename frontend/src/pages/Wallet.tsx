import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetTransactionHistory } from '../hooks/useWalletQueries';
import DepositForm from '../components/DepositForm';
import WithdrawalForm from '../components/WithdrawalForm';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, History, LogIn } from 'lucide-react';
import { formatPaiseToINR } from '../utils/currency';

export default function Wallet() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: transactions, isLoading: txLoading } = useGetTransactionHistory();

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center mx-auto mb-5">
          <LogIn className="w-8 h-8 text-matkaRed-bright" />
        </div>
        <h2 className="font-matka text-2xl tracking-wide text-foreground mb-2">LOGIN REQUIRED</h2>
        <p className="text-muted-foreground mb-6">Please login to access your wallet.</p>
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

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-matka text-2xl sm:text-3xl tracking-wide text-foreground">WALLET</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your funds</p>
      </div>

      <div className="divider-gold mb-5" />

      {/* Balance card */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-matkaDark-surface to-matkaDark border border-matkaGold/30 glow-gold">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-matkaGold/20 border border-matkaGold/40 flex items-center justify-center">
            <WalletIcon className="w-5 h-5 text-matkaGold" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available Balance</p>
            {profileLoading ? (
              <Skeleton className="h-8 w-32 bg-matkaDark-raised mt-1" />
            ) : (
              <p className="font-matka text-3xl text-matkaGold text-glow-gold">
                {formatPaiseToINR(userProfile?.balance ?? 0n)}
              </p>
            )}
          </div>
        </div>

        {userProfile && (
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-matkaGold/20">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Deposits</p>
              <p className="text-sm font-bold text-green-400">
                {formatPaiseToINR(userProfile.totalDeposits)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Winnings</p>
              <p className="text-sm font-bold text-matkaGold">
                {formatPaiseToINR(userProfile.totalWinnings)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Withdrawals</p>
              <p className="text-sm font-bold text-matkaRed-bright">
                {formatPaiseToINR(userProfile.totalWithdrawals)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Deposit / Withdrawal tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="w-full bg-matkaDark-surface border border-border mb-4">
            <TabsTrigger
              value="deposit"
              className="flex-1 data-[state=active]:bg-matkaGold/20 data-[state=active]:text-matkaGold"
            >
              <ArrowDownCircle className="w-4 h-4 mr-1.5" />
              Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="flex-1 data-[state=active]:bg-matkaRed/20 data-[state=active]:text-matkaRed-bright"
            >
              <ArrowUpCircle className="w-4 h-4 mr-1.5" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <div className="p-4 rounded-xl bg-matkaDark-surface border border-border">
              <div className="mb-4 p-3 rounded-lg bg-matkaGold/5 border border-matkaGold/20 text-xs text-muted-foreground">
                <p className="font-semibold text-matkaGold mb-1">How to Deposit:</p>
                <p>1. Transfer money to our UPI ID: <span className="text-foreground font-mono">matkapro@upi</span></p>
                <p>2. Enter the UTR number from your bank app below</p>
                <p>3. Admin will approve within 24 hours</p>
              </div>
              <DepositForm />
            </div>
          </TabsContent>

          <TabsContent value="withdraw">
            <div className="p-4 rounded-xl bg-matkaDark-surface border border-border">
              <div className="mb-4 p-3 rounded-lg bg-matkaRed/5 border border-matkaRed/20 text-xs text-muted-foreground">
                <p className="font-semibold text-matkaRed-bright mb-1">Withdrawal Info:</p>
                <p>• Minimum withdrawal: ₹100</p>
                <p>• Processing time: 24 hours</p>
                <p>• Ensure your UPI ID is correct</p>
              </div>
              <WithdrawalForm balance={userProfile?.balance ?? 0n} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick info */}
        <div className="p-4 rounded-xl bg-matkaDark-surface border border-border h-fit">
          <h3 className="font-matka text-lg tracking-wide text-matkaGold mb-3">PAYMENT INFO</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">UPI ID</span>
              <span className="font-mono font-semibold">matkapro@upi</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Min Deposit</span>
              <span className="font-semibold text-green-400">₹100</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Min Withdrawal</span>
              <span className="font-semibold text-matkaRed-bright">₹100</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Processing Time</span>
              <span className="font-semibold">24 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-matkaGold" />
          <h2 className="font-matka text-xl tracking-wide text-foreground">TRANSACTION HISTORY</h2>
        </div>
        <div className="rounded-xl bg-matkaDark-surface border border-border overflow-hidden">
          {txLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 rounded-lg bg-matkaDark-raised" />
              ))}
            </div>
          ) : (
            <TransactionHistoryTable transactions={transactions ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
