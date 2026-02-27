import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      size="sm"
      className={
        isAuthenticated
          ? 'bg-matkaDark-raised border border-border text-foreground hover:border-matkaRed/50 hover:text-matkaRed-bright transition-colors'
          : 'btn-matka-primary px-4 py-2 rounded-md text-sm'
      }
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          Logging in...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4 mr-1.5" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-1.5" />
          Login
        </>
      )}
    </Button>
  );
}
