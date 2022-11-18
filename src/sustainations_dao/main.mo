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
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Random "./utils/random";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import UUID "mo:uuid/UUID";

import Account "./plugins/Account";
import Moment "./plugins/Moment";
import Types "types";
import State "state";
import Ledger "./plugins/Ledger";
import GeoRust "./plugins/GeoRust";
import RS "./models/RefillStation";
import CharacterClass "./game/characterClass";
import Character "./game/character";
import CharacterTakesOption "./game/characterTakesOption";
import CharacterCollectsMaterials "./game/characterCollectsMaterials";
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
import Inventory "./game/inventory";
import LandConfig "./land/landConfig";
import LandSlot "./land/landSlot";
import Nation "./land/nation";
import LandTransferHistory "./land/landTransferHistory";
import LandBuyingStatus "./land/landBuyingStatus";
import Tile "./land/tile";
import Seed "./land/seed";
import Plant "./land/plant";
import Env ".env";

shared({caller = owner}) actor class SustainationsDAO() = this {
  stable var transferFee : Nat64 = 10_000;
  stable var createProposalFee : Nat64 = 20_000;
  stable var voteFee : Nat64 = 20_000;
  stable var treasuryContribution : Float = 0.03;
  stable var gamePlayAnalytics : Types.GamePlayAnalytics = {
    miniGamePlayCount = 0;
    miniGameCompletedCount = 0;
    questPlayCount = 0;
    questCompletedCount = 0;
  };

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
  private stable var memoryCardEngine = {
    games : [(Text, Types.MemoryCardEngineGame)] = [];
    stages : [(Text, Types.MemoryCardEngineStage)] = [];
    cards : [(Text, Types.MemoryCardEngineCard)] = [];
    players : [(Text, Types.MemoryCardEnginePlayer)] = [];
    rewards : [(Text, Types.MemoryCardEngineReward)] = [];
  };
  private stable var characterClasses : [(Text, Types.CharacterClass)] = [];
  private stable var characters : [(Text, Types.Character)] = [];
  private stable var characterTakesOptions : [(Text, Types.CharacterTakesOption)] = [];
  private stable var characterSelectsItems : [(Text, Types.CharacterSelectsItems)] = [];
  private stable var characterCollectsMaterials : [(Text, Types.CharacterCollectsMaterials)] = [];
  private stable var quests : [(Text, Types.Quest)] = [];
  private stable var items : [(Text, Types.Item)] = [];
  private stable var questItems : [(Text, Types.QuestItem)] = [];
  private stable var usableItems : [(Text, Types.UsableItem)] = [];
  private stable var eventItems : [(Text, Types.EventItem)] = [];
  private stable var arItems : [(Text, Types.ARItem)] = [];
  private stable var events : [(Text, Types.Event)] = [];
  private stable var eventOptions : [(Text, Types.EventOption)] = [];
  private stable var gears : [(Text, Types.Gear)] = [];
  private stable var gearClasses : [(Text, Types.GearClass)] = [];
  private stable var gearRarities : [(Text, Types.GearRarity)] = [];
  private stable var gearSubstats : [(Text, Types.GearSubstat)] = [];
  private stable var materials : [(Text, Types.Material)] = [];
  private stable var inventories : [(Text, Types.Inventory)] = [];
  private stable var landConfigs : [(Text, Types.LandConfig)] = [];
  private stable var landSlots : [(Text, Types.LandSlot)] = [];
  private stable var nations : [(Text, Types.Nation)] = [];
  private stable var landTransferHistories : [(Text, Types.LandTransferHistory)] = [];
  private stable var landBuyingStatuses : [(Text, Types.LandBuyingStatus)] = [];
  private stable var tiles : [(Text, Types.Tile)] = [];
  private stable var seeds : [(Text, Types.Seed)] = [];
  private stable var plants : [(Text, Types.Plant)] = [];

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
    memoryCardEngine := {
      games = Iter.toArray(state.memoryCardEngine.games.entries());
      stages = Iter.toArray(state.memoryCardEngine.stages.entries());
      cards = Iter.toArray(state.memoryCardEngine.cards.entries());
      players = Iter.toArray(state.memoryCardEngine.players.entries());
      rewards = Iter.toArray(state.memoryCardEngine.rewards.entries());
    };
    characterClasses := Iter.toArray(state.characterClasses.entries());
    characters := Iter.toArray(state.characters.entries());
    characterTakesOptions := Iter.toArray(state.characterTakesOptions.entries());
    characterSelectsItems := Iter.toArray(state.characterSelectsItems.entries());
    characterCollectsMaterials := Iter.toArray(state.characterCollectsMaterials.entries());
    quests := Iter.toArray(state.quests.entries());
    items := Iter.toArray(state.items.entries());
    questItems := Iter.toArray(state.questItems.entries());
    usableItems := Iter.toArray(state.usableItems.entries());
    eventItems := Iter.toArray(state.eventItems.entries());
    arItems := Iter.toArray(state.arItems.entries());
    events := Iter.toArray(state.events.entries());
    eventOptions := Iter.toArray(state.eventOptions.entries());
    gears := Iter.toArray(state.gears.entries());
    gearClasses := Iter.toArray(state.gearClasses.entries());
    gearRarities := Iter.toArray(state.gearRarities.entries());
    gearSubstats := Iter.toArray(state.gearSubstats.entries());
    materials := Iter.toArray(state.materials.entries());
    inventories := Iter.toArray(state.inventories.entries());
    landConfigs := Iter.toArray(state.landConfigs.entries());
    landSlots := Iter.toArray(state.landSlots.entries());
    nations := Iter.toArray(state.nations.entries());
    landTransferHistories := Iter.toArray(state.landTransferHistories.entries());
    landBuyingStatuses := Iter.toArray(state.landBuyingStatuses.entries());
    tiles := Iter.toArray(state.tiles.entries());
    seeds := Iter.toArray(state.seeds.entries());
    plants := Iter.toArray(state.plants.entries());
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
    for ((k, v) in Iter.fromArray(characterClasses)) {
      state.characterClasses.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characters)) {
      state.characters.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characterTakesOptions)) {
      state.characterTakesOptions.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characterSelectsItems)) {
      state.characterSelectsItems.put(k, v);
    };
    for ((k, v) in Iter.fromArray(characterCollectsMaterials)) {
      state.characterCollectsMaterials.put(k, v);
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
    for ((k, v) in Iter.fromArray(usableItems)) {
      state.usableItems.put(k, v);
    };
    for ((k, v) in Iter.fromArray(eventItems)) {
      state.eventItems.put(k, v);
    };
    for ((k, v) in Iter.fromArray(arItems)) {
      state.arItems.put(k, v);
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
    for ((k, v) in Iter.fromArray(landConfigs)) {
      state.landConfigs.put(k, v);
    };
    for ((k, v) in Iter.fromArray(landSlots)) {
      state.landSlots.put(k, v);
    };
    for ((k, v) in Iter.fromArray(nations)) {
      state.nations.put(k, v);
    };
    for ((k, v) in Iter.fromArray(landTransferHistories)) {
      state.landTransferHistories.put(k, v);
    };
    for ((k, v) in Iter.fromArray(landBuyingStatuses)) {
      state.landBuyingStatuses.put(k, v);
    };
    for ((k, v) in Iter.fromArray(tiles)) {
      state.tiles.put(k, v);
    };
    for ((k, v) in Iter.fromArray(seeds)) {
      state.seeds.put(k, v);
    };
    for ((k, v) in Iter.fromArray(plants)) {
      state.plants.put(k, v);
    };
    Debug.print("End postupgrade");
  };

  system func heartbeat() : async () {
    await setOutDateProposals();
  };

  type Response<Ok> = Result.Result<Ok, Types.Error>;
  private let ledger : Ledger.Interface = actor(Env.LEDGER_ID);
  private let georust : GeoRust.Interface = actor(Env.GEORUST_ID);

  private func createUUID() : async Text {
    var ae = AsyncSource.Source();
    let id = await ae.new();
    UUID.toText(id);
  };

  public shared ({ caller }) func getBalance() : async Ledger.ICP {
    let accountId = Account.accountIdentifier(
      Principal.fromActor(this),
      Account.principalToSubaccount(caller)
    );
    await ledger.account_balance({ account = accountId });
  };

  public func getSystemBalance() : async Ledger.ICP {
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount());
    await ledger.account_balance({ account = accountId });
  };

  public query func getSystemAddress() : async Blob {
    Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount());
  };

  public query func getSystemAddressAsText() : async Text {
    Account.toText(
      Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount())
    );
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
    gamePlayCount : Types.GamePlayAnalytics;
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
        };
      } else {
        if (proposal.votesYes > 0) {
          if (proposal.proposalType == ?#product) {
            investedProducts += 1;
          } else {
            investedProjects += 1;
          };
        };
        if (proposal.status == #open) {
          if (proposal.proposalType == ?#product) {
            openingProducts += 1;
          } else {
            openingProjects += 1;
          };
        };
      };
    };
    let result = {
      userAgreement = state.userAgreements.size();
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
      gamePlayCount = gamePlayAnalytics;
    };
    Debug.print(debug_show (result));
    #ok(result);
  };

  public shared ({ caller }) func submitAgreement() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let agreement = state.userAgreements.get(caller);
    switch (agreement) {
      case null {
        let payload = {
          uid = Principal.toText(caller);
          timestamp = Time.now();
        };
        let result = state.userAgreements.put(caller, payload);
        let receipt = await rewardUserAgreement(caller);
        let profile = state.profiles.put(
          caller,
          {
            username = null;
            avatar = null;
            phone = null;
            role = #user;
          }
        );
        #ok("Success!");
      };
      case (?_v) {
        #ok("Success!");
      };
    };
  };

  type UserAgreementSerializer = {
    address : Text;
    timestamp : Time.Time;
  };
  public query func getUserAgreement(uid : Text) : async Response<UserAgreementSerializer> {
    let caller = Principal.fromText(uid);
    switch (state.userAgreements.get(caller)) {
      case null { #err(#NotFound) };
      case (?agreement) {
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
  public shared ({ caller }) func withdraw(amount : Nat64, address : Principal) : async Response<Nat64> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let sourceAccount = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    // Check ledger for value
    let balance = await ledger.account_balance({ account = sourceAccount });
    let accountId = Account.accountIdentifier(address, Account.defaultSubaccount());

    // Transfer amount back to user
    let receipt = if (balance.e8s >= amount + transferFee) {
      await ledger.transfer({
        memo : Nat64 = 0;
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
    #ok(amount);
  };

  // Return the account ID specific to this user's subaccount
  public query ({ caller }) func getDepositAddress() : async Text {
    Account.toText(
      Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller))
    );
  };

  type UserInfo = {
    depositAddress : Text;
    balance : Nat64;
    agreement : Bool;
    profile : ?Types.Profile;
    brandId : ?Text;
    brandRole : ?RS.ManagerRole;
  };
  public shared ({ caller }) func getUserInfo() : async Response<UserInfo> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    let balance = await ledger.account_balance({ account = accountId });
    let agreement = switch (state.userAgreements.get(caller)) {
      case (null) { false };
      case _ { true };
    };
    let profile = state.profiles.get(caller);
    var brandId : ?Text = null;
    var brandRole : ?RS.ManagerRole = null;
    switch (state.refillBrand.managers.get(caller)) {
      case (null) {};
      case (?manager) { brandId := ?manager.brandId; brandRole := ?manager.role };
    };
    let userInfo = {
      depositAddress = Account.toText(
        Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller))
      );
      balance = balance.e8s;
      agreement;
      profile;
      brandId;
      brandRole;
    };
    #ok(userInfo);
  };

  public shared ({ caller }) func updateUserProfile(
    username : ?Text,
    phone : ?Text,
    avatar : ?Text
  ) : async Response<Types.Profile> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.profiles.get(caller)) {
      case null {
        let payload : Types.Profile = {
          username;
          phone;
          avatar;
          role = #user;
        };
        let profile = state.profiles.put(caller, payload);
        #ok(payload);
      };
      case (?profile) {
        let payload : Types.Profile = {
          username;
          phone;
          avatar;
          role = profile.role;
        };
        let updated = state.profiles.replace(caller, payload);
        #ok(payload);
      };
    };
  };

  // Transfer ICP from user's subaccount to system subaccount
  private func deposit(amount : Nat64, caller : Principal) : async Response<Nat64> {
    // Calculate target subaccount
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller));
    // Check ledger for value
    let balance = await ledger.account_balance({ account = accountId });
    // Transfer to default subaccount
    let receipt = if (balance.e8s >= amount + transferFee) {
      await ledger.transfer({
        memo : Nat64 = 0;
        from_subaccount = ?Account.principalToSubaccount(caller);
        to = Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount());
        amount = { e8s = amount };
        fee = { e8s = transferFee };
        created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
      });
    } else {
      return #err(#BalanceLow);
    };

    switch receipt {
      case (#Err _) {
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
    fromPrincipal : Principal,
    toPrincipal : Principal,
    refType : Types.Operation,
    refId : ?Text,
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
      Types.proposalCategories;
    };
    {
      categories;
      fundingTypes = Types.proposalFundingTypes;
    };
  };

  // Submit Proposal
  public shared ({ caller }) func submitProposal(
    payload : Types.ProposalPayload,
    proposalType : Types.ProposalType
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let amount = createProposalFee + transferFee;
    switch (await deposit(amount, caller)) {
      case (#ok(bIndex)) {
        let uuid = await createUUID();
        let proposal : Types.Proposal = {
          uuid;
          timestamp = Time.now();
          proposer = caller;
          payload;
          status = if (payload.dueDate <= Time.now()) { #rejected } else { #open };
          votesYes = 0;
          voters = List.nil();
          proposalType = ?proposalType;
        };
        // record transaction
        await recordTransaction(
          caller,
          amount,
          caller,
          Principal.fromActor(this),
          #createProposal,
          ?uuid,
          bIndex
        );
        state.proposals.put(uuid, proposal);
        #ok(uuid);
      };
      case (#err(error)) {
        #err(error);
      };
    };
  };

  public query ({ caller }) func listProposals(
    proposalType : Types.ProposalType
  ) : async Response<[Types.Proposal]> {
    // if (Principal.toText(caller) == "2vxsx-fae") {
    //   return #err(#NotAuthorized);//isNotAuthorized
    // };
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

  public query ({ caller }) func getProposal(uuid : Text) : async Response<Types.Proposal> {
    // if (Principal.toText(caller) == "2vxsx-fae") {
    //   return #err(#NotAuthorized);//isNotAuthorized
    // };
    switch (state.proposals.get(uuid)) {
      case null { #err(#NotFound) };
      case (?proposal) { #ok(proposal) };
    };
  };

  public shared ({ caller }) func destroyProposal(uuid : Text) : async Response<Text> {
    state.proposals.delete(uuid);
    #ok("Success");
  };

  // Votes Proposal
  public shared ({ caller }) func vote(args : Types.VoteArgs) : async Response<Types.ProposalState> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.proposals.get(args.proposalId)) {
      case null { #err(#NotFound) };
      case (?proposal) {
        var status = proposal.status;
        if (status != #open) {
          return #err(#ProposalIsNotOpened);
        };
        if (List.some(proposal.voters, func(voter : Types.Voter) : Bool = voter.uid == caller)) {
          return #err(#AlreadyVoted);
        };
        let voter = {
          uid = caller;
          vote = args.vote;
          timestamp = Time.now();
        };
        var votesYes = proposal.votesYes;
        let voters = List.push(voter, proposal.voters);
        if (args.vote == #yes) {
          // deposit vote fee
          switch (await deposit(voteFee + transferFee, caller)) {
            case (#ok(bIndex)) {
              votesYes += voteFee;
              // record transaction
              await recordTransaction(
                caller,
                voteFee + transferFee,
                caller,
                Principal.fromActor(this),
                #vote,
                ?proposal.uuid,
                bIndex
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
                      caller,
                      refundAmount,
                      Principal.fromActor(this),
                      proposal.proposer,
                      #executeApprovedProposal,
                      ?proposal.uuid,
                      bIndex
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
        #ok(status);
      };
    };
  };

  func refund(amount : Nat64, toPrincipal : Principal) : async Ledger.TransferResult {
    let accountId = Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(toPrincipal));
    await ledger.transfer({
      memo : Nat64 = 0;
      from_subaccount = ?Account.defaultSubaccount();
      to = accountId;
      amount = { e8s = amount };
      fee = { e8s = transferFee };
      created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
    });
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
            Principal.fromActor(this),
            voteFee,
            Principal.fromActor(this),
            voter.uid,
            #returnVoteFee,
            ?proposal.uuid,
            bIndex
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
          Principal.fromActor(this),
          reward,
          Principal.fromActor(this),
          uid,
          #awardUserAgreement,
          ?Principal.toText(uid),
          bIndex
        );
      };
    };
  };

  public query ({ caller }) func getTransactions() : async Response<[Types.TxRecord]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  //verify admin
  private func isAdmin(caller : Principal) : Bool {
    if (Principal.equal(caller, owner)) return true;
    switch (state.profiles.get(caller)) {
      case null return false;
      case (?profile) return profile.role == #admin;
    };
  };

  /* === Admin functions === */
  // admin set user's role
  public shared ({ caller }) func setRole(principalText : Text, role : Types.Role) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      let principal = Principal.fromText(principalText);
      switch (state.profiles.get(principal)) {
        case (null) {
          let profile : Types.Profile = {
            username = null;
            avatar = null;
            phone = null;
            role;
          };
          state.profiles.put(principal, profile);
        };
        case (?profile) {
          let newProfile = state.profiles.replace(
            principal,
            {
              username = profile.username;
              avatar = profile.avatar;
              phone = profile.phone;
              role;
            }
          );
        };
      };
      #ok("Success");
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func setCurrency(payload : Types.Currency) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      return #err(#AdminRoleRequired);
    };

    switch (state.currencies.get(payload.code)) {
      case (null) { state.currencies.put(payload.code, payload) };
      case _ { let currency = state.currencies.replace(payload.code, payload) };
    };
    #ok(payload.code);
  };

  public query func listCurrencies() : async Response<[Types.Currency]> {
    #ok(Iter.toArray(state.currencies.vals()));
  };

  public shared ({ caller }) func createRefillBrand(
    payload : Types.RefillBrand,
    ownerPrincipal : Text,
    ownerName : Text
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      return #err(#AdminRoleRequired);
    };

    let uuid = await createUUID();
    state.refillBrand.brands.put(uuid, payload);
    state.refillBrand.managers.put(
      Principal.fromText(ownerPrincipal),
      { brandId = uuid; role = #owner; username = ownerName }
    );
    #ok(uuid);
  };

  public query func getRefillBrand(uuid : Text) : async Response<(Text, Text, Types.RefillBrand)> {
    switch (state.refillBrand.brands.get(uuid)) {
      case null { #err(#NotFound) };
      case (?brand) {
        var ownerPrincipal : Text = "";
        var ownerName : Text = "";
        let managers = state.refillBrand.managers.entries();
        label managerLabel loop {
          switch (managers.next()) {
            case (?(principal, staff)) {
              if (staff.brandId == uuid and staff.role == #owner) {
                ownerPrincipal := Principal.toText(principal);
                ownerName := staff.username;
                break managerLabel;
              };
            };
            case (null) break managerLabel;
          };
        };
        #ok((ownerPrincipal, ownerName, brand));
      };
    };
  };

  public shared ({ caller }) func updateRefillBrand(
    uuid : Text,
    payload : Types.RefillBrand,
    ownerPrincipal : ?Text,
    ownerName : ?Text
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let result = switch (state.refillBrand.brands.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?brand) {
        let manager = Option.get(
          state.refillBrand.managers.get(caller),
          {
            brandId = "";
            role = "";
          }
        );
        // required system admin role or brand's owner
        let isOwner = manager.brandId == uuid and manager.role == #owner;
        if (isAdmin(caller) == true or (isOwner)) {
          let updated = state.refillBrand.brands.replace(uuid, payload);
          switch (ownerPrincipal) {
            case null {};
            case (?ownerText) {
              var brandOwner : Principal = caller;
              if (isOwner == false) {
                let managers = state.refillBrand.managers.entries();
                label managerLabel loop {
                  switch (managers.next()) {
                    case (?(principal, staff)) {
                      if (staff.brandId == uuid and staff.role == #owner) {
                        brandOwner := principal;
                        break managerLabel;
                      };
                    };
                    case (null) break managerLabel;
                  };
                };
              };
              // remove old owner role
              let oldOwner = state.refillBrand.managers.delete(brandOwner);
              // set new owner role
              let newOwner = state.refillBrand.managers.put(
                Principal.fromText(ownerText),
                { brandId = uuid; role = #owner; username = Option.get(ownerName, "") }
              );
            };
          };
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

  type SystemParams = {
    treasuryContribution : Float;
  };
  public query func getSystemParams() : async Response<SystemParams> {
    let systemParams : SystemParams = {
      treasuryContribution;
    };
    #ok(systemParams);
  };

  public shared ({ caller }) func updateSystemParams(treasuryContributionValue : Float) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      return #err(#AdminRoleRequired);
    };

    if (treasuryContributionValue < 0) {
      return #err(#InvalidData);
    };

    treasuryContribution := treasuryContributionValue;
    #ok("Success");
  };

  /* === For Refill Brand's Owner/Staff === */
  public shared ({ caller }) func setRBManager(principal : Text, username : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let manager = Principal.fromText(principal);
    switch (state.refillBrand.managers.get(manager)) {
      case (null) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#OwnerRoleRequired) };
          case (?owner) {
            if (owner.role == #owner) {
              state.refillBrand.managers.put(
                manager,
                {
                  brandId = owner.brandId;
                  role = #staff;
                  username;
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

  public query ({ caller }) func getRBManager(principal : Text) : async Response<Types.RBManager> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let staff = Principal.fromText(principal);
    switch (state.refillBrand.managers.get(staff)) {
      case (null) { #err(#NotFound) };
      case (?manager) {
        #ok(manager);
      };
    };
  };

  public shared ({ caller }) func updateRBManager(principal : Text, username : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let manager = Principal.fromText(principal);
    switch (state.refillBrand.managers.get(manager)) {
      case null { #err(#NotFound) };
      case (?staff) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#OwnerRoleRequired) };
          case (?owner) {
            if (staff.brandId != owner.brandId) {
              #err(#NotFound);
            } else if (owner.role == #owner) {
              let replaced = state.refillBrand.managers.replace(
                manager,
                {
                  brandId = staff.brandId;
                  role = #staff;
                  username;
                }
              );
              #ok("Success");
            } else {
              #err(#OwnerRoleRequired);
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteRBManager(principal : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#OwnerRoleRequired) };
      case (?owner) {
        if (owner.role == #owner) {
          let user = Principal.fromText(principal);
          switch (state.refillBrand.managers.get(user)) {
            case (null) { #err(#NotFound) };
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

  public query ({ caller }) func listRBManagers() : async Response<[(Text, Text, RS.ManagerRole)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#OwnerRoleRequired) };
      case (?owner) {
        if (owner.role == #owner) {
          var results : [(Text, Text, RS.ManagerRole)] = [];
          for ((principal, manager) in state.refillBrand.managers.entries()) {
            if (manager.brandId == owner.brandId and manager.role == #staff) {
              results := Array.append<(Text, Text, RS.ManagerRole)>(
                results,
                [(Principal.toText(principal), manager.username, manager.role)]
              );
            };
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

  public shared ({ caller }) func createRBStation(
    payload : Types.RBStation
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBStation(manager.brandId, payload, null);
        return #ok(uuid);
      };
    };
  };

  public query ({ caller }) func getRBStation(stationId : Text) : async Response<Types.RBStation> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.stations.get(stationId)) {
      case (null) { #err(#NotFound) };
      case (?station) {
        #ok(station);
      };
    };
  };

  public shared ({ caller }) func importRBStations(
    payloads : [Types.RBStation]
  ) : async Response<[Text]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func updateRBStation(
    uuid : Text,
    payload : Types.RBStation
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func createRBCaregory(name : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBCategory(manager.brandId, name, null);
        #ok(uuid);
      };
    };
  };

  public query ({ caller }) func getRBCategory(categoryId : Text) : async Response<Types.RBCategory> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.categories.get(categoryId)) {
      case (null) { #err(#NotFound) };
      case (?category) {
        #ok(category);
      };
    };
  };

  public shared ({ caller }) func updateRBCategory(uuid : Text, name : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func deleteRBCategory(uuid : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func createRBTag(name : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBTag(manager.brandId, name, null);
        #ok(uuid);
      };
    };
  };

  public query ({ caller }) func getRBTag(tagId : Text) : async Response<Types.RBTag> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.tags.get(tagId)) {
      case (null) { #err(#NotFound) };
      case (?tag) {
        #ok(tag);
      };
    };
  };

  public shared ({ caller }) func updateRBTag(uuid : Text, name : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func deleteRBTag(uuid : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func createRBProductUnit(name : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBProductUnit(manager.brandId, name, null);
        #ok(uuid);
      };
    };
  };

  public query ({ caller }) func getRBProductUnit(puId : Text) : async Response<Types.RBProductUnit> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.productUnits.get(puId)) {
      case (null) { #err(#NotFound) };
      case (?pu) {
        #ok(pu);
      };
    };
  };

  public shared ({ caller }) func updateRBProductUnit(uuid : Text, name : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func deleteRBProductUnit(uuid : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func createRBProduct(payload : Types.RBProduct) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        let uuid = await setRBProduct(manager.brandId, payload, null);
        #ok(uuid);
      };
    };
  };

  public query ({ caller }) func getRBProduct(prodId : Text) : async Response<Types.RBProduct> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.products.get(prodId)) {
      case (null) { #err(#NotFound) };
      case (?product) {
        #ok(product);
      };
    };
  };

  public shared ({ caller }) func updateRBProduct(
    uuid : Text,
    payload : Types.RBProduct
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  public shared ({ caller }) func deleteRBProduct(uuid : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
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

  type ProductOrderList = {
    productId : Text;
    quantity : Nat;
  };
  func setRBOrder(
    brandId : Text,
    stationId : Text,
    products : [RS.OrderProduct],
    totalAmount : Float,
    note : ?Text,
    history : [RS.OrderStatusHistory],
    uuid : ?Text
  ) : async Text {
    let payload = {
      brandId;
      stationId;
      history;
      products;
      totalAmount;
      note;
    };
    let id = Option.get(uuid, await createUUID());
    state.refillBrand.orders.put(id, payload);
    return id;
  };

  public shared ({ caller }) func createRBOrder(
    stationId : Text,
    productIds : [(Text, Float)],
    note : ?Text,
    status : RS.OrderStatus
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        switch (state.refillBrand.stations.get(stationId)) {
          case null #err(#StationNotFound);
          case (?station) {
            if (station.brandId != manager.brandId) {
              #err(#StationNotFound);
            } else {
              let history : RS.OrderStatusHistory = {
                status;
                timestamp = Moment.now();
              };
              var products : [RS.OrderProduct] = [];
              var totalAmount : Float = 0.0;
              var totalAmountICP : Float = 0.0;
              for ((productId, quantity) in Iter.fromArray(productIds)) {
                switch (state.refillBrand.products.get(productId)) {
                  case null {};
                  case (?product) {
                    if (product.brandId == manager.brandId) {
                      let price = Option.get(product.salePrice, product.price);
                      switch (state.currencies.get(product.currency)) {
                        case null {};
                        case (?currency) {
                          let productAmount = price * quantity;
                          totalAmount += productAmount;
                          totalAmountICP += productAmount / currency.exchangeRate;
                          Debug.print(debug_show (productAmount, totalAmount, totalAmountICP));
                        };
                      };
                      let item : RS.OrderProduct = {
                        productId = productId;
                        price;
                        currency = product.currency;
                        quantity = quantity;
                      };
                      products := Array.append<RS.OrderProduct>(products, [item]);
                    };
                  };
                };
              };
              let uuid = await createUUID();
              let treasuryAmount = totalAmountICP * treasuryContribution;
              // collect treasury
              if (treasuryAmount > 0.0) {
                let amount = Int64.toNat64(Float.toInt64(treasuryAmount));
                switch (await deposit(amount, caller)) {
                  case (#ok(bIndex)) {
                    // record transaction
                    await recordTransaction(
                      caller,
                      amount,
                      caller,
                      Principal.fromActor(this),
                      #collectTreasuryContribution,
                      ?uuid,
                      bIndex
                    );
                  };
                  case (#err(error)) {
                    return #err(error);
                  };
                };
              };
              let id = await setRBOrder(
                manager.brandId,
                stationId,
                products,
                totalAmount,
                note,
                [history],
                ?uuid
              );
              #ok(id);
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getRBOrder(orderId : Text) : async Response<Types.RBOrder> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.orders.get(orderId)) {
      case (null) { #err(#NotFound) };
      case (?order) {
        #ok(order);
      };
    };
  };

  public shared ({ caller }) func updateRBOrder(
    uuid : Text,
    note : ?Text,
    status : RS.OrderStatus
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (state.refillBrand.orders.get(uuid)) {
      case (null) { #err(#NotFound) };
      case (?order) {
        switch (state.refillBrand.managers.get(caller)) {
          case (null) { #err(#AdminRoleRequired) };
          case (?manager) {
            if (manager.brandId == order.brandId) {
              let history : RS.OrderStatusHistory = {
                status;
                timestamp = Moment.now();
              };
              let id = await setRBOrder(
                manager.brandId,
                order.stationId,
                order.products,
                order.totalAmount,
                note,
                Array.append<RS.OrderStatusHistory>(order.history, [history]),
                ?uuid
              );
              #ok(id);
            } else {
              #err(#AdminRoleRequired);
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func listRBOrders() : async Response<[(Text, Types.RBOrder)]> {
    switch (state.refillBrand.managers.get(caller)) {
      case (null) { #err(#AdminRoleRequired) };
      case (?manager) {
        var results : [(Text, Types.RBOrder)] = [];
        for ((uuid, order) in state.refillBrand.orders.entries()) {
          if (order.brandId == manager.brandId) {
            results := Array.append<(Text, Types.RBOrder)>(results, [(uuid, order)]);
          };
        };
        #ok(results);
      };
    };
  };
  /* === End Refill Brand === */

  /* MemoryCard */
  public shared ({ caller }) func memoryCardEngineImportExcel(
    games : [Types.MemoryCardEnginePatternItemGames],
    stages : [Types.MemoryCardEnginePatternItemStages],
    cards : [Types.MemoryCardEnginePatternItemCards]
  ) : async Response<()> {
    if (isAdmin(caller)) {
      for (V in Iter.fromArray(games)) {
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
          case (_) {};
        };
      };
      for (V in Iter.fromArray(stages)) {
        switch (state.memoryCardEngine.stages.get(V.stageId)) {
          case null {
            let stages : Types.MemoryCardEngineStage = {
              gameId = V.gameId;
              name = V.stageName;
              order = V.stageOrder;
            };
            state.memoryCardEngine.stages.put(V.stageId, stages);
          };
          case (_) {};
        };
      };
      for (V in Iter.fromArray(cards)) {
        switch (state.memoryCardEngine.cards.get(V.cardId)) {
          case null {
            let cards : Types.MemoryCardEngineCard = {
              stageId = V.stageId;
              cardType = V.cardType;
              data = V.cardData;
            };
            state.memoryCardEngine.cards.put(V.cardId, cards);
          };
          case (_) {};
        };
      };
      #ok();
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineAllGames() : async Response<[(Text, Types.MemoryCardEngineGame)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      #ok(Iter.toArray(state.memoryCardEngine.games.entries()));
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineGameChangeStatus(gameId : Text, newStatus : Bool) : async Response<()> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      switch (state.memoryCardEngine.games.get(gameId)) {
        case null #err(#NotFound);
        case (?prev) {
          let gameUpdate : Types.MemoryCardEngineGame = {
            slug = prev.slug; //unique
            name = prev.name;
            image = prev.image;
            description = prev.description;
            status = newStatus;
          };
          let _ = state.memoryCardEngine.games.replace(gameId, gameUpdate);
          #ok();
        };
      };
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineStageDelete(stageId : Text) : async Response<()> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      state.memoryCardEngine.stages.delete(stageId);
      for ((K, V) in state.memoryCardEngine.cards.entries()) {
        if (Text.equal(V.stageId, stageId)) {
          state.memoryCardEngine.cards.delete(K);
        };
      };
      #ok();
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineAllStages() : async Response<[(Text, Types.MemoryCardEngineStage)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      #ok(Iter.toArray(state.memoryCardEngine.stages.entries()));
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineAllCards() : async Response<[(Text, Types.MemoryCardEngineCard)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      #ok(Iter.toArray(state.memoryCardEngine.cards.entries()));
    } else {
      #err(#AdminRoleRequired);
    };
  };

  /* Client query data memoryCardEngine */
  public query ({ caller }) func memoryCardEngineSlugEnabled() : async Response<[(Text, Types.MemoryCardEngineGame)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    var result : [(Text, Types.MemoryCardEngineGame)] = [];
    let games = state.memoryCardEngine.games.entries();
    for ((K, V) in state.memoryCardEngine.games.entries()) {
      if ((V.status == true)) {
        result := Array.append(result, [(K, V)]);
      };
    };
    #ok(result);
  };

  public query ({ caller }) func memoryCardEngineStages(gameId : Text) : async Response<[?(Text, Types.MemoryCardEngineStage)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    var stages : [?(Text, Types.MemoryCardEngineStage)] = [];
    for ((K, V) in state.memoryCardEngine.stages.entries()) {
      if (V.gameId == gameId) {
        stages := Array.append(stages, [?(K, V)]);
      };
    };
    #ok(stages);
  };

  public query ({ caller }) func memoryCardEngineCards(stageId : Text) : async Response<[?(Text, Types.MemoryCardEngineCard)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    var cards : [?(Text, Types.MemoryCardEngineCard)] = [];
    for ((K, V) in state.memoryCardEngine.cards.entries()) {
      if (V.stageId == stageId) {
        cards := Array.append(cards, [?(K, V)]);
      };
    };
    #ok(cards);
  };

  public query func memoryCardEngineGetPlayer(caller : Principal, gameId : Text, gameSlug : Text) : async Response<(Text, Types.MemoryCardEnginePlayer)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    let accountId = Account.toText(Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller)));
    var player : ?(Text, Types.MemoryCardEnginePlayer) = null;
    let players = state.memoryCardEngine.players.entries();
    label playerLabel loop {
      switch (players.next()) {
        case (?(K, V)) {
          if (
            Int.greater(Moment.diff(?V.createdAt), 0) and Text.equal(V.aId, accountId) and Text.equal(V.gameId, gameId) and Text.equal(V.gameSlug, gameSlug)
          ) {
            player := ?(K, V);
            break playerLabel;
          };
        };
        case (null) break playerLabel;
      };
    };
    switch (player) {
      case null #err(#NotFound);
      case (?V) #ok(V);
    };
  };

  private func duplicateAndShuffleEngineCards(stageId : Text) : async [?(Text, Types.MemoryCardEngineCard)] {
    // duplicate MemoryCardEngineCards
    var list : [?(Text, Types.MemoryCardEngineCard)] = [];
    for ((K, V) in state.memoryCardEngine.cards.entries()) {
      if (V.stageId == stageId) {
        if (not (Text.startsWith(V.data, #text "https://"))) {
          var temp = Text.split(V.data, #text ":");
          list := Array.append<?(Text, Types.MemoryCardEngineCard)>(
            list,
            [
              ?(
                K,
                {
                  stageId = V.stageId;
                  cardType = V.cardType;
                  data = Option.get(temp.next(), V.data);
                }
              )
            ]
          );
          list := Array.append<?(Text, Types.MemoryCardEngineCard)>(
            list,
            [
              ?(
                K,
                {
                  stageId = V.stageId;
                  cardType = V.cardType;
                  data = Option.get(temp.next(), V.data);
                }
              )
            ]
          );
        } else {
          list := Array.append<?(Text, Types.MemoryCardEngineCard)>(list, [?(K, V)]);
          list := Array.append<?(Text, Types.MemoryCardEngineCard)>(list, [?(K, V)]);
        };
      };
    };

    // shuffle MemoryCardEngineCards
    var shuffleList : [var ?(Text, Types.MemoryCardEngineCard)] = Array.thaw(list);
    let size = list.size();
    let iter = Array.tabulate<?(Text, Types.MemoryCardEngineCard)>(size, func(n : Nat) : ?(Text, Types.MemoryCardEngineCard) { list[size - 1 - n] }).keys();
    for (i in iter) {
      let j : Nat = Int.abs(Float.toInt(await Random.randomNumber(0.0, Float.fromInt(i +1))));
      let temp = shuffleList[i];
      shuffleList[i] := shuffleList[j];
      shuffleList[j] := temp;
    };
    Array.freeze(shuffleList);
  };

  public shared ({ caller }) func memoryCardEngineStartStage(gameId : Text, stageId : Text, playerId : ?Text, gameSlug : Text) : async Response<([?(Text, Types.MemoryCardEngineCard)], Text)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };

    var stagesSize : Nat = 0;
    for (V in state.memoryCardEngine.stages.vals()) {
      if (V.gameId == gameId) stagesSize += 1;
    };

    let duplicateAndShuffleCards = await duplicateAndShuffleEngineCards(stageId);
    switch (playerId) {
      case null {
        let accountId = Account.toText(Account.accountIdentifier(Principal.fromActor(this), Account.principalToSubaccount(caller)));
        let player : Types.MemoryCardEnginePlayer = {
          aId = accountId;
          gameId;
          gameSlug;
          history = [{
            stageId = stageId;
            selected = []; // clear
            turn = 0; // default
            timing = 0; //default
          }];
          createdAt = Moment.now();
          updatedAt = Moment.now();
        };
        let newPlayerId = await createUUID();
        state.memoryCardEngine.players.put(newPlayerId, player);

        var completedCount = 0;
        if (Iter.size(Iter.fromArray(player.history)) == stagesSize) {
          completedCount := 1;
        };
        gamePlayAnalytics := {
          miniGamePlayCount = gamePlayAnalytics.miniGamePlayCount + 1;
          miniGameCompletedCount = gamePlayAnalytics.miniGameCompletedCount + completedCount;
          questPlayCount = gamePlayAnalytics.questPlayCount;
          questCompletedCount = gamePlayAnalytics.questCompletedCount;
        };
        return #ok((duplicateAndShuffleCards, newPlayerId));
      };
      case (?pid) {
        switch (await memoryCardEngineGetPlayer(caller, gameId, gameSlug)) {
          case (#err(error)) {
            return #err(error);
          };
          case (#ok(K, oldData)) {
            let found = Array.find<Types.MemoryCardEngineGameProgress>(
              oldData.history,
              func(h) : Bool {
                Text.equal(stageId, h.stageId);
              }
            );
            switch (found) {
              case null {
                let newValue : Types.MemoryCardEngineGameProgress = {
                  stageId = stageId;
                  selected = [];
                  turn = 0;
                  timing = 0;
                };

                let replacePlayer : Types.MemoryCardEnginePlayer = {
                  aId = oldData.aId;
                  gameId = oldData.gameId;
                  gameSlug = oldData.gameSlug;
                  history = Array.append(oldData.history, [newValue]);
                  createdAt = oldData.createdAt;
                  updatedAt = Moment.now();
                };
                let _ = state.memoryCardEngine.players.replace(pid, replacePlayer);
                if (Iter.size(Iter.fromArray(replacePlayer.history)) == stagesSize) {
                  gamePlayAnalytics := {
                    miniGamePlayCount = gamePlayAnalytics.miniGamePlayCount;
                    miniGameCompletedCount = gamePlayAnalytics.miniGameCompletedCount + 1;
                    questPlayCount = gamePlayAnalytics.questPlayCount;
                    questCompletedCount = gamePlayAnalytics.questCompletedCount;
                  };
                };
                return #ok((duplicateAndShuffleCards, pid));
              };
              case (?V) {
                var newHistory : [Types.MemoryCardEngineGameProgress] = [];

                for (value in oldData.history.vals()) {
                  // kiem tra neu GameProgress co stageId = stageId dau vao thi thay doi GameProgress do, roi dua do mang newHistory
                  if (value.stageId == stageId) {
                    let newValue : Types.MemoryCardEngineGameProgress = {
                      stageId = value.stageId;
                      selected = [];
                      turn = value.turn;
                      timing = value.timing;
                    };
                    newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [newValue]);
                  } else {
                    // neu khong phai thi dua GameProgress do mang newHIstory
                    newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [value]);
                  };
                };

                let replacePlayer : Types.MemoryCardEnginePlayer = {
                  aId = oldData.aId;
                  gameId = oldData.gameId;
                  gameSlug = oldData.gameSlug;
                  history = newHistory;
                  createdAt = oldData.createdAt;
                  updatedAt = Moment.now();
                };
                let _ = state.memoryCardEngine.players.replace(pid, replacePlayer);
                if (Iter.size(Iter.fromArray(replacePlayer.history)) == stagesSize) {
                  gamePlayAnalytics := {
                    miniGamePlayCount = gamePlayAnalytics.miniGamePlayCount;
                    miniGameCompletedCount = gamePlayAnalytics.miniGameCompletedCount + 1;
                    questPlayCount = gamePlayAnalytics.questPlayCount;
                    questCompletedCount = gamePlayAnalytics.questCompletedCount;
                  };
                };
                return #ok((duplicateAndShuffleCards, pid));
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func memoryCardEngineCardPair(pairCard : (Text, Text, Float), gameId : Text, stageId : Text, playerId : Text, gameSlug : Text) : async Response<Bool> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    switch (state.memoryCardEngine.players.get(playerId)) {
      case null { return #err(#NotFound) };
      case (?player) {
        let found = Array.find<Types.MemoryCardEngineGameProgress>(
          player.history,
          func(h) : Bool {
            Text.equal(stageId, h.stageId);
          }
        );
        switch (found) {
          case null {
            return #err(#NotFound);
          };
          case (?V) {
            var newHistory : [Types.MemoryCardEngineGameProgress] = [];

            for (value in player.history.vals()) {
              // kiem tra neu GameProgress co stageId = stageId dau vao thi thay doi GameProgress do, roi dua do mang newHistory
              if (value.stageId == stageId) {

                let newValue : Types.MemoryCardEngineGameProgress = {
                  stageId = value.stageId;
                  selected = Array.append(value.selected, [?pairCard]);
                  turn = value.turn;
                  timing = value.timing;
                };
                newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [newValue]);
              } else {
                // neu khong phai thi dua GameProgress do mang newHIstory
                newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [value]);
              };
            };
            let replacePlayer : Types.MemoryCardEnginePlayer = {
              aId = player.aId;
              gameId = player.gameId;
              gameSlug = player.gameSlug;
              history = newHistory;
              createdAt = player.createdAt;
              updatedAt = Moment.now();
            };
            let _ = state.memoryCardEngine.players.replace(playerId, replacePlayer);
            return #ok(Text.equal(pairCard.0, pairCard.1));
          };
        };
      };
    };
  };

  public shared ({ caller }) func memoryCardEngineCompletedStage(selected : [?(Text, Text)], stageId : Text, playerId : Text) : async Response<()> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };

    switch (state.memoryCardEngine.players.get(playerId)) {
      case null { return #err(#NotFound) };
      case (?player) {
        let found = Array.find<Types.MemoryCardEngineGameProgress>(
          player.history,
          func(h) : Bool {
            Text.equal(stageId, h.stageId);
          }
        );
        switch (found) {
          case null {
            return #err(#NotFound);
          };
          case (?V) {
            var newHistory : [Types.MemoryCardEngineGameProgress] = [];
            for (value in player.history.vals()) {
              if (
                value.stageId == stageId and Int.greater(value.selected.size(), 0) and Nat.equal(value.turn, 0) and Float.equal(value.timing, 0)
              ) {
                var temp : Float = 0;
                var isCheating = false;
                let oldSelected : [?(Text, Text)] = Array.map(
                  value.selected,
                  func(s : ?(Text, Text, Float)) : ?(Text, Text) {
                    switch (s) {
                      case null { return null };
                      case (?v) {
                        if (temp < v.2) {
                          temp := v.2;
                        } else {
                          isCheating := true;
                        };
                        return ?(v.0, v.1);
                      };
                    };
                  }
                );

                if (selected == oldSelected and not (isCheating)) {
                  //cheat
                  let newValue : Types.MemoryCardEngineGameProgress = {
                    stageId = value.stageId;
                    selected = value.selected;
                    turn = selected.size();
                    timing = switch (value.selected[value.selected.size() -1]) {
                      case null { 0 };
                      case (?s) { s.2 };
                    };
                  };
                  newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [newValue]);
                } else {
                  newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [value]);
                };
              } else {
                newHistory := Array.append<Types.MemoryCardEngineGameProgress>(newHistory, [value]);
              };
            };

            let replacePlayer : Types.MemoryCardEnginePlayer = {
              aId = player.aId;
              gameId = player.gameId;
              gameSlug = player.gameSlug;
              history = newHistory;
              createdAt = player.createdAt;
              updatedAt = Moment.now();
            };
            let _ = state.memoryCardEngine.players.replace(playerId, replacePlayer);
            return #ok(());
          };
        };
      };
    };
  };

  public query ({ caller }) func memoryCardEngineListOfDay(gameId : Text, gameSlug : Text) : async Response<[?Types.MemoryCardEnginePlayer]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    var listTop : [?Types.MemoryCardEnginePlayer] = [];
    var stagesSize : Int = 0;
    for (V in state.memoryCardEngine.stages.vals()) {
      if (V.gameId == gameId) stagesSize += 1;
    };
    for ((K, V) in state.memoryCardEngine.players.entries()) {
      if (
        Int.greater(Moment.diff(?V.createdAt), 0) and Iter.size(Iter.fromArray(V.history)) == stagesSize and Text.equal(gameSlug, V.gameSlug) and Text.equal(gameId, V.gameId)
      ) {
        var temp = true;
        for (value in V.history.vals()) {
          if (
            Nat.equal(value.turn, 0) and Float.equal(value.timing, 0)
          ) {
            temp := false;
          };
        };
        if (temp) {
          listTop := Array.append(listTop, [?V]);
        };
      };
    };
    #ok(listTop);
  };

  public query ({ caller }) func memoryCardEngineListOfYesterday(gameId : Text, gameSlug : Text) : async Response<[?(Text, Types.MemoryCardEnginePlayer)]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      throw Error.reject("NotAuthorized"); //isNotAuthorized
    };
    var listTop : [?(Text, Types.MemoryCardEnginePlayer)] = [];
    var stagesSize : Int = 0;
    for (V in state.memoryCardEngine.stages.vals()) {
      if (V.gameId == gameId) stagesSize += 1;
    };
    for ((K, V) in state.memoryCardEngine.players.entries()) {
      if (
        Moment.yesterday(V.createdAt) and Iter.size(Iter.fromArray(V.history)) == stagesSize and Text.equal(gameSlug, V.gameSlug) and Text.equal(gameId, V.gameId)
      ) {
        var temp = true;
        for (value in V.history.vals()) {
          if (
            Nat.equal(value.turn, 0) and Float.equal(value.timing, 0)
          ) {
            temp := false;
          };
        };
        if (temp) {
          listTop := Array.append(listTop, [?(K, V)]);
        };
      };
    };
    #ok(listTop);
  };

  public shared ({ caller }) func memoryCardEngineListAll(gameId : Text, gameSlug : Text) : async Response<[Types.MemoryCardEnginePlayer]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      var listTop : [Types.MemoryCardEnginePlayer] = [];
      for (V in state.memoryCardEngine.players.vals()) {
        if (Text.equal(gameSlug, V.gameSlug) and Text.equal(gameId, V.gameId)) {
          var temp = true;
          for (value in V.history.vals()) {
            if (
              Nat.equal(value.turn, 0) and Float.equal(value.timing, 0)
            ) {
              temp := false;
            };
          };
          if (temp) {
            listTop := Array.append(listTop, [V]);
          };
        };
      };
      #ok(listTop);
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineCheckReward(id : Text) : async Response<?Types.MemoryCardEngineReward> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
      #ok(state.memoryCardEngine.rewards.get(id));
    } else {
      #err(#AdminRoleRequired);
    };
  };

  public shared ({ caller }) func memoryCardEngineReward(
    playerId : Text,
    reward : Float,
    uid : Principal
  ) : async Response<()> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); // isNotAuthorized
    };
    if (isAdmin(caller)) {
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
    } else {
      #err(#AdminRoleRequired);
    };
  };

  // Game
  public shared ({ caller }) func payQuest(questId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.quests.get(questId)) {
      case null { #err(#NotFound) };
      case (?quest) {
        switch (await deposit(quest.price, caller)) {
          case (#ok(bIndex)) {
            await recordTransaction(
              caller,
              quest.price,
              caller,
              Principal.fromActor(this),
              #payQuest,
              ?questId,
              bIndex
            );
            #ok("Success");
          };
          case (#err(error)) {
            #err(error);
          };
        };
      };
    };
  };

  // Character Class
  public shared ({ caller }) func createCharacterClass(characterClass : Types.CharacterClass) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(characterClass.id);
    switch (rsCharacterClass) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        CharacterClass.create(characterClass, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readCharacterClass(id : Text) : async Response<(Types.CharacterClass)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(id);
    return Result.fromOption(rsCharacterClass, #NotFound);
  };

  public shared query ({ caller }) func listCharacterClasses() : async Response<[(Text, Types.CharacterClass)]> {
    var list : [(Text, Types.CharacterClass)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.characterClasses.entries()) {
      list := Array.append<(Text, Types.CharacterClass)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateCharacterClass(characterClass : Types.CharacterClass) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(characterClass.id);
    switch (rsCharacterClass) {
      case null { #err(#NotFound) };
      case (?V) {
        CharacterClass.update(characterClass, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteCharacterClass(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacterClass = state.characterClasses.get(id);
    switch (rsCharacterClass) {
      case null { #err(#NotFound) };
      case (?V) {
        let deletedCharacterClass = state.characterClasses.delete(id);
        #ok("Success");
      };
    };
  };

  // Character
  public shared ({ caller }) func createCharacter(characterClassId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let uuid : Text = await createUUID();
    var canCreate = true;
    let rsCharacterClass = state.characterClasses.get(characterClassId);
    let godUser1 = "eoaxc-owf3f-kl22c-6a7xx-me7xi-idp7u-6mkef-3ek3w-vkyrf-deavj-pqe";
    let godUser2 = "wijp2-ps7be-cocx3-zbfru-uuw2q-hdmpl-zudjl-f2ofs-7qgni-t7ik5-lqe";
    let godUser3 = "u3z7x-q4qn7-kju5f-yew6e-kx3qy-rzmdy-nrqwl-tpynd-6nd2k-lkc37-fqe";
    if (Principal.toText(caller) == godUser1 
        or Principal.toText(caller) == godUser2 
        or Principal.toText(caller) == godUser3) {
      for ((K, character) in state.characters.entries()) {
        if (character.userId == Principal.fromText(godUser1) 
            or character.userId == Principal.fromText(godUser2) 
            or character.userId == Principal.fromText(godUser3)) {
          state.characters.delete(character.id);
        };
      };
    };
    switch (rsCharacterClass) {
      case (?characterClass) {
        for ((K, character) in state.characters.entries()) {
          if (character.userId == caller) {
            canCreate := false;
          };
        };
        if (canCreate == true) {
          Character.create(caller, uuid, characterClass, state);
        };
        #ok("Success");
      };
      case null {
        #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getCharacterStatus() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var rs : Text = "";
    for ((K, character) in state.characters.entries()) {
      if (character.userId == caller) {
        rs := character.status;
      };
    };
    #ok(rs);
  };

  public shared query ({ caller }) func readCharacter() : async Response<(Text, Types.Character)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var result : [(Text, Types.Character)] = [];
    for ((key, character) in state.characters.entries()) {
      if (character.userId == caller) {
        result := Array.append<(Text, Types.Character)>(result, [(key, character)]);
      };
    };
    #ok(result[0]);
  };

  public shared query ({ caller }) func listCharacters() : async Response<[(Text, Types.Character)]> {
    var list : [(Text, Types.Character)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((key, character) in state.characters.entries()) {
      if (character.userId == caller) {
        list := Array.append<(Text, Types.Character)>(list, [(key, character)]);
      };
    };
    #ok((list));
  };

  public shared query ({ caller }) func listAllCharacters() : async Response<[(Text, Types.Character)]> {
    var list : [(Text, Types.Character)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((key, character) in state.characters.entries()) {
      list := Array.append<(Text, Types.Character)>(list, [(key, character)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateCharacter(character : Types.Character) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacter = state.characters.get(character.id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?V) {
        Character.update(character, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteCharacter(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacter = state.characters.get(id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedCharacter = state.characters.delete(id);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func resetCharacterStat() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    for ((K, character) in state.characters.entries()) {
      if (character.userId == caller) {
        for ((K, characterClass) in state.characterClasses.entries()) {
          if (character.classId == characterClass.id) {
            Character.resetStat(caller, character.id, characterClass, state);
          };
        };
      };
    };
    #ok("Success");
  };

  public shared ({ caller }) func takeOption(eventId : Text) : async Response<[Types.Character]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var result : [Types.Character] = [];
    for ((K, character) in state.characters.entries()) {
      if (character.userId == caller) {
        for ((K, eventOption) in state.eventOptions.entries()) {
          if (eventOption.eventId == eventId) {
            var strengthRequire : Float = 0;
            for (item in state.items.vals()) {
              if (item.id == eventOption.requireItemId) {
                strengthRequire := item.strengthRequire;
              };
            };
            result := Array.append<Types.Character>(result, [await Character.takeOption(character, strengthRequire, eventOption, state)]);
          };
        };
      };
    };
    #ok(result);
  };

  public shared ({ caller }) func gainCharacterExp(character : Types.Character) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    gamePlayAnalytics := {
      miniGamePlayCount = gamePlayAnalytics.miniGamePlayCount;
      miniGameCompletedCount = gamePlayAnalytics.miniGameCompletedCount;
      questPlayCount = gamePlayAnalytics.questPlayCount;
      questCompletedCount = gamePlayAnalytics.questCompletedCount + 1;
    };

    Debug.print(debug_show (gamePlayAnalytics));
    let rsCharacter = state.characters.get(character.id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?V) {
        Character.gainCharacterExp(character, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func useHpPotion(characterId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let userId = Principal.toText(caller);
    let rsCharacter = state.characters.get(characterId);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?character) {
        switch (state.eventItems.get(userId)) {
          case (null) { #err(#NotFound) };
          case (?eventItem) {
            for ((_, usableItem) in state.usableItems.entries()) {
              if (eventItem.itemId == usableItem.id) {
                let deleted = state.eventItems.delete(userId);
              };
            };
            #ok("Success");
          };
        };
      };
    };
  };

  public shared query ({ caller }) func getRemainingTime(waitingTime : Int, character : Types.Character) : async Response<Int> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacter = state.characters.get(character.id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?V) {
        return #ok(Character.getRemainingTime(waitingTime, character));
      };
    };
  };

  public shared ({ caller }) func createCharacterTakesOption(id : Text, characterId : Text, eventOptionId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsCharacter = state.characters.get(characterId);
    switch (rsCharacter) {
      case null { #err(#NotFound) };
      case (?character) {
        CharacterTakesOption.create(id, character, eventOptionId, state);
        #ok("Success");
      };
    };
  };

  // Character Takes Items
  public shared ({ caller }) func createCharacterSelectsItems(characterId : Text, itemIds : [Text]) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let uuid : Text = await createUUID();

    let rsCharacter = state.characters.get(characterId);
    switch (rsCharacter) {
      case (?character) {
        for ((K, characterSelectsItem) in state.characterSelectsItems.entries()) {
          if (characterSelectsItem.characterId == characterId) {
            state.characterSelectsItems.delete(K);
          };
        };
        let rs = state.characterSelectsItems.put(
          uuid,
          {
            characterId = characterId;
            itemIds = itemIds;
          }
        );
        gamePlayAnalytics := {
          miniGamePlayCount = gamePlayAnalytics.miniGamePlayCount;
          miniGameCompletedCount = gamePlayAnalytics.miniGameCompletedCount;
          questPlayCount = gamePlayAnalytics.questPlayCount + 1;
          questCompletedCount = gamePlayAnalytics.questCompletedCount;
        };
        #ok("Success");
      };
      case null {
        #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func listCharacterSelectsItems(characterId : Text) : async Response<[Text]> {
    var list : [Text] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((_, characterSelectsItems) in state.characterSelectsItems.entries()) {
      if (characterSelectsItems.characterId == characterId) {
        list := characterSelectsItems.itemIds;
      };
    };
    #ok((list));
  };

  public shared query ({ caller }) func listAllCharacterSelectsItems() : async Response<[Types.CharacterSelectsItems]> {
    var list : [Types.CharacterSelectsItems] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((_, characterSelectsItems) in state.characterSelectsItems.entries()) {
      list := Array.append<Types.CharacterSelectsItems>(list, [characterSelectsItems]);
    };
    #ok((list));
  };

  // Character Collects Materials
  public shared ({ caller }) func collectsMaterials(eventId : Text) : async Response<[Types.CharacterCollectsMaterials]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var result : [Types.CharacterCollectsMaterials] = [];
    for ((K, character) in state.characters.entries()) {
      if (character.userId == caller) {
        for ((K, eventOption) in state.eventOptions.entries()) {
          if (eventOption.eventId == eventId) {
            let characterCollectMaterial = await CharacterCollectsMaterials.collectsMaterials(character.id, eventOption, state);
            result := Array.append<Types.CharacterCollectsMaterials>(result, [characterCollectMaterial]);
          };
        };
      };
    };
    #ok(result);
  };

  public shared ({ caller }) func createCharacterCollectsMaterials(characterCollectMaterial : Types.CharacterCollectsMaterials) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    if (characterCollectMaterial.materialId != "") {
      let rsCharacterCollectsMaterials = state.characterCollectsMaterials.get(characterCollectMaterial.id);
      switch (rsCharacterCollectsMaterials) {
        case (?V) {
          let updated = CharacterCollectsMaterials.update(characterCollectMaterial, state);
        };
        case null {
          let created = CharacterCollectsMaterials.create(characterCollectMaterial, state);
        };
      };
    };
    #ok("Success");
  };

  public shared ({ caller }) func resetCharacterCollectsMaterials(characterId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, characterCollectMaterial) in state.characterCollectsMaterials.entries()) {
      if (characterCollectMaterial.characterId == characterId) {
        let updated = state.characterCollectsMaterials.remove(characterCollectMaterial.id);
      };
    };
    #ok("Success");
  };

  public shared query ({ caller }) func listCharacterCollectsMaterials(characterId : Text) : async Response<[{ materialName : Text; amount : Int }]> {
    var list : [{ materialName : Text; amount : Int }] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((key, characterCollectMaterial) in state.characterCollectsMaterials.entries()) {
      if (characterCollectMaterial.characterId == characterId) {
        for ((K, V) in state.materials.entries()) {
          if (characterCollectMaterial.materialId == K) {
            list := Array.append<{ materialName : Text; amount : Int }>(list, [{ materialName = V.name; amount = characterCollectMaterial.amount }]);
          };
        };
      };
    };
    #ok(list);
  };

  // Quest
  public shared ({ caller }) func createQuest(quest : Types.Quest) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsQuest = state.quests.get(quest.id);
    switch (rsQuest) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        Quest.create(quest, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readQuest(id : Text) : async Response<(Types.Quest)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuest = state.quests.get(id);
    return Result.fromOption(rsQuest, #NotFound);
  };

  public shared query ({ caller }) func listQuests() : async Response<[(Text, Types.Quest)]> {
    var list : [(Text, Types.Quest)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.quests.entries()) {
      list := Array.append<(Text, Types.Quest)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateQuest(quest : Types.Quest) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuest = state.quests.get(quest.id);
    switch (rsQuest) {
      case null { #err(#NotFound) };
      case (?V) {
        Quest.update(quest, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteQuest(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuest = state.quests.get(id);
    switch (rsQuest) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedQuest = state.quests.delete(id);
        #ok("Success");
      };
    };
  };

  // Item
  public shared ({ caller }) func createItem(item : Types.Item) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsItem = state.items.get(item.id);
    switch (rsItem) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        Item.create(item, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readItem(id : Text) : async Response<(Types.Item)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsItem = state.items.get(id);
    return Result.fromOption(rsItem, #NotFound);
  };

  public shared query ({ caller }) func listItems() : async Response<[(Text, Types.Item)]> {
    var list : [(Text, Types.Item)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.items.entries()) {
      list := Array.append<(Text, Types.Item)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateItem(item : Types.Item) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsItem = state.items.get(item.id);
    switch (rsItem) {
      case null { #err(#NotFound) };
      case (?V) {
        Item.update(item, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteItem(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsItem = state.items.get(id);
    switch (rsItem) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedItem = state.items.delete(id);
        #ok("Success");
      };
    };
  };

  // Usable Item
  public shared ({ caller }) func createUsableItem(usableItem : Types.UsableItem) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsUsableItem = state.usableItems.get(usableItem.id);
    switch (rsUsableItem) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        state.usableItems.put(
          usableItem.id,
          {
            id = usableItem.id;
            name = usableItem.name;
            image = usableItem.image;
            increaseStat = usableItem.increaseStat;
            effect = usableItem.effect;
          }
        );
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func getHpPotion() : async Response<Types.UsableItem> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rs = state.usableItems.get("ui1");
    return Result.fromOption(rs, #NotFound);
  };

  // Event Item
  public shared ({ caller }) func canGetARItem(eventItemId : Text) : async Response<Bool> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let userId = Principal.toText(caller);
    // let uuid : Text = await createUUID();
    var canAR : Bool = false;
    let rsARItem = state.arItems.get(userId);
    switch (state.usableItems.get(eventItemId)) {
      case null { #err(#NotFound) };
      case (?item) {
        if (isAdmin(caller)) {
          switch (rsARItem) {
            case (?V) {
              let updatedARItem = state.arItems.replace(
                userId,
                {
                  userId = caller;
                  itemId = eventItemId;
                }
              );
              let updatedEventItem = state.eventItems.replace(
                userId,
                {
                  userId = caller;
                  itemId = eventItemId;
                }
              );
              canAR := true;
              #ok(canAR);
            };
            case null {
              state.arItems.put(
                userId,
                {
                  userId = caller;
                  itemId = eventItemId;
                }
              );
              state.eventItems.put(
                userId,
                {
                  userId = caller;
                  itemId = eventItemId;
                }
              );
              canAR := true;
              #ok(canAR);
            };
          };
        } else {
          switch (rsARItem) {
            case (?V) { #ok(canAR) };
            case null {
              state.arItems.put(
                userId,
                {
                  userId = caller;
                  itemId = eventItemId;
                }
              );
              state.eventItems.put(
                userId,
                {
                  userId = caller;
                  itemId = eventItemId;
                }
              );
              canAR := true;
              #ok(canAR);
            };
          };
        };
      };
    };
  };

  public shared query ({ caller }) func listARItems() : async Response<[Types.ARItem]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var list : [Types.ARItem] = [];
    for ((_, V) in state.arItems.entries()) {
      list := Array.append<Types.ARItem>(list, [V]);
    };
    #ok(list);
  };

  public shared ({ caller }) func deleteARItem(userId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.arItems.get(userId)) {
      case null { #err(#NotFound) };
      case (?V) {
        state.arItems.delete(userId);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func createEventItem(userId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.eventItems.get(userId)) {
      case null {
        state.eventItems.put(
          userId,
          {
            itemId = "ui1";
            userId = Principal.fromText(userId);
          }
        );
        #ok("Success");
      };
      case (?V) {
        #err(#AlreadyExisting);
      };
    };
  };

  public shared query ({ caller }) func loadEventItem() : async Response<Types.EventItem> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let userId = Principal.toText(caller);
    let rsEventItem = state.eventItems.get(userId);
    return Result.fromOption(rsEventItem, #NotFound);
  };

  public shared ({ caller }) func deleteEventItem() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.eventItems.get(Principal.toText(caller))) {
      case null { #err(#NotFound) };
      case (?V) {
        state.eventItems.delete(Principal.toText(caller));
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteAllEventItems() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.eventItems.entries()) {
      state.eventItems.delete(K);
    };
    #ok("Success");
  };

  public shared query ({ caller }) func listAllEventItems() : async Response<[Types.EventItem]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var list : [Types.EventItem] = [];
    for ((_, V) in state.eventItems.entries()) {
      list := Array.append<Types.EventItem>(list, [V]);
    };
    #ok(list);
  };

  // Quest Item
  public shared ({ caller }) func createQuestItem(questItem : Types.QuestItem) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsquestItem = state.questItems.get(questItem.id);
    switch (rsquestItem) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        QuestItem.create(questItem, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listQuestItems(questId : Text) : async Response<[Types.Item]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var list : [Types.Item] = [];
    for ((_, questItem) in state.questItems.entries()) {
      if (questItem.questId == questId) {
        let rsItem = state.items.get(questItem.itemId);
        switch (rsItem) {
          case null { () };
          case (?item) {
            list := Array.append<Types.Item>(list, [item]);
          };
        };
      };
    };
    #ok((list));
  };

  public shared ({ caller }) func updateQuestItem(questItem : Types.QuestItem) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsquestItem = state.questItems.get(questItem.id);
    switch (rsquestItem) {
      case null { #err(#NotFound) };
      case (?V) {
        QuestItem.update(questItem, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteQuestItem(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsquestItem = state.questItems.get(id);
    switch (rsquestItem) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedquestItem = state.questItems.delete(id);
        #ok("Success");
      };
    };
  };

  // Event
  public shared ({ caller }) func createEvent(event : Types.Event) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsQuest = state.quests.get(event.questId);
    let rsEvent = state.events.get(event.id);
    switch (rsQuest) {
      case null { #err(#NotFound) };
      case (?quest) {
        switch (rsEvent) {
          case (?event) { #err(#AlreadyExisting) };
          case null {
            Event.create(event, state);
            #ok("Success");
          };
        };
      };
    };
  };

  public shared query ({ caller }) func readEvent(id : Text) : async Response<(Types.Event)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.events.get(id);
    return Result.fromOption(rsEvent, #NotFound);
  };

  public shared query ({ caller }) func listEvents() : async Response<[(Text, Types.Event)]> {
    var list : [(Text, Types.Event)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.events.entries()) {
      list := Array.append<(Text, Types.Event)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateEvent(event : Types.Event) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.events.get(event.id);
    switch (rsEvent) {
      case null { #err(#NotFound) };
      case (?V) {
        Event.update(event, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.events.get(id);
    switch (rsEvent) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedEvent = state.events.delete(id);
        #ok("Success");
      };
    };
  };

  // Event Option
  public shared ({ caller }) func createEventOption(eventOption : Types.EventOption) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsEvent = state.events.get(eventOption.eventId);
    let rsEventOption = state.eventOptions.get(eventOption.id);
    switch (rsEvent) {
      case null { #err(#NotFound) };
      case (?event) {
        switch (rsEventOption) {
          case (?eventOption) { #err(#AlreadyExisting) };
          case null {
            EventOption.create(eventOption, state);
            #ok("Success");
          };
        };
      };
    };
  };

  public shared query ({ caller }) func readEventOption(id : Text) : async Response<(Types.EventOption)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEventOption = state.eventOptions.get(id);
    return Result.fromOption(rsEventOption, #NotFound);
  };

  public shared query ({ caller }) func listAllEventOptions() : async Response<[(Text, Types.EventOption)]> {
    var list : [(Text, Types.EventOption)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.eventOptions.entries()) {
      list := Array.append<(Text, Types.EventOption)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared query ({ caller }) func listEventOptions(eventId : Text, selectedItemIds : [Text]) : async Response<[(Bool, Types.EventOption)]> {
    var list : [(Bool, Types.EventOption)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, eventOption) in state.eventOptions.entries()) {
      var canTakeOption : Bool = false;
      if (eventOption.eventId == eventId) {
        if (eventOption.requireItemId == "null") {
          canTakeOption := true;
        } else {
          for (itemId in selectedItemIds.vals()) {
            if (itemId == "null") {
              canTakeOption := false;
            };
            if (itemId == eventOption.requireItemId) {
              canTakeOption := true;
            };
          };
        };
        list := Array.append<(Bool, Types.EventOption)>(list, [(canTakeOption, eventOption)]);
      };
    };
    #ok((list));
  };

  public shared ({ caller }) func updateEventOption(eventOption : Types.EventOption) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEventOption = state.eventOptions.get(eventOption.id);
    switch (rsEventOption) {
      case null { #err(#NotFound) };
      case (?V) {
        EventOption.update(eventOption, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteEventOption(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEventOption = state.eventOptions.get(id);
    switch (rsEventOption) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedEventOption = state.eventOptions.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear
  public shared ({ caller }) func createGear(gearClassId : Text, gear : Types.Gear) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearClass = state.gearClasses.get(gearClassId);
    switch (rsGearClass) {
      case null { #err(#NotFound) };
      case (?V) {
        let rsGear = state.gears.get(gear.id);
        switch (rsGear) {
          case (?V) { #err(#AlreadyExisting) };
          case null {
            Gear.create(gear, state);
            #ok("Success");
          };
        };
      };
    };

  };

  public shared query ({ caller }) func readGear(id : Text) : async Response<(Types.Gear)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGear = state.gears.get(id);
    return Result.fromOption(rsGear, #NotFound);
  };

  public shared query ({ caller }) func listGears() : async Response<[(Text, Types.Gear)]> {
    var list : [(Text, Types.Gear)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.gears.entries()) {
      list := Array.append<(Text, Types.Gear)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateGear(gear : Types.Gear) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGear = state.gears.get(gear.id);
    switch (rsGear) {
      case null { #err(#NotFound) };
      case (?V) {
        Gear.update(gear, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteGear(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGear = state.gears.get(id);
    switch (rsGear) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedGear = state.gears.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear Class
  public shared ({ caller }) func createGearClass(gearClass : Types.GearClass) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearClass = state.gearClasses.get(gearClass.id);
    switch (rsGearClass) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        GearClass.create(gearClass, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readGearClass(id : Text) : async Response<(Types.GearClass)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearClass = state.gearClasses.get(id);
    return Result.fromOption(rsGearClass, #NotFound);
  };

  public shared query ({ caller }) func listGearClasses() : async Response<[(Text, Types.GearClass)]> {
    var list : [(Text, Types.GearClass)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.gearClasses.entries()) {
      list := Array.append<(Text, Types.GearClass)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateGearClass(gearClass : Types.GearClass) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearClass = state.gearClasses.get(gearClass.id);
    switch (rsGearClass) {
      case null { #err(#NotFound) };
      case (?V) {
        GearClass.update(gearClass, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteGearClass(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearClass = state.gearClasses.get(id);
    switch (rsGearClass) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedGearClass = state.gearClasses.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear Rarity
  public shared ({ caller }) func createGearRarity(gearRarity : Types.GearRarity) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearRarity = state.gearRarities.get(gearRarity.id);
    switch (rsGearRarity) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        GearRarity.create(gearRarity, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readGearRarity(id : Text) : async Response<(Types.GearRarity)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearRarity = state.gearRarities.get(id);
    return Result.fromOption(rsGearRarity, #NotFound);
  };

  public shared query ({ caller }) func listGearRarities() : async Response<[(Text, Types.GearRarity)]> {
    var list : [(Text, Types.GearRarity)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.gearRarities.entries()) {
      list := Array.append<(Text, Types.GearRarity)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateGearRarity(gearRarity : Types.GearRarity) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearRarity = state.gearRarities.get(gearRarity.id);
    switch (rsGearRarity) {
      case null { #err(#NotFound) };
      case (?V) {
        GearRarity.update(gearRarity, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteGearRarity(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearRarity = state.gearRarities.get(id);
    switch (rsGearRarity) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedGearRarity = state.gearRarities.delete(id);
        #ok("Success");
      };
    };
  };

  // Gear Substat
  public shared ({ caller }) func createGearSubstat(gearSubstat : Types.GearSubstat) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsGearSubstat = state.gearSubstats.get(gearSubstat.id);
    switch (rsGearSubstat) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        GearSubstat.create(gearSubstat, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readGearSubstat(id : Text) : async Response<(Types.GearSubstat)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearSubstat = state.gearSubstats.get(id);
    return Result.fromOption(rsGearSubstat, #NotFound);
  };

  public shared query ({ caller }) func listgearSubstats() : async Response<[(Text, Types.GearSubstat)]> {
    var list : [(Text, Types.GearSubstat)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.gearSubstats.entries()) {
      list := Array.append<(Text, Types.GearSubstat)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateGearSubstat(gearSubstat : Types.GearSubstat) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearSubstat = state.gearSubstats.get(gearSubstat.id);
    switch (rsGearSubstat) {
      case null { #err(#NotFound) };
      case (?V) {
        GearSubstat.update(gearSubstat, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteGearSubstat(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsGearSubstat = state.gearSubstats.get(id);
    switch (rsGearSubstat) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedGearSubstat = state.gearSubstats.delete(id);
        #ok("Success");
      };
    };
  };

  // Material
  public shared ({ caller }) func createMaterial(material : Types.Material) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsMaterial = state.materials.get(material.id);
    switch (rsMaterial) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        Material.create(material, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readMaterial(id : Text) : async Response<(Types.Material)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsMaterial = state.materials.get(id);
    return Result.fromOption(rsMaterial, #NotFound);
  };

  public shared query ({ caller }) func listMaterials() : async Response<[(Text, Types.Material)]> {
    var list : [(Text, Types.Material)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.materials.entries()) {
      list := Array.append<(Text, Types.Material)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateMaterial(material : Types.Material) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsMaterial = state.materials.get(material.id);
    switch (rsMaterial) {
      case null { #err(#NotFound) };
      case (?V) {
        Material.update(material, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteMaterial(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsMaterial = state.materials.get(id);
    switch (rsMaterial) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedMaterial = state.materials.delete(id);
        #ok("Success");
      };
    };
  };

  // Inventory
  public shared ({ caller }) func createInventory(characterId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, characterCollectMaterial) in state.characterCollectsMaterials.entries()) {
      if (characterCollectMaterial.amount != 0 and characterCollectMaterial.characterId == characterId) {
        let newInventory = await Inventory.storeMaterials(characterCollectMaterial, state);
        let rsInventory = state.inventories.get(newInventory.id);
        switch (rsInventory) {
          case (?V) {
            let updated = Inventory.update(newInventory, state);
          };
          case null {
            let created = Inventory.create(newInventory, state);
          };
        };
      };
    };
    #ok("Success");
  };

  public type InventoryInfo = {
    id : Text;
    characterId : Text;
    materialId : Text;
    materialName : Text;
    amount : Int;
  };

  public shared query ({ caller }) func listInventory(characterId : Text) : async Response<[InventoryInfo]> {
    var list : [InventoryInfo] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((_, inventory) in state.inventories.entries()) {
      if (inventory.characterId == characterId) {
        let rsMaterial = state.materials.get(inventory.materialId);
        switch (rsMaterial) {
          case null {};
          case (?material) {
            let inv : InventoryInfo = {
              id = inventory.id;
              characterId = inventory.characterId;
              materialId = inventory.materialId;
              materialName = material.name;
              amount = inventory.amount;
            };
            list := Array.append<InventoryInfo>(list, [inv]);
          };
        };
      };
    };
    #ok((list));
  };

  public shared ({ caller }) func addInventory(userId : Text, amount : Nat) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((k, character) in state.characters.entries()) {
      if (Principal.toText(character.userId) == userId) {
        for (material in state.materials.vals()) {
          let characterCollectMaterial : Types.CharacterCollectsMaterials = {
            id = await createUUID();
            characterId = character.id;
            materialId = material.id;
            amount = amount;
          };
          let w = await createCharacterCollectsMaterials(characterCollectMaterial);
        };
        let rsInven = await createInventory(character.id);
        let reset_last = await resetCharacterCollectsMaterials(character.id);
      };
    };
    #ok("Success");
  };

  public shared ({ caller }) func subtractInventory(inventoryId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsInventory = state.inventories.get(inventoryId);
    switch (rsInventory) {
      case (null) {
        return #err(#NotFound);
      };
      case (?inventory) {
        let updateInventory : Types.Inventory = {
          id = inventory.id;
          characterId = inventory.characterId;
          materialId = inventory.materialId;
          amount = Int.max(inventory.amount -1, 0);
        };
        let updated = Inventory.update(updateInventory, state);
        return #ok("Success");
      };
    };
  };

  // convert utm2lonlat
  public shared func utm2lonlat(easting : Float, northing : Float, zoneNum : Int32, zoneLetter : Text) : async (Float, Float) {
    let result = await georust.proj(easting, northing, zoneNum, zoneLetter);
    return result;
  };
  public shared func randomIndex(begin : Float, end : Float) : async Int {
    let result = await georust.randomnumber(begin, end);
    return Nat64.toNat(result);
  };

  public shared func randomPair(begin : Float, end : Float) : async (Int, Int) {
    let result = await georust.randompair(begin, end);
    return (Nat64.toNat(result.0), Nat64.toNat(result.1));
  };

  // convert i,j to geometry with lat,lng
  public shared func landSlotToGeometry(i : Nat, j : Nat) : async Types.Geometry {
    let latlng1 = await utm2lonlat(Float.fromInt(1000 * j), Float.fromInt(1000 * i), 20, "N");
    let latlng2 = await utm2lonlat(Float.fromInt(1000 * (j + 1)), Float.fromInt(1000 * (i + 1)), 20, "N");
    let coordinates = [[
      [latlng1.0, latlng1.1],
      [latlng2.0, latlng1.1],
      [latlng2.0, latlng2.1],
      [latlng1.0, latlng2.1],
      [latlng1.0, latlng1.1]
    ]];
    let geometry : Types.Geometry = {
      i = i;
      j = j;
      zoneNumber = 20;
      zoneLetter = "N";
      coordinates = coordinates;
    };
    return geometry;
  };

  // Land Config
  public shared ({ caller }) func createLandConfig(mapWidth : Int, mapHeight : Int) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let id = Principal.toText(Principal.fromActor(this));
    let rsLandConfig = state.landConfigs.get(id);
    switch (rsLandConfig) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        let newLandConfig : Types.LandConfig = {
          id = id;
          mapWidth = mapWidth;
          mapHeight = mapHeight;
        };
        LandConfig.create(newLandConfig, state);
        #ok("Success");
      };
    };
  };

  // Land Slot
  public shared ({ caller }) func createLandSlot(indexRow : Nat, indexColumn : Nat, nationUTMS : [[Nat]], zoneNumber : Nat, zoneLetter : Text, d : Nat) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let newLandSlot : Types.LandSlot = {
      id = Nat.toText(indexRow) # "-" #Nat.toText(indexColumn);
      ownerId = caller;
      isPremium = false;
      isSelling = false;
      indexRow = indexRow;
      indexColumn = indexColumn;
      zoneNumber = zoneNumber;
      zoneLetter = zoneLetter;
      easting = indexColumn * d;
      northing = indexRow * d;
      price = 1;
    };
    let created = state.landSlots.put(newLandSlot.id,newLandSlot);
    // save land transter history
    ignore await createLandTransferHistory(newLandSlot.ownerId, newLandSlot.id, 0.0003);
    // delete user's current buying status
    ignore await deleteLandBuyingStatus(newLandSlot.ownerId);
    // update user nation
    ignore await createNation(newLandSlot.ownerId, newLandSlot.id, nationUTMS);
    #ok("Success");
  };

  public query func purchasedLandSlotsCounter() : async Response<Nat> {
    #ok(state.landSlots.size());
  };

  // Land
  public shared ({ caller }) func buyLandSlot() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    switch (await deposit(30000, caller)) {
      case (#ok(bIndex)) {
        await recordTransaction(
          caller,
          30000,
          caller,
          Principal.fromActor(this),
          #buyLandSlot,
          null,
          bIndex
        );
        #ok("Success");
      };
      case (#err(error)) {
        #err(error);
      };
    };
  };

  public shared ({ caller }) func randomLandSlot() : async Response<Types.Geometry> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsNation = state.nations.get(Principal.toText(caller));
    switch (rsNation) {
      case null {
        let rsLandConfig = state.landConfigs.get(Principal.toText(Principal.fromActor(this)));
        switch (rsLandConfig) {
          case (null) {
            return #err(#NotFound);
          };
          case (?landConfig) {
            var pair = await randomPair(0, Float.fromInt(landConfig.mapHeight -1));
            var i = pair.0;
            var j = pair.1;
            // check to see if random function return already-exist landSlot, if yes run random function again
            label whileloop loop {
              while (true) {
                let rsLandSlot = state.landSlots.get(Int.toText(i) # "-" # Int.toText(j));

                switch (rsLandSlot) {
                  case null {
                    break whileloop;
                  };
                  case (?landSlot) {
                    pair := await randomPair(0, Float.fromInt(landConfig.mapHeight -1));
                    i := pair.0;
                    j := pair.1;
                  };
                };
              };
            };
            return #ok(
              await landSlotToGeometry(Int.abs(i), Int.abs(j))
            );
          };
        };
      };
      case (?nation) {
        let rsLandConfig = state.landConfigs.get(Principal.toText(Principal.fromActor(this)));
        switch (rsLandConfig) {
          case (null) {
            return #err(#NotFound);
          };
          case (?LandConfig) {
            let adjacentLandSlots = await getAdjacentLandSlots(nation.landSlotIds, LandConfig);
            let index = await randomIndex(0.0, Float.fromInt(adjacentLandSlots.size() -1));
            let result = adjacentLandSlots[Int.abs(index)];
            return #ok(
              await landSlotToGeometry(Int.abs(result.i), Int.abs(result.j))
            );
          };
        };
      };
    };
  };

  public shared query ({ caller }) func getAdjacentLandSlots(landSlotIds : [Text], landConfig : Types.LandConfig) : async [{
    i : Int;
    j : Int;
  }] {
    var adjacentLandSlots : [{ i : Int; j : Int }] = [];
    for (landSlotid in landSlotIds.vals()) {
      let rsLandSlot = state.landSlots.get(landSlotid);
      switch (rsLandSlot) {
        case null {};
        case (?landSlot) {
          let indexRow : Int = landSlot.indexRow;
          let indexColumn : Int = landSlot.indexColumn;
          let upLandSlot = state.landSlots.get(Int.toText(indexRow -1) # "-" #Int.toText(indexColumn));
          let downLandSlot = state.landSlots.get(Int.toText(indexRow +1) # "-" #Int.toText(indexColumn));
          let leftLandSlot = state.landSlots.get(Int.toText(indexRow) # "-" #Int.toText(indexColumn -1));
          let rightLandSlot = state.landSlots.get(Int.toText(indexRow) # "-" #Int.toText(indexColumn +1));

          if (upLandSlot == null and indexRow -1 >= 0) {
            adjacentLandSlots := Array.append<{ i : Int; j : Int }>(adjacentLandSlots, [{ i = indexRow -1; j = indexColumn }]);
          };
          if (downLandSlot == null and indexRow +1 <= landConfig.mapHeight -1) {
            adjacentLandSlots := Array.append<{ i : Int; j : Int }>(adjacentLandSlots, [{ i = indexRow +1; j = indexColumn }]);
          };
          if (leftLandSlot == null and indexColumn -1 >= 0) {
            adjacentLandSlots := Array.append<{ i : Int; j : Int }>(adjacentLandSlots, [{ i = indexRow; j = indexColumn -1 }]);
          };
          if (rightLandSlot == null and indexColumn +1 <= landConfig.mapWidth -1) {
            adjacentLandSlots := Array.append<{ i : Int; j : Int }>(adjacentLandSlots, [{ i = indexRow; j = indexColumn +1 }]);
          };
        };
      };
    };
    return adjacentLandSlots;
  };

  public shared query ({ caller }) func listUserLandSlots() : async Response<[Types.LandSlot]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var list : [Types.LandSlot] = [];
    let id = Principal.toText(caller);
    let rsNation = state.nations.get(id);
    switch (rsNation) {
      case null { return #err(#NotFound) };
      case (?nation) {
        for ( landSlotId in nation.landSlotIds.vals() ) {
          let rsLandSlot = state.landSlots.get(landSlotId);
          switch (rsLandSlot) {
            case null {
            };
            case (?landSlot) {
              list := Array.append<Types.LandSlot>(list,[landSlot]);
            };
          };
        };
        return #ok(list);
      };
    };
  };

  public shared query ({ caller }) func listAllLandSlots() : async Response<[(Text, Types.LandSlot)]> {
    var list : [(Text, Types.LandSlot)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((key, landSlot) in state.landSlots.entries()) {
      list := Array.append<(Text, Types.LandSlot)>(list, [(key, landSlot)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func loadNationsArea(beginX : Int, beginY : Int, endX : Int, endY : Int) : async Response<[Types.NationGeometry]> {
    var list : [Types.Nation] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let id = Principal.toText(Principal.fromActor(this));
    let rsLandConfig = state.landConfigs.get(id);
    switch (rsLandConfig) {
      case null {
        return #err(#NotFound);
      };
      case (?landConfig) {
        let iterI = Iter.range(
          Int.abs(Int.max(beginX, 0)),
          Int.abs(Int.min(endX, landConfig.mapHeight -1))
        );
        for (i in iterI) {
          let iterJ = Iter.range(
            Int.abs(Int.max(beginY, 0)),
            Int.abs(Int.min(endY, landConfig.mapWidth -1))
          );
          for (j in iterJ) {
            let id = Nat.toText(i) # "-" #Nat.toText(j);
            let rsLandSlot = state.landSlots.get(id);
            switch (rsLandSlot) {
              case (null) {};
              case (?landSlot) {
                let rsNation = state.nations.get(Principal.toText(landSlot.ownerId));
                switch (rsNation) {
                  case null {};
                  case (?nation) {
                    if (
                      Array.find<Types.Nation>(
                        list,
                        func(val : Types.Nation) : Bool {
                          val == nation;
                        }
                      ) == null
                    ) {
                      list := Array.append<Types.Nation>(list, [nation]);
                    };
                  };
                };
              };
            };
          };
        };

        var geometries : [Types.NationGeometry] = [];
        for (value in list.vals()) {
          var coordinates : [[Float]] = [];
          for (utm in value.utms.vals()) {
            let lonlat = await utm2lonlat(Float.fromInt(utm[1]), Float.fromInt(utm[0]), 20, "N");
            coordinates := Array.append(coordinates, [[lonlat.0, lonlat.1]]);
          };
          let newGeometry : Types.NationGeometry = {
            id = Principal.toText(value.id);
            zoneLetter = "N";
            zoneNumber = 20;
            i = value.indexRow;
            j = value.indexColumn;
            coordinates = [coordinates];
          };
          geometries := Array.append(geometries, [newGeometry]);
        };

        return #ok((geometries));
      };
    };
  };

  // Nation
  public shared ({ caller }) func createNation(ownerId : Principal, landId : Text, nationUTMS : [[Nat]]) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsNation = state.nations.get(Principal.toText(ownerId));
    switch (rsNation) {
      case (null) {
        let nationIndex = await getNationIndex([landId]);
        let newNation = {
          id = ownerId;
          landSlotIds = [landId];
          indexRow = nationIndex.i;
          indexColumn = nationIndex.j;
          utms = nationUTMS;
        };
        let created = Nation.create(newNation, state);
        #ok("Success");
      };
      case (?V) {
        var newLandSlotIds : [Text] = [];
        newLandSlotIds := Array.append<Text>(newLandSlotIds, V.landSlotIds);
        newLandSlotIds := Array.append<Text>(newLandSlotIds, [landId]);
        let nationIndex = await getNationIndex(newLandSlotIds);
        let updateNation = {
          id = ownerId;
          landSlotIds = newLandSlotIds;
          indexRow = nationIndex.i;
          indexColumn = nationIndex.j;
          utms = nationUTMS;
        };
        let updated = Nation.update(updateNation, state);
        #ok("Success");
      };
    };
  };

  // public shared({caller}) func extendNation(d : Nat, utms : [Nation.UTM], newLandSlotId : Text) : async [Nation.UTM] {
  //   let rsNewLandSlot = state.landSlots.get(newLandSlotId);
  //   switch (rsNewLandSlot) {
  //     case null {
  //       return [];
  //     };
  //     case (?newLandSlot) {
  //       let convertedLandslot : [Nation.UTM] = Nation.convertLandslotijToUTM(d, {
  //         i=newLandSlot.indexRow;
  //         j=newLandSlot.indexColumn
  //       });
  //       var currentUTMList : [Nation.UTM] = utms;

  //       var result = Nation.removeDuplicatePoints(
  //         Array.append<Nation.UTM>(currentUTMList, convertedLandslot)
  //       );
  //       for(i in Iter.range(0, currentUTMList.size() - 1)){
  //         for(j in Iter.range(0, convertedLandslot.size() - 1)){
  //           if(currentUTMList[i] == convertedLandslot[j]){
  //             result := Array.filter<Nation.UTM>(result, func(val: Nation.UTM) : Bool { val != currentUTMList[i] });
  //           };
  //         };
  //       };
  //       return result;
  //     };
  //   };
  // };

  public shared ({ caller }) func getNationIndex(landSlotIds : [Text]) : async { i : Nat; j : Nat } {
    var sumRow : Nat = 0;
    var sumColumn : Nat = 0;
    for (id in landSlotIds.vals()) {
      let rsLandSlot = state.landSlots.get(id);
      switch (rsLandSlot) {
        case null {};
        case (?landSlot) {
          sumRow += landSlot.indexRow;
          sumColumn += landSlot.indexColumn;
        };
      };
    };
    return { i = (sumRow / landSlotIds.size()); j = (sumColumn / landSlotIds.size()) };
  };

  public shared query ({ caller }) func readNation() : async Response<(Types.Nation)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let id = Principal.toText(caller);
    let rsNation = state.nations.get(id);
    switch (rsNation) {
      case null { return #err(#NotFound) };
      case (?nation) {
        return #ok(nation);
      };
    };
  };

  public shared query ({ caller }) func listNations() : async Response<[(Text, Types.Nation)]> {
    var list : [(Text, Types.Nation)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.nations.entries()) {
      list := Array.append<(Text, Types.Nation)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // Land Transfer History
  public shared ({ caller }) func createLandTransferHistory(buyerId : Principal, landId : Text, price : Float) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var uuid : Text = await createUUID();
    label whileLoop loop {
      while (true) {
        let rsLandTransferHistory = state.landTransferHistories.get(uuid);
        switch (rsLandTransferHistory) {
          case (?V) {
            uuid := await createUUID();
          };
          case null {
            break whileLoop;
          };
        };
      };
    };
    let newLandTransferHistory : Types.LandTransferHistory = {
      id = uuid;
      buyerId = buyerId;
      ownerId = Principal.fromActor(this);
      landId = landId;
      transferTime = Time.now();
      price = price;
    };
    let created = state.landTransferHistories.put(newLandTransferHistory.id, newLandTransferHistory);
    #ok("Success");
  };

  public shared query ({ caller }) func listLandTransferHistories() : async Response<[(Text, Types.LandTransferHistory)]> {
    var list : [(Text, Types.LandTransferHistory)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.landTransferHistories.entries()) {
      list := Array.append<(Text, Types.LandTransferHistory)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // Land Buying Status
  public shared ({ caller }) func updateLandBuyingStatus(indexRow : Nat, indexColumn : Nat, randomTimes : Nat) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let newGeometry = await landSlotToGeometry(indexRow, indexColumn);

    let newLandBuyingStatus : Types.LandBuyingStatus = {
      id = caller;
      geometry = newGeometry;
      randomTimes = randomTimes;
    };
    let principalId = Principal.toText(caller);
    let rsLandBuyingStatus = state.landBuyingStatuses.get(principalId);
    switch (rsLandBuyingStatus) {
      case (?V) {
        let updated = LandBuyingStatus.update(newLandBuyingStatus, state);
      };
      case null {
        let created = LandBuyingStatus.create(newLandBuyingStatus, state);
      };
    };
    #ok("Success");
  };

  public shared query ({ caller }) func readLandBuyingStatus() : async Response<(Types.LandBuyingStatus)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let id = Principal.toText(caller);
    let rsLandBuyingStatus = state.landBuyingStatuses.get(id);
    switch (rsLandBuyingStatus) {
      case null { return #err(#NotFound) };
      case (?landBuyingStatus) {
        return #ok(landBuyingStatus);
      };
    };
  };

  public shared ({ caller }) func deleteLandBuyingStatus(id : Principal) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsLandBuyingStatus = state.landBuyingStatuses.get(Principal.toText(id));
    switch (rsLandBuyingStatus) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deleted = state.landBuyingStatuses.delete(Principal.toText(id));
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listLandBuyingStatuses() : async Response<[(Text, Types.LandBuyingStatus)]> {
    var list : [(Text, Types.LandBuyingStatus)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.landBuyingStatuses.entries()) {
      list := Array.append<(Text, Types.LandBuyingStatus)>(list, [(K, V)]);
    };
    #ok((list));
  };

   public shared ({ caller }) func addAllInventory(characterId : Text, amount : Int) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (material in state.materials.vals()) {
      var check : Bool = false;
      for((k, v) in state.inventories.entries()){
        if (v.characterId == characterId and v.materialId == material.id){
          let updateInventory : Types.Inventory = {
          id = v.id;
          characterId = characterId;
          materialId = material.id;
          amount = v.amount + amount;
        };
        let update = state.inventories.replace(v.id, updateInventory);
        check := true;
        }
      };
      if (check == false){
        let newInventory : Types.Inventory = {
          id = await createUUID();
          characterId = characterId;
          materialId = material.id;
          amount = amount;
        };
        let newInven = state.inventories.put(newInventory.id, newInventory);
      };
    };
    #ok("Success");
  };

  // Seed
  public shared ({ caller }) func createSeed(seed : Types.Seed) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsSeed = state.seeds.get(seed.id);
    switch (rsSeed) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        Seed.create(seed, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listSeeds() : async Response<[(Text, Types.Seed)]> {
    var list : [(Text, Types.Seed)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.seeds.entries()) {
      list := Array.append<(Text, Types.Seed)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // Plant Tree
  public shared ({ caller }) func plantTree(landId : Text, indexRow : Nat, indexColumn : Nat, materialId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let rsMaterial = state.materials.get(materialId);
    switch (rsMaterial) {
      case null {
        #err(#NotFound);
      };
      case (?material) {
        let rsLandSlot = state.landSlots.get(landId);
        switch (rsLandSlot) {
          case null {
            #err(#NotFound);
          };
          case (?landSlot) {
            let objectId = await createPlant(materialId);
            let createdTile = await createTile(landId, indexRow, indexColumn, objectId);
            return #ok("Success");
          };
        };
      };
    };

  };

  public query func plantedTreesCounter() : async Response<Nat> {
    #ok(state.plants.size());
  };

  // Tile
  public shared ({ caller }) func createTile(landId : Text, indexRow : Nat, indexColumn : Nat, objectId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let tileId = Nat.toText(indexRow) # "-" #Nat.toText(indexColumn);
    let newTile : Types.Tile = {
      id = tileId;
      landSlotId = landId;
      indexRow = indexRow;
      indexColumn = indexColumn;
      objectId = objectId;
    };
    let created = Tile.create(newTile, state);
    return #ok("Success");
  };

  public shared ({ caller }) func loadTilesArea(beginX : Int, beginY : Int, endX : Int, endY : Int) : async Response<[Types.FarmObject]> {
    var list : [Types.FarmObject] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let iterI = Iter.range(Int.abs(beginX), Int.abs(endX));
    for (i in iterI) {
      let iterJ = Iter.range(Int.abs(beginY), Int.abs(endY));
      for (j in iterJ) {
        let id = Nat.toText(i) # "-" #Nat.toText(j);
        let rsTile = state.tiles.get(id);
        switch (rsTile) {
          case (null) {
            // add empty farm object
            let newFarmObject : Types.FarmObject = {
              id = "None";
              landSlotId = "None";
              indexRow = i;
              indexColumn = j;
              name = "None";
              status = "None";
              remainingTime = 0;
            };
            list := Array.append(list, [newFarmObject]);
          };
          case (?tile) {
            let rsPlant = state.plants.get(tile.objectId);
            switch (rsPlant) {
              case null {};
              case (?plant) {
                let rsSeed = state.seeds.get(plant.seedId);
                switch (rsSeed) {
                  case null {};
                  case (?seed) {
                    // update plant status
                    var status = plant.status;
                    let remainningTime = Int.max(seed.waitTime - (Time.now() / 1000000000 - plant.plantTime), 0);
                    if (remainningTime == 0) {
                      let updatePlant : Types.Plant = {
                        id = plant.id;
                        seedId = plant.seedId;
                        hasEffectId = plant.hasEffectId;
                        status = "fullGrown";
                        plantTime = plant.plantTime;
                      };
                      status := "fullGrown";
                      let updated = Plant.update(updatePlant, state);
                    } else if (remainningTime <= seed.waitTime / 2) {
                      let updatePlant : Types.Plant = {
                        id = plant.id;
                        seedId = plant.seedId;
                        hasEffectId = plant.hasEffectId;
                        status = "growing";
                        plantTime = plant.plantTime;
                      };
                      status := "growing";
                      let updated = Plant.update(updatePlant, state);
                    };
                    // add farm object
                    let newFarmObject : Types.FarmObject = {
                      id = tile.id;
                      landSlotId = tile.landSlotId;
                      indexRow = tile.indexRow;
                      indexColumn = tile.indexColumn;
                      name = seed.name;
                      status = status;
                      remainingTime = remainningTime;
                    };
                    list := Array.append(list, [newFarmObject]);
                  };
                };
              };
            };
          };
        };
      };
    };
    #ok((list));
  };

  public shared query ({ caller }) func listTiles() : async Response<[(Text, Types.Tile)]> {
    var list : [(Text, Types.Tile)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.tiles.entries()) {
      list := Array.append<(Text, Types.Tile)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // Plant
  public shared func createPlant(materialId : Text) : async Text {
    for ((K, V) in state.seeds.entries()) {
      if (V.materialId == materialId) {
        var uuid : Text = await createUUID();
        label whileLoop loop {
          while (true) {
            let rsPlant = state.plants.get(uuid);
            switch (rsPlant) {
              case (?V) {
                uuid := await createUUID();
              };
              case null {
                break whileLoop;
              };
            };
          };
        };
        let newPlant : Types.Plant = {
          id = uuid;
          seedId = V.id;
          hasEffectId = "";
          status = "newlyPlanted";
          plantTime = Time.now() / 1000000000;
        };

        let created = Plant.create(newPlant, state);
        return uuid;
      };
    };
    "NotFound";
  };
  
};


