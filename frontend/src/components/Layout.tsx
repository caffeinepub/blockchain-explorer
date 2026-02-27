import React from 'react';
import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { TrendingUp, Wallet, ListChecks, ShieldCheck } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdminQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { formatPaiseToINR } from '../utils/currency';

export function Layout() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'matka-pro'
  );
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const navLinks = [
    { to: '/', label: 'Markets', icon: TrendingUp },
    { to: '/my-bets', label: 'My Bets', icon: ListChecks, authRequired: true },
    { to: '/wallet', label: 'Wallet', icon: Wallet, authRequired: true },
  ];

  const visibleLinks = navLinks.filter((l) => !l.authRequired || isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col bg-background bg-matka-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-matkaDark/90 backdrop-blur-md shrink-0">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <img
                src="/assets/generated/matka-logo.dim_256x256.png"
                alt="Matka Pro"
                className="w-9 h-9 object-contain rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="hidden sm:block">
                <span className="font-matka text-xl tracking-widest text-matkaGold text-glow-gold">
                  MATKA PRO
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-0.5 sm:gap-1">
              {visibleLinks.map((link) => {
                const isActive =
                  link.to === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={[
                      'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150',
                      isActive
                        ? 'bg-matkaRed/20 text-matkaRed-bright border border-matkaRed/40 glow-red'
                        : 'text-muted-foreground hover:text-foreground hover:bg-matkaDark-raised border border-transparent',
                    ].join(' ')}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={[
                    'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150',
                    currentPath.startsWith('/admin')
                      ? 'bg-matkaGold/20 text-matkaGold border border-matkaGold/40 glow-gold'
                      : 'text-muted-foreground hover:text-matkaGold hover:bg-matkaDark-raised border border-transparent',
                  ].join(' ')}
                >
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
            </nav>

            {/* Right side: balance + login */}
            <div className="flex items-center gap-2 shrink-0">
              {isAuthenticated && userProfile && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-matkaDark-raised border border-matkaGold/20">
                  <Wallet className="w-3.5 h-3.5 text-matkaGold" />
                  <span className="text-xs font-bold text-matkaGold">
                    {formatPaiseToINR(userProfile.balance)}
                  </span>
                </div>
              )}
              {isAuthenticated && userProfile && (
                <span className="hidden md:block text-xs text-muted-foreground max-w-[100px] truncate">
                  {userProfile.username}
                </span>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-matkaDark/80 shrink-0 mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-matka text-sm tracking-widest text-matkaGold/60">MATKA PRO</span>
            <span className="text-muted-foreground text-xs">© {year}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ This platform is for entertainment purposes. Please gamble responsibly.
          </p>
          <span className="text-xs text-muted-foreground">
            Built with{' '}
            <span className="text-matkaRed-bright">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-matkaGold hover:text-matkaGold-dim transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
