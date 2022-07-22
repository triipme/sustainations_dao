import Array "mo:base/Array";
import AsyncSource "mo:uuid/async/SourceV4";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Error "mo:base/Error";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import UUID "mo:uuid/UUID";

import Account "./plugins/Account";
import Moment "./plugins/Moment";
import Types "types";
import State "state";
import Ledger "./plugins/Ledger";

shared({caller = owner}) actor class SustainationsDAO(ledgerId : Text) = this {
  let transferFee : Nat64 = 10_000;
  let createProposalFee : Nat64 = 20_000;
  let voteFee : Nat64 = 20_000;

  var state : State.State = State.empty();

  private stable var profiles : [(Principal, Types.Profile)] = [];
  private stable var proposals : [(Text, Types.Proposal)] = [];
  private stable var transactions : [(Text, Types.TxRecord)] = [];
  private stable var userAgreements : [(Principal, Types.UserAgreement)] = [];
  private stable var memoryCardEngine = {
    games : [(Text, Types.MemoryCardEngineGame)] = [];
    stages : [(Text, Types.MemoryCardEngineStage)] = [];
    cards : [(Text, Types.MemoryCardEngineCard)] = [];
    players : [(Text, Types.MemoryCardEnginePlayer)] = [];
    rewards : [(Text, Types.MemoryCardEngineReward)] = [];
  };

  system func preupgrade() {
    Debug.print("Begin preupgrade");
    profiles := Iter.toArray(state.profiles.entries());
    proposals := Iter.toArray(state.proposals.entries());
    transactions := Iter.toArray(state.transactions.entries());
    userAgreements := Iter.toArray(state.userAgreements.entries());
    memoryCardEngine := {
      games = Iter.toArray(state.memoryCardEngine.games.entries());
      stages = Iter.toArray(state.memoryCardEngine.stages.entries());
      cards = Iter.toArray(state.memoryCardEngine.cards.entries());
      players = Iter.toArray(state.memoryCardEngine.players.entries());
      rewards = Iter.toArray(state.memoryCardEngine.rewards.entries());
    };
    Debug.print("End preupgrade");
  };

  system func postupgrade() {
    Debug.print("Begin postupgrade");
    for ((k, v) in Iter.fromArray(profiles)) {
      state.profiles.put(k, v);
    };
    for ((k, v) in Iter.fromArray(proposals)) {
      state.proposals.put(k, v);
    };
    for ((k, v) in Iter.fromArray(transactions)) {
      state.transactions.put(k, v);
    };
    for ((k, v) in Iter.fromArray(userAgreements)) {
      state.userAgreements.put(k, v);
    };
    for ((k, v) in Iter.fromArray(memoryCardEngine.games)) {
      state.memoryCardEngine.games.put(k, v);
    };
    for ((k, v) in Iter.fromArray(memoryCardEngine.stages)) {
      state.memoryCardEngine.stages.put(k, v);
    };
    for ((k, v) in Iter.fromArray(memoryCardEngine.cards)) {
      state.memoryCardEngine.cards.put(k, v);
    };
    for ((k, v) in Iter.fromArray(memoryCardEngine.players)) {
      state.memoryCardEngine.players.put(k, v);
    };
    for ((k, v) in Iter.fromArray(memoryCardEngine.rewards)) {
      state.memoryCardEngine.rewards.put(k, v);
    };
    Debug.print("End postupgrade");
  };

  system func heartbeat() : async () {
    await setOutDateProposals();
  };

  type Response<Ok> = Result.Result<Ok, Types.Error>;
  private let ledger : Ledger.Interface = actor(ledgerId);

  private func createUUID() : async Text {
    var ae = AsyncSource.Source();
    let id = await ae.new();
    UUID.toText(id);
  };

  public shared({ caller }) func getBalance() : async Ledger.ICP {
    let accountId = Account.accountIdentifier(
      Principal.fromActor(this), Account.principalToSubaccount(caller)
    );
    await ledger.account_balance({ account = accountId });
  };

  public func getSystemBalance() : async Ledger.ICP {
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount());
    await ledger.account_balance({ account = accountId });
  };

  public query func getSystemAddress() : async Blob {
    Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount())
  };

  type DashboardAnalysis = {
    userAgreement: Int;
    overdueProposal: Int;
    openProposal: Int;
    investedProposal: Int;
  };
  public query func dashboardAnalysis() : async Response<DashboardAnalysis> {
    let userAgreement = state.userAgreements.size();
    var overdueProposal = 0;
    var openProposal = 0;
    var investedProposal = 0;
    for (proposal in state.proposals.vals()) {
      if (proposal.status == #rejected) {
        overdueProposal += 1;
      } else {
        if (proposal.votesYes > 0) {
          investedProposal += 1;
        };
        if (proposal.status == #open) {
          openProposal += 1;
        };
      };
    };
    #ok({ userAgreement; overdueProposal; openProposal; investedProposal; });
  };

  public shared({ caller }) func submitAgreement() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    let agreement = state.userAgreements.get(caller);
    switch (agreement) {
      case null{
        let payload = {
          uid = Principal.toText(caller);
          timestamp = Time.now();
        };
        let result = state.userAgreements.put(caller, payload);
        let receipt = await rewardUserAgreement(caller);
        #ok("Success!");
      };
      case (? _v) {
        #ok("Success!");
      };
    }
  };

  type UserAgreementSerializer = {
    address : Text;
    timestamp : Time.Time;
  };
  public query func getUserAgreement(uid : Text) : async Response<UserAgreementSerializer> {
    let caller = Principal.fromText(uid);
    switch (state.userAgreements.get(caller)) {
      case null { #err(#NotFound) };
      case (? agreement) {
        let response = {
          address = Account.toText(
            Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller))
          );
          timestamp = agreement.timestamp;
        };
        #ok(response);
      };
    };
  };

  // Withdraw ICP from user's subaccount
  public shared({ caller }) func withdraw(amount: Nat64, address: Principal) : async Response<Nat64> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    let sourceAccount = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    // Check ledger for value
    let balance = await ledger.account_balance({ account = sourceAccount });
    let accountId = Account.accountIdentifier(address, Account.defaultSubaccount());

    // Transfer amount back to user
    let receipt = if (balance.e8s >= amount + transferFee) {
      await ledger.transfer({
        memo: Nat64    = 0;
        from_subaccount = ?Account.principalToSubaccount(caller);
        to = accountId;
        amount = { e8s = amount };
        fee = { e8s = transferFee };
        created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
      });
    } else {
      return #err(#BalanceLow);
    };

    switch receipt {
      case (#Err e) {
        Debug.print(debug_show e);
        return #err(#TransferFailure);
      };
      case _ {};
    };
    #ok(amount)
  };

  // Return the account ID specific to this user's subaccount
  public query({ caller }) func getDepositAddress() : async Text {
    Account.toText(
      Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller))
    );
  };

  type UserInfo = {
    principal : Text;
    depositAddress : Text;
    balance : Nat64;
    agreement : Bool;
  };
  public shared({ caller }) func getUserInfo() : async Response<UserInfo> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    let balance = await ledger.account_balance({ account = accountId });
    let agreement = switch (state.userAgreements.get(caller)) {
      case (null) { false };
      case _ {true};
    };
    let userInfo = {
      principal = Principal.toText(caller);
      depositAddress = Account.toText(
        Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller))
      );
      balance = balance.e8s;
      agreement;
    };
    #ok(userInfo);
  };

  // Transfer ICP from user's subaccount to system subaccount
  private func deposit(amount : Nat64, caller : Principal) : async Response<Nat64> {
    // Calculate target subaccount
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    // Check ledger for value
    let balance = await ledger.account_balance({ account = accountId });
    // Transfer to default subaccount
    let receipt = if (balance.e8s >= amount + transferFee + transferFee) {
      await ledger.transfer({
        memo: Nat64    = 0;
        from_subaccount = ?Account.principalToSubaccount(caller);
        to = Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount());
        amount = { e8s = amount + transferFee };
        fee = { e8s = transferFee };
        created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
      })
    } else {
      return #err(#BalanceLow);
    };

    switch receipt {
      case ( #Err _) {
        #err(#TransferFailure);
      };
      case (#Ok(bIndex)) {
        #ok(bIndex);
      };
    };
  };

  private func recordTransaction(
    caller : Principal,
    amount : Nat64,
    fromPrincipal : Principal, toPrincipal : Principal,
    refType : Types.Operation, refId : ?Text,
    blockIndex : Nat64
  ) : async () {
    let uuid : Text = await createUUID();
    let transaction : Types.TxRecord = {
      uuid;
      caller;
      refType;
      refId;
      blockIndex;
      fromPrincipal;
      toPrincipal;
      amount;
      fee = transferFee;
      timestamp = Time.now();
    };
    state.transactions.put(uuid, transaction);
  };

  // Get proposal static attributes
  type ProposalStaticAttributes = {
    categories : [Text];
    fundingTypes : [Text];
  };
  public query func proposalStaticAttributes() : async ProposalStaticAttributes {
    {
      categories = Types.proposalCategories;
      fundingTypes = Types.proposalFundingTypes;
    }
  };

  // Submit Proposal
  public shared({ caller }) func submitProposal(payload : Types.ProposalPayload) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    switch (await deposit(createProposalFee, caller)) {
      case (#ok(bIndex)) {
        let uuid = await createUUID();
        let proposal : Types.Proposal = {
          uuid;
          timestamp = Time.now();
          proposer = caller;
          payload;
          status = if (payload.dueDate <= Time.now()) {#rejected} else {#open};
          votesYes = 0;
          voters = List.nil();
        };
        // record transaction
        await recordTransaction(
          caller, createProposalFee, caller, Principal.fromActor(this),
          #createProposal, ?uuid, bIndex
        );
        state.proposals.put(uuid, proposal);
        #ok(uuid);
      };
      case (#err(error)) {
        #err(error);
      };
    };
  };

  public query({ caller }) func listProposals() : async Response<[Types.Proposal]> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    var list : [Types.Proposal] = [];
    for((_uuid, proposal) in state.proposals.entries()){
      list := Array.append<Types.Proposal>(list, [proposal]);
    };
    #ok(list);
  };

  public query({caller}) func getProposal(uuid : Text) : async Response<Types.Proposal> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    switch (state.proposals.get(uuid)) {
      case null { #err(#NotFound); };
      case (? proposal) { #ok(proposal); };
    };
  };

  public shared({ caller }) func destroyProposal(uuid : Text) : async Response<Text> {
    state.proposals.delete(uuid);
    #ok("Success");
  };

  // Votes Proposal
  public shared({ caller }) func vote(args: Types.VoteArgs) : async Response<Types.ProposalState> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    switch (state.proposals.get(args.proposalId)) {
      case null {#err(#NotFound)};
      case (?proposal) {
        var status = proposal.status;
        if (status != #open) {
          return #err(#ProposalIsNotOpened);
        };
        if (List.some(proposal.voters, func (voter : Types.Voter) : Bool = voter.uid == caller)) {
          return #err(#AlreadyVoted);
        };
        let voter = {
          uid = caller; vote = args.vote; timestamp = Time.now()
        };
        var votesYes = proposal.votesYes;
        let voters = List.push(voter, proposal.voters);
        if (args.vote == #yes) {
          // deposit vote fee
          switch (await deposit(voteFee, caller)) {
            case (#ok(bIndex)) {
              votesYes += voteFee;
              // record transaction
              await recordTransaction(
                caller, voteFee, caller, Principal.fromActor(this),
                #vote, ?proposal.uuid, bIndex
              );
              if (votesYes >= Nat64.fromNat(proposal.payload.fundingAmount)) {
                status := #approved;
                // refund to Proposer
                let refundAmount = createProposalFee + votesYes;
                let receipt = await refund(refundAmount, proposal.proposer);
                switch (receipt) {
                  case (#Err(error)) {
                    Debug.print(debug_show error);
                  };
                  case (#Ok(bIndex)) {
                    status := #succeeded;
                    // record transaction
                    await recordTransaction(
                      caller, refundAmount, Principal.fromActor(this), proposal.proposer,
                      #executeApprovedProposal, ?proposal.uuid, bIndex
                    );
                  };
                };
              };
            };
            case (#err(error)) {
              return #err(error);
            };
          };
        };
        let updatedProposal = {
          uuid = proposal.uuid;
          status;
          timestamp = proposal.timestamp;
          proposer = proposal.proposer;
          voters;
          votesYes;
          payload = proposal.payload;
        };
        let updated = state.proposals.replace(proposal.uuid, updatedProposal);
        #ok(status)
      };
    };
  };

  func refund(amount : Nat64, toPrincipal : Principal) : async Ledger.TransferResult {
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(toPrincipal));
    await ledger.transfer({
      memo: Nat64    = 0;
      from_subaccount = ?Account.defaultSubaccount();
      to = accountId;
      amount = { e8s = amount };
      fee = { e8s = transferFee };
      created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
    })
  };

  func refundVoters(proposal : Types.Proposal) : async () {
    for (voter in List.toArray(proposal.voters).vals()) {
      let receipt = await refund(voteFee, voter.uid);
      switch (receipt) {
        case (#Err(error)) {
          Debug.print(debug_show error);
        };
        case (#Ok(bIndex)) {
          // record transaction
          await recordTransaction(
            Principal.fromActor(this), voteFee, Principal.fromActor(this), voter.uid,
            #returnVoteFee, ?proposal.uuid, bIndex
          );
        };
      };
    };
  };

  func rewardUserAgreement(uid : Principal) : async () {
    let reward = createProposalFee + transferFee + transferFee;
    let receipt = await refund(reward, uid);
    switch (receipt) {
      case (#Err(error)) {
        Debug.print(debug_show error);
      };
      case (#Ok(bIndex)) {
        // record transaction
        await recordTransaction(
          Principal.fromActor(this), reward,
          Principal.fromActor(this), uid,
          #awardUserAgreement, ?Principal.toText(uid), bIndex
        );
      };
    };
  };

  public query({ caller }) func getTransactions() : async Response<[Types.TxRecord]> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    #ok(Iter.toArray(state.transactions.vals()));
  };

  func setOutDateProposals() : async () {
    for ((uuid, proposal) in state.proposals.entries()) {
      if (proposal.status == #open and proposal.payload.dueDate <= Time.now()) {
        let updated = {
          uuid = proposal.uuid;
          status = #rejected;
          timestamp = proposal.timestamp;
          proposer = proposal.proposer;
          voters = proposal.voters;
          votesYes = proposal.votesYes;
          payload = proposal.payload;
        };
        let replaced = state.proposals.replace(uuid, updated);
        await refundVoters(updated);
      };
    };
  };

  //initial owner -> admin
  public shared({caller}) func ownerSetFirstAdmin(principalText: Text, nameSet : ?Text) : async () {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    let userPrincipal = Principal.fromText(principalText);
    assert(Principal.equal(caller, owner));
    switch (state.profiles.get(userPrincipal)) {
      case (null) {
        let profile : Types.Profile = {
          username = nameSet;
          avatar = null;
          role = #admin;
        };
        state.profiles.put(userPrincipal, profile);
        Debug.print("created");
      };
      case (? admin) {
        Debug.print("exist");
      };
    };
  };

  //verify admin
  public shared({caller}) func isAdmin(userPrincipal : Principal) : async () {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    switch (state.profiles.get(userPrincipal)) {
      case null { throw Error.reject("NotFound") };
      case (? u) {
        switch (u.role) {
          case (#admin) {};
          case (#user) {
            throw Error.reject("NotAdmin");
          };
        };
      };
    };
  };

  public shared({caller}) func getAllProfiles() : async Response<[(Principal, Types.Profile)]> {
    try {
      await isAdmin(caller);
      #ok(Iter.toArray(state.profiles.entries()));
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  //Owner or Admin assign role
  public shared({caller}) func adminAssignRole(
    principalText : Text, 
    newRole : {#admin; #user}
  ) : async Response<()> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    let userPrincipal = Principal.fromText(principalText);
    try {
      await isAdmin(caller);
      switch (state.profiles.get(userPrincipal)) {
        case null { #err(#NotFound) };
        case (? prevProfile) {
          let profileUpdate = {
            username = prevProfile.username;
            avatar = prevProfile.avatar;
            role = newRole;
          };
          let updatedProfile = state.profiles.replace(userPrincipal, profileUpdate);
          #ok();
        };
      };
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  //check role
  public query({caller}) func whatRole(principalText : Text) : async Response<{#admin; #user}> {
    let userPrincipal = Principal.fromText(principalText);
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    switch (state.profiles.get(userPrincipal)) {
      case null { #err(#NotFound) };
      case (? prevProfile) {
        #ok(prevProfile.role);
      };
    };
  };

  /* MemoryCard */
  public shared({caller}) func memoryCardEngineImportExcel(data : [Types.MemoryCardEnginePatternItemImport]) : async Response<()>{
    try {
      await isAdmin(caller);
      for (V in Iter.fromArray(data)) {
        switch (state.memoryCardEngine.games.get(V.gameId)) {
          case null {
            let games : Types.MemoryCardEngineGame = {
              slug = V.gameSlug;
              image = V.gameImage;
              name = V.gameName;
              description = V.gameDescription;
              status = V.gameStatus;
            };
            state.memoryCardEngine.games.put(V.gameId, games);
          };
          case (? v) {};
        };
        switch (state.memoryCardEngine.stages.get(V.stageId)) {
          case null {
            let stages : Types.MemoryCardEngineStage = {
              gameId = V.gameId;
              name = V.stageName;
              order = V.stageOrder;
            };
            state.memoryCardEngine.stages.put(V.stageId, stages);
          };
          case (? v){};
        };
        switch (state.memoryCardEngine.cards.get(V.cardId)) {
          case null {
            let cards : Types.MemoryCardEngineCard = {
              stageId = V.stageId;
              cardType = V.cardType;
              data = V.cardData;
            };
            state.memoryCardEngine.cards.put(V.cardId, cards);
          };
          case (? v){};
        };
      };
      #ok();
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  public shared({caller}) func memoryCardEngineAllGames() : async Response<[(Text, Types.MemoryCardEngineGame)]>{
    try {
      await isAdmin(caller);
      #ok(Iter.toArray(state.memoryCardEngine.games.entries()));
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  public shared({caller}) func memoryCardEngineGameChangeStatus(gameId : Text, newStatus : Bool) : async Response<()> {
    try {
      await isAdmin(caller);
      switch (state.memoryCardEngine.games.get(gameId)) {
        case null #err(#NotFound);
        case (? prev) {
          let gameUpdate : Types.MemoryCardEngineGame = {
            slug = prev.slug;  //unique
            name = prev.name;
            image = prev.image;
            description = prev.description;
            status = newStatus;
          };
          let _ = state.memoryCardEngine.games.replace(gameId, gameUpdate);
          #ok();
        };
      };
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  public shared({caller}) func memoryCardEngineAllStages() : async Response<[(Text, Types.MemoryCardEngineStage)]>{
    try {
      await isAdmin(caller);
      #ok(Iter.toArray(state.memoryCardEngine.stages.entries()));
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  public shared({caller}) func memoryCardEngineAllCards() : async Response<[(Text, Types.MemoryCardEngineCard)]>{
    try {
      await isAdmin(caller);
      #ok(Iter.toArray(state.memoryCardEngine.cards.entries()));
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  /* Client query data memoryCardEngine */
  public query({caller}) func memoryCardEngineSlugEnabled() : async Response<[(Text, Types.MemoryCardEngineGame)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    var result : [(Text, Types.MemoryCardEngineGame)] = [];
    let games = state.memoryCardEngine.games.entries();
    for ((K, V) in state.memoryCardEngine.games.entries()) {
      if ((V.status == true)) {
        result := Array.append(result, [(K, V)]);
      }
    };
    #ok(result);
  };

  public query({caller}) func memoryCardEngineStages(gameId : Text) : async Response<[?(Text, Types.MemoryCardEngineStage)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    var stages : [?(Text, Types.MemoryCardEngineStage)] = [];
    for ((K, V) in state.memoryCardEngine.stages.entries()) {
      if (V.gameId == gameId) {
        stages := Array.append(stages, [?(K, V)]);
      }
    };
    #ok(stages);
  };

  public query({caller}) func memoryCardEngineCards(stageId : Text) : async Response<[?(Text, Types.MemoryCardEngineCard)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    var cards : [?(Text, Types.MemoryCardEngineCard)] = [];
    for ((K, V) in state.memoryCardEngine.cards.entries()) {
      if (V.stageId == stageId) {
        cards := Array.append(cards, [?(K, V)]);
      }
    };
    #ok(cards);
  };

  public query func memoryCardEngineGetPlayer(caller : Principal, gameId : Text, gameSlug : Text) : async Response<(Text, Types.MemoryCardEnginePlayer)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    let accountId = Account.toText(Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller)));
    var player : ?(Text, Types.MemoryCardEnginePlayer) = null;
    let players = state.memoryCardEngine.players.entries();
    label playerLabel loop {
      switch (players.next()) {
        case (? (K, V)) {
          if (  
            Int.greater(Moment.diff(?V.createdAt), 0) and
            Text.equal(V.aId, accountId) and
            Text.equal(V.gameId, gameId) and
            Text.equal(V.gameSlug, gameSlug)
          ) {
            player := ?(K, V);
            break playerLabel;
          }
        };
        case (null) break playerLabel;
      }
    };
    switch (player) {
      case null #err(#NotFound);
      case (?V) #ok(V);
    };
  };

  public shared({caller}) func memoryCardEngineSetPlayer({
    turn : Nat;
    gameId : Text;
    timing : Float;
    stageId : Text;
    playerId : ?Text;
    gameSlug : Text;
  }) : async Response<()> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    let accountId = Account.toText(Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller)));
    switch (playerId) {
      case null {
        //first time - stage 1
        let player : Types.MemoryCardEnginePlayer = {
          aId = accountId;
          gameId;
          gameSlug;
          history = [{
            stageId;
            turn;
            timing;
          }];
          createdAt = Moment.now();
          updatedAt = Moment.now();
        };
        state.memoryCardEngine.players.put(await createUUID(), player);
        #ok();
      };
      case (?pid) {
        switch (await memoryCardEngineGetPlayer(caller, gameId, gameSlug)) {
          case (#err(error)) {
            #err(error);
          };
          case (#ok(K, oldData)) {
            //stage 2,3
            let found = 
              Array.find<{
                stageId : Text;
                turn : Nat;
                timing : Float;
              }>(oldData.history, func (h) : Bool {
              Text.equal(stageId, h.stageId);
            });
            switch (found) {
              case null {
                let replacePlayer : Types.MemoryCardEnginePlayer = {
                  aId = oldData.aId;
                  gameId;
                  gameSlug;
                  history = Array.append(oldData.history, [{
                    stageId;
                    turn;
                    timing;
                  }]);
                  createdAt = oldData.createdAt;
                  updatedAt = Moment.now();
                };
                let _ = state.memoryCardEngine.players.replace(pid, replacePlayer);
                #ok();
              };
              case (?V) {
                #err(#AlreadyExisting);
              }
            }
          }
        }
      }
    };
  };

  public query({caller}) func memoryCardEngineListOfDay(gameId : Text, gameSlug : Text) : async Response<[?Types.MemoryCardEnginePlayer]>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    var listTop : [?Types.MemoryCardEnginePlayer] = [];
    var stagesSize : Int = 0;
    for (V in state.memoryCardEngine.stages.vals()){
      if (V.gameId == gameId) stagesSize += 1;
    };
    for((K, V) in state.memoryCardEngine.players.entries()) {
      if(
        Int.greater(Moment.diff(?V.createdAt), 0) and
        Iter.size(Iter.fromArray(V.history)) == stagesSize and
        Text.equal(gameSlug, V.gameSlug) and
        Text.equal(gameId, V.gameId)
      ) {
        listTop := Array.append(listTop, [?V]);
      }
    };
    #ok(listTop);
  };

  public query({caller}) func memoryCardEngineListOfYesterday(gameId : Text, gameSlug : Text) : async Response<[?(Text, Types.MemoryCardEnginePlayer)]>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized");  //isNotAuthorized
    };
    var listTop : [?(Text,Types.MemoryCardEnginePlayer)] = [];
    var stagesSize : Int = 0;
    for (V in state.memoryCardEngine.stages.vals()){
      if (V.gameId == gameId) stagesSize += 1;
    };
    for((K, V) in state.memoryCardEngine.players.entries()) {
      if(
        Moment.yesterday(V.createdAt) and
        Iter.size(Iter.fromArray(V.history)) == stagesSize and
        Text.equal(gameSlug, V.gameSlug) and
        Text.equal(gameId, V.gameId)
      ) {
        listTop := Array.append(listTop, [?(K, V)]);
      }
    };
    #ok(listTop);
  };

  public shared({caller}) func memoryCardEngineListAll(gameId : Text, gameSlug : Text) : async Response<[Types.MemoryCardEnginePlayer]>{
    try {
      await isAdmin(caller);
      var listTop : [Types.MemoryCardEnginePlayer] = [];
      for(V in state.memoryCardEngine.players.vals()) {
        if(Text.equal(gameSlug, V.gameSlug) and Text.equal(gameId, V.gameId)) {
          listTop := Array.append(listTop, [V]);
        }
      };
      #ok(listTop);
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  public shared({caller}) func memoryCardEngineCheckReward(id : Text) : async Response<?Types.MemoryCardEngineReward>{
    try {
      await isAdmin(caller);
      #ok(state.memoryCardEngine.rewards.get(id));
    } catch (e) {
      #err(#SomethingWrong);
    }
  };

  public shared({caller}) func memoryCardEngineReward(
    playerId : Text, 
    reward : Float, 
    uid : Principal
  ) : async Response<()>{
    try {
      await isAdmin(caller);
      let rewardAmount : Nat64 = Int64.toNat64(Float.toInt64(reward * (10 ** 8)));
      switch (await refund(rewardAmount, uid)) {
        case (#Err(error)) {
          Debug.print(debug_show error);
          #err(#SomethingWrong);
        };
        case (#Ok(bIndex)) {
          // record transaction
          let uuid = await createUUID();
          let recordReward = {
            reward = rewardAmount;
            playerId;
            createdAt = Moment.now();
          };
          // record transaction
          await recordTransaction(
            Principal.fromActor(this), 
            rewardAmount, 
            Principal.fromActor(this), 
            uid,
            #rewardTop, 
            ?uuid, 
            bIndex
          );
          state.memoryCardEngine.rewards.put(uuid, recordReward); //put to state rewards
          #ok();
        };
      };
    } catch (e) {
      #err(#SomethingWrong);
    }
  };
};
