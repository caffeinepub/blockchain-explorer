import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type DepositRequestId = Nat;
  type WithdrawalRequestId = Nat;
  type BetId = Nat;
  type GameResultId = Nat;
  type MarketId = Nat;
  type GameTypeId = Nat;
  type TransactionId = Nat;

  type User = {
    id : Principal;
    username : Text;
    balance : Nat;
    totalWinnings : Nat;
    totalDeposits : Nat;
    totalWithdrawals : Nat;
    createdAt : Int;
  };

  public type UserProfile = {
    username : Text;
    balance : Nat;
    totalWinnings : Nat;
    totalDeposits : Nat;
    totalWithdrawals : Nat;
  };

  type DepositRequest = {
    id : DepositRequestId;
    userId : Principal;
    amount : Nat;
    utr : Text;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
    reviewedAt : ?Int;
    reviewer : ?Principal;
  };

  type WithdrawalRequest = {
    id : WithdrawalRequestId;
    userId : Principal;
    amount : Nat;
    upiId : Text;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
    reviewedAt : ?Int;
    reviewer : ?Principal;
  };

  type BetType = {
    #single;
    #jodi;
    #singlePanna;
    #doublePanna;
    #triplePanna;
  };

  type Bet = {
    id : BetId;
    userId : Principal;
    gameTypeId : GameTypeId;
    betType : BetType;
    number : Text;
    amount : Nat;
    createdAt : Int;
    status : { #pending; #won; #lost };
    payout : ?Nat;
    marketId : MarketId;
  };

  type GameResult = {
    id : GameResultId;
    marketId : MarketId;
    openNumber : Text;
    closeNumber : Text;
    jodi : Text;
    singlePanna : [Nat];
    doublePanna : [Nat];
    triplePanna : [Nat];
    declaredAt : Int;
  };

  public type Market = {
    id : MarketId;
    name : Text;
    openTime : Int;
    closeTime : Int;
    status : { #open; #closed };
    createdAt : Int;
  };

  public type GameType = {
    id : GameTypeId;
    name : Text;
    marketId : MarketId;
    betTypes : [BetType];
    status : { #open; #closed };
    createdAt : Int;
  };

  public type Transaction = {
    id : TransactionId;
    userId : Principal;
    amount : Nat;
    transactionType : {
      #depositRequest : DepositRequestId;
      #withdrawalRequest : WithdrawalRequestId;
      #betPlacement : BetId;
      #winningPayout : BetId;
    };
    createdAt : Int;
  };

  public type Result = {
    marketId : Text;
    openNumber : Text;
    closeNumber : Text;
    jodi : Text;

    time : Int;
  };

  public type MarketResults = {
    marktetId : Text;
    results : [Result];
  };

  public type TimeRange = {
    timeStart : Int;
    timeEnd : Int;
  };

  let depositRequests = Map.empty<DepositRequestId, DepositRequest>();
  let withdrawalRequests = Map.empty<WithdrawalRequestId, WithdrawalRequest>();
  let bets = Map.empty<BetId, Bet>();
  let gameResults = Map.empty<GameResultId, GameResult>();
  let markets = Map.empty<MarketId, Market>();
  let gameTypes = Map.empty<GameTypeId, GameType>();
  let userTransactions = Map.empty<Principal, List.List<Transaction>>();
  let resultsStore = Map.empty<Text, List.List<Result>>();
  var nextDepositRequestId = 1;
  var nextWithdrawalRequestId = 1;
  var nextBetId = 1;
  var nextGameResultId = 1;
  var nextMarketId = 1;
  var nextGameTypeId = 1;
  var nextTransactionId = 1;

  // Register a new user. Open to any authenticated (non-anonymous) caller.
  // Anonymous principals cannot register.
  public shared ({ caller }) func registerUser(username : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot register");
    };
    Runtime.trap("User registration is currently not supported.");
  };

  // Required by frontend: get the caller's own profile.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    Runtime.trap("User profile retrieval is currently not supported.");
  };

  // Required by frontend: save the caller's own profile (username update).
  public shared ({ caller }) func saveCallerUserProfile(_ : UserProfile) : async () {
    Runtime.trap("User profile saving is currently not supported.");
  };

  // Get a user's profile. Caller can view their own profile; admins can view any profile.
  public query ({ caller }) func getUserProfile(_ : Principal) : async ?UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile. ");
    };
    Runtime.trap("User profile retrieval is currently not supported.");
  };

  // Submit a deposit request. Only registered users can do this.
  public shared ({ caller }) func submitDepositRequest(_amount : Nat, _utr : Text) : async DepositRequestId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit deposit requests");
    };
    Runtime.trap("Deposit requests are currently not supported. ");
  };

  // Submit a withdrawal request. Only registered users can do this.
  public shared ({ caller }) func submitWithdrawalRequest(_amount : Nat, _upiId : Text) : async WithdrawalRequestId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit withdrawal requests");
    };
    Runtime.trap("Withdrawal requests are currently not supported. ");
  };

  // Place a bet. Only registered users can do this.
  public shared ({ caller }) func placeBet(_gameTypeId : GameTypeId, _betType : BetType, _number : Text, _amount : Nat) : async BetId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can place bets");
    };
    Runtime.trap("Bet placement is currently not supported. ");
  };

  // Declare a game result. Admin only.
  public shared ({ caller }) func declareGameResult(
    _marketId : MarketId,
    _openNumber : Text,
    _closeNumber : Text,
    _jodi : Text,
    _singlePanna : [Nat],
    _doublePanna : [Nat],
    _triplePanna : [Nat],
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can declare game results");
    };
    Runtime.trap("Game result declaration is currently not supported. ");
  };

  // Create a market. Admin only.
  public shared ({ caller }) func createMarket(_name : Text, _openTime : Int, _closeTime : Int) : async MarketId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create markets");
    };
    Runtime.trap("Market creation is currently not supported. ");
  };

  // Create a game type. Admin only.
  public shared ({ caller }) func createGameType(_name : Text, _marketId : MarketId, _betTypes : [BetType]) : async GameTypeId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create game types");
    };
    Runtime.trap("Game type creation is currently not supported. ");
  };

  // Update market status. Admin only.
  public shared ({ caller }) func updateMarketStatus(_marketId : MarketId, _status : { #open; #closed }) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update market status");
    };
    Runtime.trap("Market status update is currently not supported. ");
  };

  // Get all markets. Public read.
  public query func getAllMarkets() : async [Market] {
    markets.values().toArray();
  };

  // Get all game types. Public read.
  public query func getAllGameTypes() : async [GameType] {
    gameTypes.values().toArray();
  };

  // Get a specific game type. Public read.
  public query func getGameType(gameTypeId : GameTypeId) : async ?GameType {
    gameTypes.get(gameTypeId);
  };

  // Get bets for a user. Caller can view their own bets; admins can view any user's bets.
  public query ({ caller }) func getUserBets(user : Principal) : async [Bet] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bets");
    };
    let allBets = bets.values().toArray();
    allBets.filter(func(b) { b.userId == user });
  };

  // Get bet history for a user. Caller can view their own bets; admins can view any user's bets.
  public query ({ caller }) func getBetHistory(user : Principal) : async [Bet] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bet history");
    };
    let allBets = bets.values().toArray();
    allBets.filter(func(b) { b.userId == user });
  };

  // Get transactions for a user. Caller can view their own transactions; admins can view any user's transactions.
  public query ({ caller }) func getUserTransactions(user : Principal) : async [Transaction] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions");
    };
    switch (userTransactions.get(user)) {
      case (null) { [] };
      case (?txList) { txList.toArray() };
    };
  };

  // Get transaction history for a user. Caller can view their own transactions; admins can view any user's transactions.
  public query ({ caller }) func getTransactionHistory(user : Principal) : async [Transaction] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transaction history");
    };
    switch (userTransactions.get(user)) {
      case (null) { [] };
      case (?txList) { txList.toArray() };
    };
  };

  // Approve a deposit request. Admin only.
  public shared ({ caller }) func approveDepositRequest(_requestId : DepositRequestId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve deposits");
    };
    Runtime.trap("Deposit approval is currently not supported. ");
  };

  // Approve a withdrawal request. Admin only.
  public shared ({ caller }) func approveWithdrawalRequest(_requestId : WithdrawalRequestId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve withdrawals");
    };
    Runtime.trap("Withdrawal approval is currently not supported. ");
  };

  // Reject a deposit request. Admin only.
  public shared ({ caller }) func rejectDepositRequest(_requestId : DepositRequestId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject deposits");
    };
    Runtime.trap("Deposit rejection is currently not supported. ");
  };

  // Reject a withdrawal request. Admin only.
  public shared ({ caller }) func rejectWithdrawalRequest(_requestId : WithdrawalRequestId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject withdrawals");
    };
    Runtime.trap("Withdrawal rejection is currently not supported. ");
  };

  // Get pending deposit requests. Admin only.
  public query ({ caller }) func getPendingDepositRequests() : async [DepositRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending deposit requests");
    };
    let allRequests = depositRequests.values().toArray();
    allRequests.filter(func(r) { r.status == #pending });
  };

  // Get pending withdrawal requests. Admin only.
  public query ({ caller }) func getPendingWithdrawalRequests() : async [WithdrawalRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending withdrawal requests");
    };
    let allRequests = withdrawalRequests.values().toArray();
    allRequests.filter(func(r) { r.status == #pending });
  };

  // Get platform statistics. Admin only.
  public query ({ caller }) func getPlatformStats() : async {
    totalBets : Nat;
    totalPayout : Nat;
    activeUsers : Nat;
    totalDeposits : Nat;
    totalWithdrawals : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform statistics");
    };
    let allBets = bets.values().toArray();
    var totalPayout : Nat = 0;
    for (bet in allBets.vals()) {
      switch (bet.payout) {
        case (null) {};
        case (?amount) { totalPayout += amount };
      };
    };
    {
      totalBets = allBets.size();
      totalPayout;
      activeUsers = 0;
      totalDeposits = 0;
      totalWithdrawals = 0;
    };
  };

  // Add a declared game result for a market. Admin only.
  public shared ({ caller }) func addResult(
    market : Text,
    openNumber : Text,
    closeNumber : Text,
    jodi : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add results");
    };

    let result : Result = {
      marketId = market;
      openNumber;
      closeNumber;
      jodi;
      time = Time.now();
    };

    let currentResults = switch (resultsStore.get(market)) {
      case (null) { List.empty<Result>() };
      case (?results) { results };
    };

    currentResults.add(result);
    resultsStore.add(market, currentResults);
  };

  // Get declared game results for specified markets. Public read - results are public information.
  public query func getResults(
    markets : [Text],
    _range : ?TimeRange,
  ) : async [MarketResults] {
    // Declared game results are public information; no authorization check required.
    let marketResultsList = List.empty<MarketResults>();

    for (market in markets.values()) {
      switch (resultsStore.get(market)) {
        case (null) {};
        case (?results) {
          let marketResult : MarketResults = {
            marktetId = market;
            results = results.toArray();
          };
          marketResultsList.add(marketResult);
        };
      };
    };

    marketResultsList.toArray();
  };
};
