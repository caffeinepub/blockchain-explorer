# Specification

## Summary
**Goal:** Replace the existing app entirely with a Matka Pro gambling platform supporting real-money betting, wallet management, and an admin panel — all themed with a bold Indian Matka visual style.

**Planned changes:**
- Replace all existing backend logic with a Matka gambling platform: user registration with balance stored in paise (Nat), bet placement (Single, Jodi, Single Panna, Double Panna, Triple Panna), result declaration with automatic payout calculation at standard Matka odds (9x/90x/150x/300x/600x), deposit/withdrawal request tracking with pending/approved/rejected status, and stable variable storage for canister upgrade survival
- Add admin-only backend functions (verified by caller principal) for declaring results, approving/rejecting deposit and withdrawal requests, and viewing platform statistics
- Build a Market Lobby page showing active markets (Kalyan, Milan Day, Rajdhani Night, etc.) with name, open/close times, last result in standard Matka format, and current status; requires Internet Identity login to place bets
- Build a Bet Placement page per market supporting all five bet types with number input constraints, minimum ₹10 bet, live balance display, balance deduction on success, and expected payout preview
- Build a Wallet page with INR balance display, deposit form (amount + UTR reference), withdrawal form (amount + UPI ID), and full transaction history with statuses
- Build a My Bets / Results page showing the user's bet history grouped by date (newest first), with win/loss/pending outcomes color-coded in green/red/amber
- Build an Admin panel page (hidden from non-admins) for declaring open/close results, managing deposit/withdrawal requests, and viewing platform-wide stats
- Apply a dark background with deep red and gold accent color scheme, Matka wheel/card motifs, bold number typography, and mobile-first responsive layout across all pages
- Replace all APK-related branding, navigation, routes, and components with Matka-specific equivalents; navigation includes Markets, My Bets, Wallet, and Admin (admin only)

**User-visible outcome:** Users can register via Internet Identity, browse active Matka markets, place bets, manage their wallet with manual deposit/withdrawal requests, and view their bet history — all within a richly themed Matka gambling interface. Admins can declare results, approve transactions, and monitor platform statistics.
