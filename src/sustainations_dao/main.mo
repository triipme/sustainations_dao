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

  public query func listCurrencies() : Response<[Types.Currency]> {
    #ok(state.currencies.vals());
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

    switch (state.refillBrand.brands.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (? brand) {
        let manager = Option.get(state.refillBrand.managers.get(caller), {
          brandId = ""; role = "";
        });
        // required system admin role or brand's owner
        if (isAdmin(caller) == true || (manager.brandId == uuid && manager.role == #owner)) {
          state.refillBrand.brands.replace(uuid, payload);
          #ok(uuid);
        } else {
          #err(#AdminRoleRequired);
        };
      };
    };
  };

  public query func listRefillBrands() : Response<[(Text, Types.RefillBrand)]> {
    #ok(state.refillBrand.brands.entries());
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
          var results = [(Text, RS.ManagerRole)] = [];
          for ((principal, manager) in state.refillBrand.managers.entries()) {
            results := Array.append<(Text, RS.ManagerRole)>(results, [Principal.toText(principal), manager.role]);
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
    if (uuid == null) {
      uuid := await createUUID();
      state.refillBrand.stations.put(uuid, stationPayload);
    } else {
      state.refillBrand.stations.replace(uuid, stationPayload);
    };
    return uuid;
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
        for (payload in payloads) {
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
              await setRBStation(manager.brandId, payload, uuid);
              #ok(uuid);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query func listRBStations(brandId : Text) : Response<[(Text, Types.RBStation)]> {
    let results : [(Text, Types.RBStation)] = [];
    for ((uuid, station) in state.refillBrand.stations.entries()) {
      if (station.brandId == brandId) {
        results := Array.append<(Text, Types.RBStation)>(results, [(uuid, station)]);
      };
    };
    #ok(results);
  };

  func setRBCategory(brandId : Text, name : Text, uuid : ?Text) : async Text {
    let payload = { brandId; name };
    if (uuid == null) {
      uuid := await createUUID();
      state.refillBrand.categories.put(uuid, payload);
    } else {
      state.refillBrand.categories.replace(uuid, payload);
    };
    return uuid;
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
              await setRBCategory(manager.brandId, name, uuid);
              #ok(uuid);
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
    let results : [(Text, Types.RBCategory)] = [];
    for ((uuid, category) in state.refillBrand.categories.entries()) {
      if (category.brandId == brandId) {
        results := Array.append<(Text, Types.RBCategory)>(results, [(uuid, category)]);
      };
    };
    #ok(results);
  };

  func setRBTag(brandId : Text, name : Text, uuid : ?Text) : async Text {
    let payload = { brandId; name };
    if (uuid == null) {
      uuid := await createUUID();
      state.refillBrand.tags.put(uuid, payload);
    } else {
      state.refillBrand.tags.replace(uuid, payload);
    };
    return uuid;
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
              await setRBTag(manager.brandId, name, uuid);
              #ok(uuid);
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
    let results : [(Text, Types.RBTag)] = [];
    for ((uuid, tag) in state.refillBrand.tags.entries()) {
      if (tag.brandId == brandId) {
        results := Array.append<(Text, Types.RBTag)>(results, [(uuid, tag)]);
      };
    };
    #ok(results);
  };

  func setRBProductUnit(brandId : Text, name : Text, uuid : ?Text) : async Text {
    let payload = { brandId; name };
    if (uuid == null) {
      uuid := await createUUID();
      state.refillBrand.productUnits.put(uuid, payload);
    } else {
      state.refillBrand.productUnits.replace(uuid, payload);
    };
    return uuid;
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
              await setRBProductUnit(manager.brandId, name, uuid);
              #ok(uuid);
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
    let results : [(Text, Types.RBProductUnit)] = [];
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
    if (uuid == null) {
      uuid := await createUUID();
      state.refillBrand.products.put(uuid, payload);
    } else {
      state.refillBrand.products.replace(uuid, payload);
    };
    return uuid;
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
              await setRBProduct(manager.brandId, payload, uuid);
              #ok(uuid);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public shared({ caller }) func deleteRBProduct() : async Response<Text> {
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
    let results : [(Text, Types.RBProduct)] = [];
    for ((uuid, product) in state.refillBrand.products.entries()) {
      if (product.brandId == brandId) {
        results := Array.append<(Text, Types.RBProduct)>(results, [(uuid, product)]);
      };
    };
    #ok(results);
  };
};
