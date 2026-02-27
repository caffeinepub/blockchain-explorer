import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type OldUser = {
    id : Principal;
    username : Text;
    balance : Nat;
    totalSolved : Nat;
  };

  type OldCaptchaChallenge = {
    id : Text;
    imageUrl : Text;
    answer : Text;
    solved : Bool;
  };

  type OldApkPatchJob = {
    jobId : Text;
    uploadedAt : Int;
    fileName : Text;
    status : Text;
    patchLog : [Text];
    owner : Principal;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    users : Map.Map<Principal, OldUser>;
    captchas : Map.Map<Text, OldCaptchaChallenge>;
    patchJobs : Map.Map<Text, OldApkPatchJob>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  type DepositRequestId = Nat;
  type WithdrawalRequestId = Nat;
  type BetId = Nat;
  type GameResultId = Nat;
  type MarketId = Nat;
  type GameTypeId = Nat;
  type TransactionId = Nat;

  type BetType = {
    #single;
    #jodi;
    #singlePanna;
    #doublePanna;
    #triplePanna;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    depositRequests : Map.Map<DepositRequestId, { id : DepositRequestId; userId : Principal; amount : Nat; utr : Text; status : { #pending; #approved; #rejected }; createdAt : Int; reviewedAt : ?Int; reviewer : ?Principal }>;
    withdrawalRequests : Map.Map<WithdrawalRequestId, { id : WithdrawalRequestId; userId : Principal; amount : Nat; upiId : Text; status : { #pending; #approved; #rejected }; createdAt : Int; reviewedAt : ?Int; reviewer : ?Principal }>;
    bets : Map.Map<BetId, { id : BetId; userId : Principal; gameTypeId : GameTypeId; betType : BetType; number : Text; amount : Nat; createdAt : Int; status : { #pending; #won; #lost }; payout : ?Nat; marketId : MarketId }>;
    gameResults : Map.Map<GameResultId, { id : GameResultId; marketId : MarketId; openNumber : Text; closeNumber : Text; jodi : Text; singlePanna : [Nat]; doublePanna : [Nat]; triplePanna : [Nat]; declaredAt : Int }>;
    markets : Map.Map<MarketId, { id : MarketId; name : Text; openTime : Int; closeTime : Int; status : { #open; #closed }; createdAt : Int }>;
    gameTypes : Map.Map<GameTypeId, { id : GameTypeId; name : Text; marketId : MarketId; betTypes : [BetType]; status : { #open; #closed }; createdAt : Int }>;
    userTransactions : Map.Map<Principal, List.List<{ id : TransactionId; userId : Principal; amount : Nat; transactionType : { #depositRequest : DepositRequestId; #withdrawalRequest : WithdrawalRequestId; #betPlacement : BetId; #winningPayout : BetId }; createdAt : Int }>>;
    nextDepositRequestId : DepositRequestId;
    nextWithdrawalRequestId : WithdrawalRequestId;
    nextBetId : BetId;
    nextGameResultId : GameResultId;
    nextMarketId : MarketId;
    nextGameTypeId : GameTypeId;
    nextTransactionId : TransactionId;
  };

  public func run(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      depositRequests = Map.empty<DepositRequestId, { id : DepositRequestId; userId : Principal; amount : Nat; utr : Text; status : { #pending; #approved; #rejected }; createdAt : Int; reviewedAt : ?Int; reviewer : ?Principal }>();
      withdrawalRequests = Map.empty<WithdrawalRequestId, { id : WithdrawalRequestId; userId : Principal; amount : Nat; upiId : Text; status : { #pending; #approved; #rejected }; createdAt : Int; reviewedAt : ?Int; reviewer : ?Principal }>();
      bets = Map.empty<BetId, { id : BetId; userId : Principal; gameTypeId : GameTypeId; betType : BetType; number : Text; amount : Nat; createdAt : Int; status : { #pending; #won; #lost }; payout : ?Nat; marketId : MarketId }>();
      gameResults = Map.empty<GameResultId, { id : GameResultId; marketId : MarketId; openNumber : Text; closeNumber : Text; jodi : Text; singlePanna : [Nat]; doublePanna : [Nat]; triplePanna : [Nat]; declaredAt : Int }>();
      markets = Map.empty<MarketId, { id : MarketId; name : Text; openTime : Int; closeTime : Int; status : { #open; #closed }; createdAt : Int }>();
      gameTypes = Map.empty<GameTypeId, { id : GameTypeId; name : Text; marketId : MarketId; betTypes : [BetType]; status : { #open; #closed }; createdAt : Int }>();
      userTransactions = Map.empty<Principal, List.List<{ id : TransactionId; userId : Principal; amount : Nat; transactionType : { #depositRequest : DepositRequestId; #withdrawalRequest : WithdrawalRequestId; #betPlacement : BetId; #winningPayout : BetId }; createdAt : Int }>>();
      nextDepositRequestId = 1;
      nextWithdrawalRequestId = 1;
      nextBetId = 1;
      nextGameResultId = 1;
      nextMarketId = 1;
      nextGameTypeId = 1;
      nextTransactionId = 1;
    };
  };
};
