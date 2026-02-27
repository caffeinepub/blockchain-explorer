import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GameType {
    id: GameTypeId;
    status: Variant_closed_open;
    name: string;
    createdAt: bigint;
    betTypes: Array<BetType>;
    marketId: MarketId;
}
export type BetId = bigint;
export type DepositRequestId = bigint;
export type WithdrawalRequestId = bigint;
export interface Bet {
    id: BetId;
    status: Variant_won_pending_lost;
    userId: Principal;
    createdAt: bigint;
    betType: BetType;
    marketId: MarketId;
    gameTypeId: GameTypeId;
    number: string;
    amount: bigint;
    payout?: bigint;
}
export type MarketId = bigint;
export interface MarketResults {
    results: Array<Result>;
    marktetId: string;
}
export type GameTypeId = bigint;
export interface Market {
    id: MarketId;
    status: Variant_closed_open;
    closeTime: bigint;
    name: string;
    createdAt: bigint;
    openTime: bigint;
}
export interface Transaction {
    id: TransactionId;
    transactionType: {
        __kind__: "withdrawalRequest";
        withdrawalRequest: WithdrawalRequestId;
    } | {
        __kind__: "depositRequest";
        depositRequest: DepositRequestId;
    } | {
        __kind__: "winningPayout";
        winningPayout: BetId;
    } | {
        __kind__: "betPlacement";
        betPlacement: BetId;
    };
    userId: Principal;
    createdAt: bigint;
    amount: bigint;
}
export type TransactionId = bigint;
export interface Result {
    jodi: string;
    time: bigint;
    closeNumber: string;
    marketId: string;
    openNumber: string;
}
export interface TimeRange {
    timeStart: bigint;
    timeEnd: bigint;
}
export interface DepositRequest {
    id: DepositRequestId;
    utr: string;
    status: Variant_pending_approved_rejected;
    userId: Principal;
    createdAt: bigint;
    reviewedAt?: bigint;
    reviewer?: Principal;
    amount: bigint;
}
export interface WithdrawalRequest {
    id: WithdrawalRequestId;
    status: Variant_pending_approved_rejected;
    userId: Principal;
    createdAt: bigint;
    reviewedAt?: bigint;
    upiId: string;
    reviewer?: Principal;
    amount: bigint;
}
export interface UserProfile {
    username: string;
    balance: bigint;
    totalWinnings: bigint;
    totalWithdrawals: bigint;
    totalDeposits: bigint;
}
export enum BetType {
    doublePanna = "doublePanna",
    jodi = "jodi",
    singlePanna = "singlePanna",
    single = "single",
    triplePanna = "triplePanna"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_closed_open {
    closed = "closed",
    open = "open"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum Variant_won_pending_lost {
    won = "won",
    pending = "pending",
    lost = "lost"
}
export interface backendInterface {
    addResult(market: string, openNumber: string, closeNumber: string, jodi: string): Promise<void>;
    approveDepositRequest(_requestId: DepositRequestId): Promise<boolean>;
    approveWithdrawalRequest(_requestId: WithdrawalRequestId): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGameType(_name: string, _marketId: MarketId, _betTypes: Array<BetType>): Promise<GameTypeId>;
    createMarket(_name: string, _openTime: bigint, _closeTime: bigint): Promise<MarketId>;
    declareGameResult(_marketId: MarketId, _openNumber: string, _closeNumber: string, _jodi: string, _singlePanna: Array<bigint>, _doublePanna: Array<bigint>, _triplePanna: Array<bigint>): Promise<boolean>;
    getAllGameTypes(): Promise<Array<GameType>>;
    getAllMarkets(): Promise<Array<Market>>;
    getBetHistory(user: Principal): Promise<Array<Bet>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGameType(gameTypeId: GameTypeId): Promise<GameType | null>;
    getPendingDepositRequests(): Promise<Array<DepositRequest>>;
    getPendingWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getPlatformStats(): Promise<{
        activeUsers: bigint;
        totalBets: bigint;
        totalWithdrawals: bigint;
        totalPayout: bigint;
        totalDeposits: bigint;
    }>;
    getResults(markets: Array<string>, _range: TimeRange | null): Promise<Array<MarketResults>>;
    getTransactionHistory(user: Principal): Promise<Array<Transaction>>;
    getUserBets(user: Principal): Promise<Array<Bet>>;
    getUserProfile(arg0: Principal): Promise<UserProfile | null>;
    getUserTransactions(user: Principal): Promise<Array<Transaction>>;
    isCallerAdmin(): Promise<boolean>;
    placeBet(_gameTypeId: GameTypeId, _betType: BetType, _number: string, _amount: bigint): Promise<BetId>;
    registerUser(username: string): Promise<void>;
    rejectDepositRequest(_requestId: DepositRequestId): Promise<boolean>;
    rejectWithdrawalRequest(_requestId: WithdrawalRequestId): Promise<boolean>;
    saveCallerUserProfile(arg0: UserProfile): Promise<void>;
    submitDepositRequest(_amount: bigint, _utr: string): Promise<DepositRequestId>;
    submitWithdrawalRequest(_amount: bigint, _upiId: string): Promise<WithdrawalRequestId>;
    updateMarketStatus(_marketId: MarketId, _status: Variant_closed_open): Promise<boolean>;
}
