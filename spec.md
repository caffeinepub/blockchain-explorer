# Specification

## Summary
**Goal:** Display declared game results for all markets across the Matka Pro app.

**Planned changes:**
- Add backend storage and retrieval for game results per market, including open number, close number, jodi, and declaration timestamp
- Add a `useGameResultsQueries` React Query hook that fetches all declared game results from the backend with 30-second polling
- Update each market card on the Market Lobby page to show the latest result (open | jodi | close) or a "Result Awaited" placeholder if none declared
- Add a dedicated Results page accessible from the main navigation, listing all markets' historical results in reverse chronological order (date, market name, open, close, jodi), visible to unauthenticated users

**User-visible outcome:** Users can see the latest game results directly on each market card in the lobby, and can visit a dedicated Results page to browse the full history of declared results across all markets.
