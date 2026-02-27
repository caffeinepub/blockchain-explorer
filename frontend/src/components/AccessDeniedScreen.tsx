import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center mb-6">
        <ShieldX className="w-10 h-10 text-matkaRed-bright" />
      </div>
      <h1 className="text-3xl font-matka tracking-widest text-matkaRed-bright mb-2 text-glow-red">
        ACCESS DENIED
      </h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        You do not have permission to access the Admin Panel. This area is restricted to administrators only.
      </p>
      <Link
        to="/"
        className="btn-matka-gold px-6 py-2.5 rounded-md font-bold text-sm inline-flex items-center gap-2"
      >
        ← Back to Markets
      </Link>
    </div>
  );
}
