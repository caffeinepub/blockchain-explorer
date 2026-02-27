import React from 'react';
import { Users, TrendingUp, ArrowDownCircle, ArrowUpCircle, Dice5 } from 'lucide-react';
import { formatPaiseToINR } from '../utils/currency';

interface PlatformStats {
  activeUsers: bigint;
  totalBets: bigint;
  totalPayout: bigint;
  totalDeposits: bigint;
  totalWithdrawals: bigint;
}

interface PlatformStatsCardProps {
  stats: PlatformStats;
}

export default function PlatformStatsCard({ stats }: PlatformStatsCardProps) {
  const items = [
    {
      label: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Total Bets',
      value: stats.totalBets.toString(),
      icon: Dice5,
      color: 'text-matkaGold',
      bg: 'bg-matkaGold/10 border-matkaGold/20',
    },
    {
      label: 'Total Payout',
      value: formatPaiseToINR(stats.totalPayout),
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      label: 'Total Deposits',
      value: formatPaiseToINR(stats.totalDeposits),
      icon: ArrowDownCircle,
      color: 'text-matkaRed-bright',
      bg: 'bg-matkaRed/10 border-matkaRed/20',
    },
    {
      label: 'Total Withdrawals',
      value: formatPaiseToINR(stats.totalWithdrawals),
      icon: ArrowUpCircle,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`rounded-xl p-4 border ${item.bg} flex flex-col gap-2`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
