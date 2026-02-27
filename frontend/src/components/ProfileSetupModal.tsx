import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (trimmed.length > 30) {
      setError('Username must be at most 30 characters');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      if (!actor) throw new Error('Not connected');
      await actor.saveCallerUserProfile({
        username: trimmed,
        balance: 0n,
        totalWinnings: 0n,
        totalDeposits: 0n,
        totalWithdrawals: 0n,
      });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-matkaDark-surface border border-matkaGold/30 max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-matkaRed/20 border border-matkaRed/40 flex items-center justify-center">
              <User className="w-7 h-7 text-matkaRed-bright" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold text-matkaGold font-matka tracking-wide">
            Welcome to Matka Pro!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            Choose a username to get started. This will be your display name on the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-foreground font-medium">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-matkaDark border-border focus:border-matkaGold/60 focus:ring-matkaGold/30"
              maxLength={30}
              autoFocus
            />
            {error && <p className="text-xs text-matkaRed-bright">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !username.trim()}
            className="w-full btn-matka-gold rounded-md py-2.5 font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              'Start Playing'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
