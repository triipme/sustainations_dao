import Array "mo:base/Array";
import AsyncSource "mo:uuid/async/SourceV4";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import UUID "mo:uuid/UUID";

import Account "./plugins/Account";
import Types "types";
import State "state";
import Ledger "./plugins/Ledger";
import RS "./models/RefillStation";
import CharacterClass "./game/characterClass";
import Character "./game/character";
import CharacterTakeOption "./game/characterTakeOption";
import Quest "./game/quest";
import Item "./game/item";
import QuestItem "./game/questItem";
import Event "./game/event";
import EventOption "./game/eventOption";
import Gear "./game/gear";
import GearClass "./game/gearClass";
import GearRarity "./game/gearRarity";
import GearSubstat "./game/gearSubstat";
import Material "./game/material";

shared({caller = owner}) actor class SustainationsDAO(ledgerId : ?Text) = this {
  stable var transferFee : Nat64 = 10_000;
  stable var createProposalFee : Nat64 = 20_000;
  stable var voteFee : Nat64 = 20_000;
  stable var treasuryContribution : Float = 0.03;

  var state : State.State = State.empty();

  private stable var profiles : [(Principal, Types.Profile)] = [];
  private stable var proposals : [(Text, Types.Proposal)] = [];
  private stable var transactions : [(Text, Types.TxRecord)] = [];
  private stable var userAgreements : [(Principal, Types.UserAgreement)] = [];
  private stable var currencies : [(Text, Types.Currency)] = [];
  private stable var refillBrand = {
    brands : [(Text, Types.RefillBrand)] = [];
    managers : [(Principal, Types.RBManager)] = [];
    stations : [(Text, Types.RBStation)] = [];
    categories : [(Text, Types.RBCategory)] = [];
    tags : [(Text, Types.RBTag)] = [];
    productUnits : [(Text, Types.RBProductUnit)] = [];
    products : [(Text, Types.RBProduct)] = [];
    orders : [(Text, Types.RBOrder)] = [];
  };
  private stable var characterClasses : [(Int, Types.CharacterClass)] = [];
  private stable var characters : [(Text, Types.Character)] = [];
  private stable var characterTakeOptions : [(Int, Types.CharacterTakeOption)] = [];
  private stable var quests : [(Int, Types.Quest)] = [];
  private stable var items : [(Int, Types.Item)] = [];
  private stable var questItems: [(Int, Types.QuestItem)] = [];
  private stable var events : [(Int, Types.Event)] = [];
  private stable var eventOptions : [(Int, Types.EventOption)] = [];
  private stable var gears : [(Int, Types.Gear)] = [];
  private stable var gearClasses : [(Int, Types.GearClass)] = [];
  private stable var gearRarities : [(Int, Types.GearRarity)] = [];
  private stable var gearSubstats : [(Int, Types.GearSubstat)] = [];
  private stable var materials : [(Int, Types.Material)] = [];
  private stable var inventories : [(Int, Types.Inventory)] = [];

  system func preupgrade() {
    Debug.print("Begin preupgrade");
    profiles := Iter.toArray(state.profiles.entries());
    proposals := Iter.toArray(state.proposals.entries());
    transactions := Iter.toArray(state.transactions.entries());
    userAgreements := Iter.toArray(state.userAgreements.entries());
    currencies := Iter.toArray(state.currencies.entries());
    refillBrand := {
      brands = Iter.toArray(state.refillBrand.brands.entries());
      managers = Iter.toArray(state.refillBrand.managers.entries());
      stations = Iter.toArray(state.refillBrand.stations.entries());
      categories = Iter.toArray(state.refillBrand.categories.entries());
      tags = Iter.toArray(state.refillBrand.tags.entries());
      productUnits = Iter.toArray(state.refillBrand.productUnits.entries());
      products = Iter.toArray(state.refillBrand.products.entries());
      orders = Iter.toArray(state.refillBrand.orders.entries());
    };
    characterClasses := Iter.toArray(state.characterClasses.entries());
    characters := Iter.toArray(state.characters.entries());
    characterTakeOptions := Iter.toArray(state.characterTakeOptions.entries());
    quests := Iter.toArray(state.quests.entries());
    items := Iter.toArray(state.items.entries());
    questItems := Iter.toArray(state.questItems.entries());
    events := Iter.toArray(state.events.entries());
    eventOptions := Iter.toArray(state.eventOptions.entries());
    gears := Iter.toArray(state.gears.entries());
    gearClasses := Iter.toArray(state.gearClasses.entries());
    gearRarities := Iter.toArray(state.gearRarities.entries());
    gearSubstats := Iter.toArray(state.gearSubstats.entries());
    materials := Iter.toArray(state.materials.entries());
    inventories := Iter.toArray(state.inventories.entries());
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
    for ((k, v) in Iter.fromArray(currencies)) {
      state.currencies.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.brands)) {
      state.refillBrand.brands.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.managers)) {
      state.refillBrand.managers.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.stations)) {
      state.refillBrand.stations.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.categories)) {
      state.refillBrand.categories.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.tags)) {
      state.refillBrand.tags.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.productUnits)) {
      state.refillBrand.productUnits.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.products)) {
      state.refillBrand.products.put(k, v);
    };
    for ((k, v) in Iter.fromArray(refillBrand.orders)) {
      state.refillBrand.orders.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characterClasses)) {
      state.characterClasses.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characters)) {
      state.characters.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characterTakeOptions)) {
      state.characterTakeOptions.put(k, v);
    };
    for ((k, v) in Iter.fromArray(quests)) {
      state.quests.put(k, v);
    };
    for ((k, v) in Iter.fromArray(items)) {
      state.items.put(k, v);
    };
    for ((k, v) in Iter.fromArray(questItems)) {
      state.questItems.put(k, v);
    };
    for ((k, v) in Iter.fromArray(events)) {
      state.events.put(k, v);
    };
    for ((k, v) in Iter.fromArray(eventOptions)) {
      state.eventOptions.put(k, v);
    };
    for ((k, v) in Iter.fromArray(gears)) {
      state.gears.put(k, v);
    };
    for ((k, v) in Iter.fromArray(gearClasses)) {
      state.gearClasses.put(k, v);
    };
    for ((k, v) in Iter.fromArray(gearRarities)) {
      state.gearRarities.put(k, v);
    };
    for ((k, v) in Iter.fromArray(gearSubstats)) {
      state.gearSubstats.put(k, v);
    };
    for ((k, v) in Iter.fromArray(materials)) {
      state.materials.put(k, v);
    };
    for ((k, v) in Iter.fromArray(inventories)) {
      state.inventories.put(k, v);
    };
    Debug.print("End postupgrade");
  };

  system func heartbeat() : async () {
    await setOutDateProposals();
  };

  type Response<Ok> = Result.Result<Ok, Types.Error>;
  private let ledger : Ledger.Interface = actor(Option.get(ledgerId, "ryjl3-tyaaa-aaaaa-aaaba-cai"));

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
    userAgreement : Nat;
    projects : {
      overdue : Nat;
      opening : Nat;
      invested : Nat;
    };
    products : {
      overdue : Nat;
      opening : Nat;
      invested : Nat;
    };
  };
  public query func dashboardAnalysis() : async Response<DashboardAnalysis> {
    var overdueProjects : Nat = 0;
    var openingProjects : Nat = 0;
    var investedProjects : Nat = 0;
    var overdueProducts : Nat = 0;
    var openingProducts : Nat = 0;
    var investedProducts : Nat = 0;
    for (proposal in state.proposals.vals()) {
      if (proposal.status == #rejected) {
        if (proposal.proposalType == ?#product) {
          overdueProducts += 1;
        } else {
          overdueProjects += 1;
        }
      } else {
        if (proposal.votesYes > 0) {
          if (proposal.proposalType == ?#product) {
            investedProducts += 1;
          } else {
            investedProjects += 1;
          }
        };
        if (proposal.status == #open) {
          if (proposal.proposalType == ?#product) {
            openingProducts += 1;
          } else {
            openingProjects += 1;
          }
        };
      };
    };
    #ok({
      userAgreement= state.userAgreements.size();
      projects = {
        overdue = overdueProjects;
        opening = openingProjects;
        invested = investedProjects;
      };
      products = {
        overdue = overdueProducts;
        opening = openingProducts;
        invested = investedProducts;
      };
    });
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
        let profile = state.profiles.put(caller, {
          username = null;
          avatar = null;
          phone = null;
          role = #user;
        });
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
    depositAddress : Text;
    balance : Nat64;
    agreement : Bool;
    role : Types.Role;
    brandId : ?Text;
  };
  public shared({ caller }) func getUserInfo() : async Response<UserInfo> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    let balance = await ledger.account_balance({ account = accountId });
    let agreement = switch (state.userAgreements.get(caller)) {
      case (null) { false };
      case _ { true };
    };
    let role = switch (state.profiles.get(caller)) {
      case (null) { #user };
      case (? profile) { profile.role };
    };
    let brandId = switch (state.refillBrand.managers.get(caller)) {
      case (null) { null };
      case (? manager) { ?manager.brandId };
    };
    let userInfo = {
      depositAddress = Account.toText(
        Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller))
      );
      balance = balance.e8s;
      agreement;
      role;
      brandId;
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
  public query func proposalStaticAttributes(
    proposalType : Types.ProposalType
  ) : async ProposalStaticAttributes {
    let categories = if (proposalType == #product) {
      Types.refillProductCategories;
    } else {
      Types.proposalCategories
    };
    {
      categories;
      fundingTypes = Types.proposalFundingTypes;
    }
  };

  // Submit Proposal
  public shared({ caller }) func submitProposal(
    payload : Types.ProposalPayload, proposalType : Types.ProposalType
  ) : async Response<Text> {
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
          proposalType = ?proposalType;
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

  public query({ caller }) func listProposals(
    proposalType : Types.ProposalType
  ) : async Response<[Types.Proposal]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    var list : [Types.Proposal] = [];
    for ((_uuid, proposal) in state.proposals.entries()) {
      if (proposal.status == #open) {
        let pType = Option.get(proposal.proposalType, #project);
        if (pType == proposalType) {
          list := Array.append<Types.Proposal>(list, [proposal]);
        };
      };
    };
    #ok(list);
  };

  public query({caller}) func getProposal(uuid : Text) : async Response<Types.Proposal> {
    if (Principal.toText(caller) == "2vxsx-fae") {
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
          proposalType = proposal.proposalType;
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
    if (Principal.toText(caller) == "2vxsx-fae") {
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
          proposalType = proposal.proposalType;
          payload = proposal.payload;
        };
        let replaced = state.proposals.replace(uuid, updated);
        await refundVoters(updated);
      };
    };
  };

  private func isAdmin(caller : Principal) : Bool {
    if (caller == owner) { return true; };
    switch (state.profiles.get(caller)) {
      case (null) { return false };
      case (? profile) { return profile.role == #admin };
    };
  };

  // === For System Admin ===
  public shared({ caller }) func setAdmin(principal : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      let admin = Principal.fromText(principal);
      switch (state.profiles.get(admin)) {
        case (null) {
          state.profiles.put(admin, {
            username = null;
            avatar = null;
            phone = null;
            role = #admin;
          });
        };
        case (?profile) {
          let newAdmin = state.profiles.replace(admin, {
            username = profile.username;
            avatar = profile.avatar;
            phone = profile.phone;
            role = #admin;
          });
        };
      };
      #ok("Success")
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared({ caller }) func setCurrency(payload : Types.Currency) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      return #err(#AdminRoleRequired);
    };

    switch (state.currencies.get(payload.code)) {
      case (null) { state.currencies.put(payload.code, payload); };
      case _ { let currency = state.currencies.replace(payload.code, payload); };
    };
    #ok(payload.code);
  };

  public query func listCurrencies() : async Response<[Types.Currency]> {
    #ok(Iter.toArray(state.currencies.vals()));
  };

  public shared({ caller }) func createRefillBrand(
    payload : Types.RefillBrand, owner : Text
  ) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      return #err(#AdminRoleRequired);
    };

    let uuid = await createUUID();
    state.refillBrand.brands.put(uuid, payload);
    state.refillBrand.managers.put(
      Principal.fromText(owner),
      { brandId = uuid; role = #owner }
    );
    #ok(uuid);
  };

  public shared({ caller }) func updateRefillBrand(
    uuid : Text,
    payload : Types.RefillBrand
  ) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    let result = switch (state.refillBrand.brands.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (? brand) {
        let manager = Option.get(state.refillBrand.managers.get(caller), {
          brandId = ""; role = "";
        });
        // required system admin role or brand's owner
        if (isAdmin(caller) == true or (manager.brandId == uuid and manager.role == #owner)) {
          let updated = state.refillBrand.brands.replace(uuid, payload);
          #ok(uuid);
        } else {
          #err(#AdminRoleRequired);
        };
      };
    };
    return result;
  };

  public query func listRefillBrands() : async Response<[(Text, Types.RefillBrand)]> {
    #ok(Iter.toArray(state.refillBrand.brands.entries()));
  };

  // === For Refill Brand's Owner/Staff ===
  public shared({ caller }) func setRBManager(principal : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let manager = Principal.fromText(principal);
    switch (state.refillBrand.managers.get(manager)) {
      case (null) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#OwnerRoleRequired); };
          case (?owner) {
            if (owner.role == #owner) {
              state.refillBrand.managers.put(
                manager, {
                  brandId = owner.brandId;
                  role = #staff;
                }
              );
              #ok("Success");
            } else {
              #err(#OwnerRoleRequired);
            };
          };
        };
      };
      case _ { #err(#AlreadyExisting) };
    };
  };

  public shared({ caller }) func deleteRBManager(principal : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#OwnerRoleRequired) };
      case (?owner) {
        if (owner.role == #owner) {
          let user = Principal.fromText(principal);
          switch (state.refillBrand.managers.get(user)) {
            case (null) { #err(#NotFound); };
            case (?manager) {
              if (manager.brandId == owner.brandId) {
                state.refillBrand.managers.delete(user);
                #ok("Success");
              } else {
                #err(#NotFound);
              };
            };
          };
        } else {
          #err(#OwnerRoleRequired);
        };
      };
    };
  };

  public query({ caller }) func listRBManagers() : async Response<[(Text, RS.ManagerRole)]> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#OwnerRoleRequired) };
      case (?owner) {
        if (owner.role == #owner) {
          var results : [(Text, RS.ManagerRole)] = [];
          for ((principal, manager) in state.refillBrand.managers.entries()) {
            results := Array.append<(Text, RS.ManagerRole)>(results, [(Principal.toText(principal), manager.role)]);
          };
          #ok(results);
        } else {
          #err(#OwnerRoleRequired);
        };
      };
    };
  };

  func setRBStation(brandId : Text, payload : Types.RBStation, uuid : ?Text) : async Text {
    let stationPayload = {
      brandId;
      uid = payload.uid;
      name = payload.name;
      phone = payload.phone;
      address = payload.address;
      latitude = payload.latitude;
      longitude = payload.longitude;
      activate = payload.activate;
    };
    let id = Option.get(uuid, await createUUID());
    state.refillBrand.stations.put(id, stationPayload);
    return id;
  };

  public shared({ caller }) func createRBStation(
    payload : Types.RBStation
  ) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBStation(manager.brandId, payload, null);
        return #ok(uuid);
      };
    };
  };

  public shared({ caller }) func importRBStations(
    payloads : [Types.RBStation]
  ) : async Response<[Text]> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        var uuids : [Text] = [];
        for (payload in Iter.fromArray(payloads)) {
          let uuid = await setRBStation(manager.brandId, payload, null);
          uuids := Array.append<Text>(uuids, [uuid]);
        };
        return #ok(uuids);
      };
    };
  };

  public shared({ caller }) func updateRBStation(
    uuid : Text, payload : Types.RBStation
  ) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.stations.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?station) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == station.brandId) {
              let id = await setRBStation(manager.brandId, payload, ?uuid);
              #ok(id);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query func listRBStations(brandId : Text) : async Response<[(Text, Types.RBStation)]> {
    var results : [(Text, Types.RBStation)] = [];
    for ((uuid, station) in state.refillBrand.stations.entries()) {
      if (station.brandId == brandId) {
        results := Array.append<(Text, Types.RBStation)>(results, [(uuid, station)]);
      };
    };
    #ok(results);
  };

  func setRBCategory(brandId : Text, name : Text, uuid : ?Text) : async Text {
    let payload = { brandId; name };
    let id = Option.get(uuid, await createUUID());
    state.refillBrand.categories.put(id, payload);
    return id;
  };

  public shared({ caller }) func createRBCaregory(name : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBCategory(manager.brandId, name, null);
        #ok(uuid);
      };
    };
  };

  public shared({ caller }) func updateRBCategory(uuid : Text, name : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.categories.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?category) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == category.brandId) {
              let id = await setRBCategory(manager.brandId, name, ?uuid);
              #ok(id);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public shared({ caller }) func deleteRBCategory(uuid : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.categories.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?category) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == category.brandId) {
              state.refillBrand.categories.delete(uuid);
              #ok(uuid);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query func listRBCategories(brandId : Text) : async Response<[(Text, Types.RBCategory)]> {
    var results : [(Text, Types.RBCategory)] = [];
    for ((uuid, category) in state.refillBrand.categories.entries()) {
      if (category.brandId == brandId) {
        results := Array.append<(Text, Types.RBCategory)>(results, [(uuid, category)]);
      };
    };
    #ok(results);
  };

  func setRBTag(brandId : Text, name : Text, uuid : ?Text) : async Text {
    let payload = { brandId; name };
    let id = Option.get(uuid, await createUUID());
    state.refillBrand.tags.put(id, payload);
    return id;
  };

  public shared({ caller }) func createRBTag(name : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBTag(manager.brandId, name, null);
        #ok(uuid);
      };
    };
  };

  public shared({ caller }) func updateRBTag(uuid : Text, name : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.tags.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?tag) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == tag.brandId) {
              let id = await setRBTag(manager.brandId, name, ?uuid);
              #ok(id);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public shared({ caller }) func deleteRBTag(uuid : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.tags.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?tag) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == tag.brandId) {
              state.refillBrand.tags.delete(uuid);
              #ok(uuid);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query func listRBTags(brandId : Text) : async Response<[(Text, Types.RBTag)]> {
    var results : [(Text, Types.RBTag)] = [];
    for ((uuid, tag) in state.refillBrand.tags.entries()) {
      if (tag.brandId == brandId) {
        results := Array.append<(Text, Types.RBTag)>(results, [(uuid, tag)]);
      };
    };
    #ok(results);
  };

  func setRBProductUnit(brandId : Text, name : Text, uuid : ?Text) : async Text {
    let payload = { brandId; name };
    let id = Option.get(uuid, await createUUID());
    state.refillBrand.productUnits.put(id, payload);
    return id;
  };

  public shared({ caller }) func createRBProductUnit(name : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBProductUnit(manager.brandId, name, null);
        #ok(uuid);
      };
    };
  };

  public shared({ caller }) func updateRBProductUnit(uuid : Text, name : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.productUnits.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?pu) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == pu.brandId) {
              let id = await setRBProductUnit(manager.brandId, name, ?uuid);
              #ok(id);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public shared({ caller }) func deleteRBProductUnit(uuid : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.productUnits.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?pu) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == pu.brandId) {
              state.refillBrand.productUnits.delete(uuid);
              #ok(uuid);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query func listRBProductUnits(brandId : Text) : async Response<[(Text, Types.RBProductUnit)]> {
    var results : [(Text, Types.RBProductUnit)] = [];
    for ((uuid, pu) in state.refillBrand.productUnits.entries()) {
      if (pu.brandId == brandId) {
        results := Array.append<(Text, Types.RBProductUnit)>(results, [(uuid, pu)]);
      };
    };
    #ok(results);
  };

  func setRBProduct(brandId : Text, productPayload : Types.RBProduct, uuid : ?Text) : async Text {
    let payload = {
      brandId;
      name = productPayload.name;
      description = productPayload.description;
      categories = productPayload.categories;
      tags = productPayload.tags;
      sku = productPayload.sku;
      images = productPayload.images;
      price = productPayload.price;
      salePrice = productPayload.salePrice;
      currency = productPayload.currency;
      unit = productPayload.unit;
    };
    let id = Option.get(uuid, await createUUID());
    state.refillBrand.products.put(id, payload);
    return id;
  };

  public shared({ caller }) func createRBProduct(payload : Types.RBProduct) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBProduct(manager.brandId, payload, null);
        #ok(uuid);
      };
    };
  };

  public shared({ caller }) func updateRBProduct(
    uuid : Text, payload : Types.RBProduct
  ) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.products.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?product) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == product.brandId) {
              let id = await setRBProduct(manager.brandId, payload, ?uuid);
              #ok(id);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public shared({ caller }) func deleteRBProduct(uuid : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };

    switch (state.refillBrand.products.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?product) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == product.brandId) {
              state.refillBrand.products.delete(uuid);
              #ok(uuid);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query func listRBProducts(brandId : Text) : async Response<[(Text, Types.RBProduct)]> {
    var results : [(Text, Types.RBProduct)] = [];
    for ((uuid, product) in state.refillBrand.products.entries()) {
      if (product.brandId == brandId) {
        results := Array.append<(Text, Types.RBProduct)>(results, [(uuid, product)]);
      };
    };
    #ok(results);
  };

  // Game
  // Character Class
  public shared({caller}) func createCharacterClass(characterClass : Types.CharacterClass) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(characterClass.id); 
    switch (rsCharacterClass) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        CharacterClass.create(characterClass, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readCharacterClass(id : Int) : async Response<(Types.CharacterClass)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(id);
    return Result.fromOption(rsCharacterClass, #NotFound);
  };

  public shared query({caller}) func listCharacterClasses() : async Response<[(Int, Types.CharacterClass)]> {
    var list : [(Int, Types.CharacterClass)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.characterClasses.entries()) {
      list := Array.append<(Int, Types.CharacterClass)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared({caller}) func updateCharacterClass(characterClass : Types.CharacterClass) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(characterClass.id); 
    switch (rsCharacterClass) {
      case null { #err(#NotFound); };
      case (?V) {
        CharacterClass.update(characterClass, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteCharacterClass(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(id);
    switch (rsCharacterClass) {
      case null { #err(#NotFound); };
      case (?V) {
        let deletedCharacterClass = state.characterClasses.delete(id);
        #ok("Success");
      };
    };
  };

  // Get userId
  public shared query({caller}) func getUserId() : async Response<Principal>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    #ok(caller);
  };

  // Character
  public shared({caller}) func createCharacter(characterClassId : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let uuid : Text = await createUUID();
    var canCreate = true;
    let rsCharacterClass = state.characterClasses.get(characterClassId);
    switch (rsCharacterClass) {
      case (?characterClass) {
        for((K, character) in state.characters.entries()){
          if(character.userId == caller){
            canCreate := false;
          };
        };
        if(canCreate == true){
          Character.create(caller, uuid, characterClass, state);
        };
        #ok("Success");
      };  
      case null {
        #err(#NotFound); 
      };
    };
  };

  public shared({caller}) func resetCharacterStat() : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    for((K,character) in state.characters.entries()){
      for((K,characterClass) in state.characterClasses.entries()){
        if(character.classId == characterClass.id){
          Character.resetStat(caller, character.id, characterClass, state);
        };
      };
    };
    #ok("Success");
  };

  public shared query({caller}) func getCharacterStatus() : async Response<Text>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    var rs : Text = "";
    for((K,character) in state.characters.entries()){
      if(character.userId == caller){
        rs := character.status;
      };
    };
    #ok(rs);
  };

  public shared query({caller}) func readCharacter() : async Response<(Text, Types.Character)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    var result : [(Text, Types.Character)] = [];
    for((key ,character) in state.characters.entries()) {
      if(character.userId == caller){
        result := Array.append<(Text, Types.Character)>(result, [(key, character)]);
      };
    };
    #ok(result[0]);
  };

  public shared query({caller}) func listCharacters() : async Response<[(Text, Types.Character)]> {
    var list : [(Text, Types.Character)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((key ,character) in state.characters.entries()) {
      if(character.userId == caller){
        list := Array.append<(Text, Types.Character)>(list, [(key, character)]);
      }
    };
    #ok((list));
  };

  public shared query({caller}) func listAllCharacters() : async Response<[(Text, Types.Character)]> {
    var list : [(Text, Types.Character)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((key ,character) in state.characters.entries()) {
      list := Array.append<(Text, Types.Character)>(list, [(key, character)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func takeOption(eventId : Int) : async Response<[Types.Character]> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    var result : [Types.Character] = [];
    for((K,character) in state.characters.entries()){
      if(character.userId == caller){
        for((K, eventOption) in state.eventOptions.entries()){
          if(eventOption.eventId == eventId){
            var strengthRequire : Float = 0;
            for(item in state.items.vals()){
              if(item.id == eventOption.requireItemId){
                strengthRequire := item.strengthRequire;
              };
            };
            result := Array.append<Types.Character>(result, [Character.takeOption(character, strengthRequire, eventOption, state)]);
          };
        };
      };
    };
    #ok(result);
  };

  public shared({caller}) func updateCharacter(character : Types.Character) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsCharacter = state.characters.get(character.id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound); };
      case (?V) {
        Character.update(character, state);
        #ok("Success");
      };
    };
  };

  // public shared({caller}) func updateStatus(id : Int, status : Text) : async Response<Text> {
  //   if(Principal.toText(caller) == "2vxsx-fae") {
  //     return #err(#NotAuthorized);//isNotAuthorized
  //   };
  //   let rsCharacter = state.characters.get(id);
  //   switch (rsCharacter) {
  //     case (null) { #err(#NotFound); };
  //     case (?character) {
  //       if(character.currentHP == 0 or character.currentMorale == 0 or character.currentStamina == 0){
  //         Character.updateStatus(character, "Exhaust", state);
  //       };
  //       #ok("Success");
  //     };
  //   };
  // };

  public shared({caller}) func deleteCharacter(id : Text) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsCharacter = state.characters.get(id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedCharacter = state.characters.delete(id);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func createCharacterTakeOption(id : Int, characterId : Text, eventOptionId : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsCharacter = state.characters.get(characterId);
    switch (rsCharacter) {
      case null { #err(#NotFound); };
      case (?character) {
        CharacterTakeOption.create(id, character, eventOptionId, state);
        #ok("Success");
      };
    };
  };

  // Quest
  public shared({caller}) func createQuest(quest: Types.Quest) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsQuest = state.quests.get(quest.id);
    switch (rsQuest) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        Quest.create(quest, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readQuest(id : Int) : async Response<(Types.Quest)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsQuest = state.quests.get(id);
    return Result.fromOption(rsQuest, #NotFound);
  };

  public shared query({caller}) func listQuests() : async Response<[(Int, Types.Quest)]> {
    var list : [(Int, Types.Quest)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.quests.entries()) {
      list := Array.append<(Int, Types.Quest)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared({caller}) func updateQuest(quest: Types.Quest) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsQuest = state.quests.get(quest.id);
    switch (rsQuest) {
      case null { #err(#NotFound); };
      case (?V) {
        Quest.update(quest, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteQuest(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsQuest = state.quests.get(id);
    switch (rsQuest) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedQuest = state.quests.delete(id);
        #ok("Success");
      };
    };
  };

  // Item
  public shared({caller}) func createItem(item: Types.Item) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsItem = state.items.get(item.id);
    switch (rsItem) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        Item.create(item, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readItem(id : Int) : async Response<(Types.Item)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsItem = state.items.get(id);
    return Result.fromOption(rsItem, #NotFound);
  };

  public shared query({caller}) func listItems() : async Response<[(Int, Types.Item)]> {
    var list : [(Int, Types.Item)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.items.entries()) {
      list := Array.append<(Int, Types.Item)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared({caller}) func updateItem(item: Types.Item) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsItem = state.items.get(item.id);
    switch (rsItem) {
      case null { #err(#NotFound); };
      case (?V) {
        Item.update(item, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteItem(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsItem = state.items.get(id);
    switch (rsItem) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedItem = state.items.delete(id);
        #ok("Success");
      };
    };
  };

  // Quest Item 
  public shared({caller}) func createQuestItem(questItem: Types.QuestItem) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsquestItem = state.questItems.get(questItem.id);
    switch (rsquestItem) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        QuestItem.create(questItem, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func listQuestItems(questId : Int) : async Response<[Types.Item]> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    var list : [Types.Item] = [];
    for((_,questItem) in state.questItems.entries()) {
      if(questItem.questId == questId){
        let rsItem = state.items.get(questItem.itemId);
        switch (rsItem) {
          case null { () };
          case (?item){
            list := Array.append<Types.Item>(list, [item]);
          };
        };
      };
    };
    #ok((list));
  };

  public shared({caller}) func updateQuestItem(questItem: Types.QuestItem) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsquestItem = state.questItems.get(questItem.id);
    switch (rsquestItem) {
      case null { #err(#NotFound); };
      case (?V) {
        QuestItem.update(questItem, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteQuestItem(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsquestItem = state.questItems.get(id);
    switch (rsquestItem) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedquestItem = state.questItems.delete(id);
        #ok("Success");
      };
    };
  };

  // Event
  public shared({caller}) func createEvent(questId : Int, event: Types.Event) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsEvent = state.events.get(event.id);
    switch (rsEvent) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        for((id, quest) in state.quests.entries()) {
          if(id == questId){
            Event.create(event, state);
          };
        };
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readEvent(id : Int) : async Response<(Types.Event)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsEvent = state.events.get(id);
    return Result.fromOption(rsEvent, #NotFound);
  };

  public shared query({caller}) func listEvents() : async Response<[(Int, Types.Event)]> {
    var list : [(Int, Types.Event)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.events.entries()) {
      list := Array.append<(Int, Types.Event)>(list, [(K, V)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func updateEvent(event: Types.Event) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsEvent = state.events.get(event.id);
    switch (rsEvent) {
      case null { #err(#NotFound); };
      case (?V) {
        Event.update(event, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteEvent(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsEvent = state.events.get(id);
    switch (rsEvent) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedEvent = state.events.delete(id);
        #ok("Success");
      };
    };
  };

  // Event Option
  public shared({caller}) func createEventOption(eventOption: Types.EventOption) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsEventOption = state.eventOptions.get(eventOption.id);
    switch (rsEventOption) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        EventOption.create(eventOption, state);
        #ok("Success");
      };
    };
    
  };

  public shared query({caller}) func readEventOption(id : Int) : async Response<(Types.EventOption)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsEventOption = state.eventOptions.get(id);
    return Result.fromOption(rsEventOption, #NotFound);
  };

  public shared query({caller}) func listAllEventOptions() : async Response<[(Int, Types.EventOption)]> {
    var list : [(Int, Types.EventOption)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.eventOptions.entries()) {
      list := Array.append<(Int, Types.EventOption)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared query({caller}) func listEventOptions(eventId : Int) : async Response<[Types.EventOption]> {
    var list : [Types.EventOption] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,eventOption) in state.eventOptions.entries()) {
      if(eventOption.eventId == eventId){
        list := Array.append<Types.EventOption>(list, [eventOption]);
      };
    };
    #ok((list));
  };
  
  public shared({caller}) func updateEventOption(eventOption: Types.EventOption) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsEventOption = state.eventOptions.get(eventOption.id);
    switch (rsEventOption) {
      case null { #err(#NotFound); };
      case (?V) {
        EventOption.update(eventOption, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteEventOption(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsEventOption = state.eventOptions.get(id);
    switch (rsEventOption) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedEventOption = state.eventOptions.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear
  public shared({caller}) func createGear(gearClassId : Int, gear: Types.Gear) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearClass = state.gearClasses.get(gearClassId);
    switch (rsGearClass) {
      case null { #err(#NotFound); };
      case (?V){
        let rsGear = state.gears.get(gear.id);
        switch (rsGear) {
          case (?V) { #err(#AlreadyExisting); };
          case null {
            Gear.create(gear, state);
            #ok("Success");
          };
        };
      };
    };

  };

  public shared query({caller}) func readGear(id : Int) : async Response<(Types.Gear)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGear = state.gears.get(id);
    return Result.fromOption(rsGear, #NotFound);
  };

  public shared query({caller}) func listGears() : async Response<[(Int, Types.Gear)]> {
    var list : [(Int, Types.Gear)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.gears.entries()) {
      list := Array.append<(Int, Types.Gear)>(list, [(K, V)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func updateGear(gear: Types.Gear) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGear = state.gears.get(gear.id);
    switch (rsGear) {
      case null { #err(#NotFound); };
      case (?V) {
        Gear.update(gear, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteGear(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGear = state.gears.get(id);
    switch (rsGear) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedGear = state.gears.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear Class
  public shared({caller}) func createGearClass(gearClass: Types.GearClass) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearClass = state.gearClasses.get(gearClass.id);
    switch (rsGearClass) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        GearClass.create(gearClass, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readGearClass(id : Int) : async Response<(Types.GearClass)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearClass = state.gearClasses.get(id);
    return Result.fromOption(rsGearClass, #NotFound);
  };

  public shared query({caller}) func listGearClasses() : async Response<[(Int, Types.GearClass)]> {
    var list : [(Int, Types.GearClass)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.gearClasses.entries()) {
      list := Array.append<(Int, Types.GearClass)>(list, [(K, V)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func updateGearClass(gearClass: Types.GearClass) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearClass = state.gearClasses.get(gearClass.id);
    switch (rsGearClass) {
      case null { #err(#NotFound); };
      case (?V) {
        GearClass.update(gearClass, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteGearClass(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearClass = state.gearClasses.get(id);
    switch (rsGearClass) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedGearClass = state.gearClasses.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear Rarity
  public shared({caller}) func createGearRarity(gearRarity: Types.GearRarity) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearRarity = state.gearRarities.get(gearRarity.id);
    switch (rsGearRarity) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        GearRarity.create(gearRarity, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readGearRarity(id : Int) : async Response<(Types.GearRarity)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearRarity = state.gearRarities.get(id);
    return Result.fromOption(rsGearRarity, #NotFound);
  };

  public shared query({caller}) func listGearRarities() : async Response<[(Int, Types.GearRarity)]> {
    var list : [(Int, Types.GearRarity)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.gearRarities.entries()) {
      list := Array.append<(Int, Types.GearRarity)>(list, [(K, V)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func updateGearRarity(gearRarity: Types.GearRarity) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearRarity = state.gearRarities.get(gearRarity.id);
    switch (rsGearRarity) {
      case null { #err(#NotFound); };
      case (?V) {
        GearRarity.update(gearRarity, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteGearRarity(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearRarity = state.gearRarities.get(id);
    switch (rsGearRarity) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedGearRarity = state.gearRarities.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear Substat
  public shared({caller}) func createGearSubstat(gearSubstat: Types.GearSubstat) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearSubstat = state.gearSubstats.get(gearSubstat.id);
    switch (rsGearSubstat) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        GearSubstat.create(gearSubstat, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readGearSubstat(id : Int) : async Response<(Types.GearSubstat)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearSubstat = state.gearSubstats.get(id);
    return Result.fromOption(rsGearSubstat, #NotFound);
  };

  public shared query({caller}) func listgearSubstats() : async Response<[(Int, Types.GearSubstat)]> {
    var list : [(Int, Types.GearSubstat)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.gearSubstats.entries()) {
      list := Array.append<(Int, Types.GearSubstat)>(list, [(K, V)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func updateGearSubstat(gearSubstat: Types.GearSubstat) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearSubstat = state.gearSubstats.get(gearSubstat.id);
    switch (rsGearSubstat) {
      case null { #err(#NotFound); };
      case (?V) {
        GearSubstat.update(gearSubstat, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteGearSubstat(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsGearSubstat = state.gearSubstats.get(id);
    switch (rsGearSubstat) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedGearSubstat = state.gearSubstats.delete(id);
        #ok("Success");
      };
    };
  };

  // Material
  public shared({caller}) func createMaterial(material: Types.Material) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsMaterial = state.materials.get(material.id);
    switch (rsMaterial) {
      case (?V) { #err(#AlreadyExisting); };
      case null {
        Material.create(material, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readMaterial(id : Int) : async Response<(Types.Material)>{
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsMaterial = state.materials.get(id);
    return Result.fromOption(rsMaterial, #NotFound);
  };

  public shared query({caller}) func listMaterials() : async Response<[(Int, Types.Material)]> {
    var list : [(Int, Types.Material)] = [];
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    for((K,V) in state.materials.entries()) {
      list := Array.append<(Int, Types.Material)>(list, [(K, V)]);
    };
    #ok((list));
  };
  
  public shared({caller}) func updateMaterial(material: Types.Material) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsMaterial = state.materials.get(material.id);
    switch (rsMaterial) {
      case null { #err(#NotFound); };
      case (?V) {
        Material.update(material, state);
        #ok("Success");
      };
    };
  };

  public shared({caller}) func deleteMaterial(id : Int) : async Response<Text> {
    if(Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized);//isNotAuthorized
    };
    let rsMaterial = state.materials.get(id);
    switch (rsMaterial) {
      case (null) { #err(#NotFound); };
      case (?V) {
        let deletedMaterial = state.materials.delete(id);
        #ok("Success");
      };
    };
  };

  // Inventory
};
