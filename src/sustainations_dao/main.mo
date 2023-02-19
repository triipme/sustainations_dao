import Array "mo:base/Array";
import Blob "mo:base/Blob";
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
import Trie "mo:base/Trie";
import UUID "mo:uuid/UUID";
import Prim "mo:prim";
import Object "./utils/object";

import Account "./plugins/Account";
import Base32 "./plugins/Base32";
import CRC32 "./plugins/CRC32";
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
import QuestEngine "./game/questEngine";
import QuestGame "./game/questGame";
import QuestGameReward "./game/questGameReward";
import EventEngine "./game/eventEngine";
import EventOptionEngine "./game/eventOptionEngine";
import Scene "./game/scene";
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
import Stash "./land/stash";
import LandConfig "./land/landConfig";
import LandSlot "./land/landSlot";
import Nation "./land/nation";
import LandTransferHistory "./land/landTransferHistory";
import LandBuyingStatus "./land/landBuyingStatus";
import LandEffect "./land/landEffect";
import UserHasLandEffect "./land/hasLandEffect";
import Tile "./land/tile";
import Seed "./land/seed";
import Plant "./land/plant";
import PlantPenaltyTime "./land/plantPenaltyTime";
import PlantHarvestingHistory "./land/plantHarvestingHistory";
import Product "./land/product";
import ProductStorage "./land/productStorage";
import FarmEffect "./land/farmEffect";
import HasFarmEffect "./land/hasFarmEffect";
import AlchemyRecipe "./land/alchemyRecipe";
import AlchemyRecipeDetail "./land/alchemyRecipeDetail";
import BuildingType "./land/buildingType";
import BuildingBuyingHistory "./land/buildingBuyingHistory";
import Building "./land/building";
import ProductionQueue "./land/productionQueue";
import ProductionQueueNode "./land/productionQueueNode";
import Env ".env";

shared ({ caller = owner }) actor class SustainationsDAO() = this {
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
  stable var checkRewardToWinner : Bool = false;
  stable var referralAwards : [Types.ReferralAward] = [
    {
      refType : Text = "icp";
      refId : Text = "icp";
      amount : Float = 0.0004;
    }
  ];
  stable var referralLimit : Int = 99;

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
  private stable var questEngine = {
    quests : [(Text, Types.QuestEngine)] = [];
    events : [(Text, Types.Event)] = [];
    scenes : [(Text, Types.Scene)] = [];
    eventOptions : [(Text, Types.EventOption)] = [];
  };
  private stable var questGames : [(Text, Types.QuestGame)] = [];
  private stable var questGameRewards : [(Text, Types.QuestGameReward)] = [];
  private stable var items : [(Text, Types.Item)] = [];
  private stable var questItems : [(Text, Types.QuestItem)] = [];
  private stable var products : [(Text, Types.Product)] = [];
  private stable var productStorages : [(Text, Types.ProductStorage)] = [];
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
  private stable var stashes : [(Text, Types.Stash)] = [];
  private stable var landConfigs : [(Text, Types.LandConfig)] = [];
  private stable var landSlots : [(Text, Types.LandSlot)] = [];
  private stable var nations : [(Text, Types.Nation)] = [];
  private stable var landTransferHistories : [(Text, Types.LandTransferHistory)] = [];
  private stable var landBuyingStatuses : [(Text, Types.LandBuyingStatus)] = [];
  private stable var landEffects : [(Text, Types.LandEffect)] = [];
  private stable var userHasLandEffects : [(Text, Types.UserHasLandEffect)] = [];
  private stable var tiles : [(Text, Types.Tile)] = [];
  private stable var seeds : [(Text, Types.Seed)] = [];
  private stable var plants : [(Text, Types.Plant)] = [];
  private stable var plantPenaltyTimes : [(Text, Types.PlantPenaltyTime)] = [];
  private stable var plantHarvestingHistories : [(Text, Types.PlantHarvestingHistory)] = [];
  private stable var farmEffects : [(Text, Types.FarmEffect)] = [];
  private stable var hasFarmEffects : [(Text, Types.UserHasFarmEffect)] = [];
  private stable var alchemyRecipes : [(Text, Types.AlchemyRecipe)] = [];
  private stable var alchemyRecipeDetails : [(Text, Types.AlchemyRecipeDetail)] = [];
  private stable var buildingTypes : [(Text, Types.BuildingType)] = [];
  private stable var buildingBuyingHistories : [(Text, Types.BuildingBuyingHistory)] = [];
  private stable var buildings : [(Text, Types.Building)] = [];
  private stable var productionQueues : [(Text, Types.ProductionQueue)] = [];
  private stable var productionQueueNodes : [(Text, Types.ProductionQueueNode)] = [];
  private stable var referrals : [(Text, Types.Referral)] = [];

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
    questEngine := {
      quests = Iter.toArray(state.questEngine.quests.entries());
      events = Iter.toArray(state.questEngine.events.entries());
      scenes = Iter.toArray(state.questEngine.scenes.entries());
      eventOptions = Iter.toArray(state.questEngine.eventOptions.entries());
    };
    questGames := Iter.toArray(state.questGames.entries());
    questGameRewards := Iter.toArray(state.questGameRewards.entries());
    characterClasses := Iter.toArray(state.characterClasses.entries());
    characters := Iter.toArray(state.characters.entries());
    characterTakesOptions := Iter.toArray(state.characterTakesOptions.entries());
    characterSelectsItems := Iter.toArray(state.characterSelectsItems.entries());
    characterCollectsMaterials := Iter.toArray(state.characterCollectsMaterials.entries());
    quests := Iter.toArray(state.quests.entries());
    items := Iter.toArray(state.items.entries());
    questItems := Iter.toArray(state.questItems.entries());
    products := Iter.toArray(state.products.entries());
    productStorages := Iter.toArray(state.productStorages.entries());
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
    stashes := Iter.toArray(state.stashes.entries());
    landConfigs := Iter.toArray(state.landConfigs.entries());
    landSlots := Iter.toArray(state.landSlots.entries());
    nations := Iter.toArray(state.nations.entries());
    landTransferHistories := Iter.toArray(state.landTransferHistories.entries());
    landBuyingStatuses := Iter.toArray(state.landBuyingStatuses.entries());
    landEffects := Iter.toArray(state.landEffects.entries());
    userHasLandEffects := Iter.toArray(state.userHasLandEffects.entries());
    tiles := Iter.toArray(state.tiles.entries());
    seeds := Iter.toArray(state.seeds.entries());
    plants := Iter.toArray(state.plants.entries());
    plantPenaltyTimes := Iter.toArray(state.plantPenaltyTimes.entries());
    plantHarvestingHistories := Iter.toArray(state.plantHarvestingHistories.entries());
    farmEffects := Iter.toArray(state.farmEffects.entries());
    hasFarmEffects := Iter.toArray(state.hasFarmEffects.entries());
    alchemyRecipes := Iter.toArray(state.alchemyRecipes.entries());
    alchemyRecipeDetails := Iter.toArray(state.alchemyRecipeDetails.entries());
    buildingTypes := Iter.toArray(state.buildingTypes.entries());
    buildingBuyingHistories := Iter.toArray(state.buildingBuyingHistories.entries());
    buildings := Iter.toArray(state.buildings.entries());
    productionQueues := Iter.toArray(state.productionQueues.entries());
    productionQueueNodes := Iter.toArray(state.productionQueueNodes.entries());
    referrals := Iter.toArray(state.referrals.entries());
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
    for ((k, v) in Iter.fromArray(questEngine.quests)) {
      state.questEngine.quests.put(k, v);
    };
    for ((k, v) in Iter.fromArray(questEngine.events)) {
      state.questEngine.events.put(k, v);
    };
    for ((k, v) in Iter.fromArray(questEngine.scenes)) {
      state.questEngine.scenes.put(k, v);
    };
    for ((k, v) in Iter.fromArray(questEngine.eventOptions)) {
      state.questEngine.eventOptions.put(k, v);
    };
    for ((k, v) in Iter.fromArray(questGames)) {
      state.questGames.put(k, v);
    };
    for ((k, v) in Iter.fromArray(questGameRewards)) {
      state.questGameRewards.put(k, v);
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
    for ((k, v) in Iter.fromArray(products)) {
      state.products.put(k, v);
    };
    for ((k, v) in Iter.fromArray(productStorages)) {
      state.productStorages.put(k, v);
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
    for ((k, v) in Iter.fromArray(stashes)) {
      state.stashes.put(k, v);
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
    for ((k, v) in Iter.fromArray(landEffects)) {
      state.landEffects.put(k, v);
    };
    for ((k, v) in Iter.fromArray(userHasLandEffects)) {
      state.userHasLandEffects.put(k, v);
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
    for ((k, v) in Iter.fromArray(plantPenaltyTimes)) {
      state.plantPenaltyTimes.put(k, v);
    };
    for ((k, v) in Iter.fromArray(plantHarvestingHistories)) {
      state.plantHarvestingHistories.put(k, v);
    };
    for ((k, v) in Iter.fromArray(farmEffects)) {
      state.farmEffects.put(k, v);
    };
    for ((k, v) in Iter.fromArray(hasFarmEffects)) {
      state.hasFarmEffects.put(k, v);
    };
    for ((k, v) in Iter.fromArray(alchemyRecipes)) {
      state.alchemyRecipes.put(k, v);
    };
    for ((k, v) in Iter.fromArray(alchemyRecipeDetails)) {
      state.alchemyRecipeDetails.put(k, v);
    };
    for ((k, v) in Iter.fromArray(buildingTypes)) {
      state.buildingTypes.put(k, v);
    };
    for ((k, v) in Iter.fromArray(buildingBuyingHistories)) {
      state.buildingBuyingHistories.put(k, v);
    };
    for ((k, v) in Iter.fromArray(buildings)) {
      state.buildings.put(k, v);
    };
    for ((k, v) in Iter.fromArray(productionQueues)) {
      state.productionQueues.put(k, v);
    };
    for ((k, v) in Iter.fromArray(productionQueueNodes)) {
      state.productionQueueNodes.put(k, v);
    };
    for ((k, v) in Iter.fromArray(referrals)) {
      state.referrals.put(k, v);
    };
    Debug.print("End postupgrade");
  };

  system func heartbeat() : async () {
    await setOutDateProposals();
    await checkBeginOfDay();
  };

  type Response<Ok> = Result.Result<Ok, Types.Error>;
  private let ledger : Ledger.Interface = actor (Env.LEDGER_ID);
  private let georust : GeoRust.Interface = actor (Env.GEORUST_ID);

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

  public shared ({ caller }) func submitAgreement(inviterID : ?Text) : async Response<Text> {
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
        let inviter = principalFromText(Option.get(inviterID, ""));
        let profile = state.profiles.put(
          caller,
          {
            username = null;
            avatar = null;
            phone = null;
            role = #user;
            inviter
          }
        );
        switch (inviter) {
          case null {};
          case (?user) {
            switch (state.userAgreements.get(user)) {
              case null {};
              case (_) {
                await rewardReferral(user, caller);
              };
            };
          };
        };
        #ok("Success!");
      };
      case (?_v) {
        #ok("Success!");
      };
    };
  };

  func principalFromText(text : Text) : ?Principal {
    var _text = Text.map(text , Prim.charToLower);
    _text := Text.replace(_text , #text "-" , "");
    let decodeResult = Base32.decode(#RFC4648({ padding=false; }),_text);
    let bytes:[Nat8] = switch (decodeResult)
    {
      case null [];
      case (?b) b;
    };

    let bytesSize = bytes.size();

    if ( bytesSize < 4 ) { return null; }
    else if ( bytesSize > 33) { return null; }
    else if ( text == "aaaaa-aa") { return ?Principal.fromText(text); }
    else {
      let body = Array.init<Nat8>(bytesSize - 4, 0) ;
    
      for (k in bytes.keys()) {
          if ( k > 3 ) { 
            body[ k - 4 ] := bytes [ k ];
          }
      };

      let crcResult : [Nat8] = CRC32.crc32(Array.freeze(body));

      for (c in crcResult.keys()){
        if ( bytes[c] != crcResult[c]) {
          return null;
        }
      };

      return ?Principal.fromText(text);
    };
  };

  func rewardReferral(inviter : Principal, member : Principal) : async () {
    var referralCount : Int = 0;
    for ((_uuid, referral) in state.referrals.entries()) {
      if (referral.uid == inviter) {
        referralCount := referralCount + 1;
      };
    };
    if (referralCount < referralLimit) {
      let uuid = await createUUID();
      let payload = {
        uid = inviter;
        member;
      };
      let referral = state.referrals.put(uuid, payload);
      for (award in Iter.fromArray(referralAwards)) {
        if (award.refType == "icp") {
          // send ICP
          let amount = Int64.toNat64(Float.toInt64(award.amount  * (10 ** 8)));
          let receipt = await refund(amount, inviter);
          switch (receipt) {
            case (#Err(error)) {
              Debug.print(debug_show error);
            };
            case (#Ok(bIndex)) {
              // record transaction
              await recordTransaction(
                Principal.fromActor(this),
                amount,
                Principal.fromActor(this),
                inviter,
                #awardReferral,
                ?uuid,
                bIndex
              );
            };
          };
        } else if (award.refType == "usableItem") {
          switch (state.usableItems.get(award.refId)) {
            case (?usableItem) {
              let stash : Types.Stash = {
                id = await createUUID();
                userId = Principal.toText(inviter);
                usableItemId = award.refId;
                quality = "Good";
                amount = Float.toInt(award.amount);
              };
              let created = Stash.create(stash, state);
            };
            case (null) {};
          };
        };
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

  public query ({ caller }) func getReferralCount() : async Response<Int> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var count : Int = 0;
    for ((_uuid, referral) in state.referrals.entries()) {
      if (referral.uid == caller) {
        count := count + 1;
      };
    };
    #ok(count);
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
          inviter = null;
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
          inviter = profile.inviter;
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
            inviter = null;
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
              inviter = profile.inviter;
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
    referralAwards : [Types.ReferralAward];
    referralLimit : Int;
  };
  public query func getSystemParams() : async Response<SystemParams> {
    let systemParams : SystemParams = {
      treasuryContribution;
      referralAwards;
      referralLimit;
    };
    #ok(systemParams);
  };

  public shared ({ caller }) func updateSystemParams(
    treasuryContributionValue : Float,
    referralAwardsValue : [Types.ReferralAward],
    referralLimitValue : Int
  ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    if (isAdmin(caller) == false) {
      return #err(#AdminRoleRequired);
    };

    if (treasuryContributionValue < 0) {
      return #err(#InvalidData);
    };

    if (referralLimitValue < 0) {
      return #err(#InvalidData);
    };

    for (award in Iter.fromArray(referralAwardsValue)) {
      if (award.amount <= 0) {
        return #err(#InvalidData);
      };
      if (award.refType == "usableItem") {
        switch (state.usableItems.get(award.refId)) {
          case (null) { return #err(#InvalidData); };
          case _ {};
        };
      };
    };

    treasuryContribution := treasuryContributionValue;
    referralAwards := referralAwardsValue;
    referralLimit := referralLimitValue;
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

  public shared ({ caller }) func payQuestEngine(questId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.questEngine.quests.get(questId)) {
      case null { #err(#NotFound) };
      case (?quest) {
        let questPrice : Nat64 = quest.price;
        let questPriceFloat : Float = Float.fromInt64(Int64.fromNat64(questPrice));
        let questDesign : Nat64 = Int64.toNat64(Float.toInt64(questPriceFloat*0.25))-transferFee;
        switch (await deposit(questPrice, caller)) {
          case (#ok(bIndex)) {
            await recordTransaction(
              caller,
              questPrice,
              caller,
              Principal.fromActor(this),
              #payQuest,
              ?questId,
              bIndex
            );
            //transfer ICP 25% price to quest-designer
            // let receipt = await refund(questDesign, quest.userId);
            // switch (receipt) {
            //   case (#Err(error)) {
            //     Debug.print(debug_show error);
            //   };
            //   case (#Ok(bIndex)) {
            //     // record transaction
            //     await recordTransaction(
            //       caller,
            //       questDesign,
            //       Principal.fromActor(this),
            //       quest.userId,
            //       #refundQuestDesign,
            //       ?questId,
            //       bIndex
            //     );
            //   };
            // };
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
    if (Principal.toText(caller) == godUser1 or Principal.toText(caller) == godUser2 or Principal.toText(caller) == godUser3) {
      for ((K, character) in state.characters.entries()) {
        if (character.userId == Principal.fromText(godUser1) or character.userId == Principal.fromText(godUser2) or character.userId == Principal.fromText(godUser3)) {
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

  // public shared ({ caller }) func takeOption(eventId : Text) : async Response<[Types.Character]> {
  //   if (Principal.toText(caller) == "2vxsx-fae") {
  //     return #err(#NotAuthorized); //isNotAuthorized
  //   };
  //   var result : [Types.Character] = [];
  //   for ((K, character) in state.characters.entries()) {
  //     if (character.userId == caller) {
  //       for ((K, eventOption) in state.eventOptions.entries()) {
  //         if (eventOption.eventId == eventId) {
  //           var strengthRequire : Float = 0;
  //           for (item in state.items.vals()) {
  //             if (item.id == eventOption.requireItemId) {
  //               strengthRequire := item.strengthRequire;
  //             };
  //           };
  //           result := Array.append<Types.Character>(result, [await Character.takeOption(character, strengthRequire, eventOption, state)]);
  //         };
  //       };
  //     };
  //   };
  //   #ok(result);
  // };

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

  // QuestEngine
  // public shared ({ caller }) func createQuestEngine(questEngine : Types.Quest) : async Response<Text> {
  //   if (Principal.toText(caller) == "2vxsx-fae") {
  //     return #err(#NotAuthorized); //isNotAuthorized
  //   };
  //   // let uuid : Text = await createUUID();
  //   let rsQuestEngine = state.questEngine.quests.get(questEngine.id);
  //   switch (rsQuestEngine) {
  //     case (?V) { #err(#AlreadyExisting) };
  //     case null {
  //       QuestEngine.create(caller, questEngine, state);
  //       #ok("Success");
  //     };
  //   };
  // };
   public shared ({ caller }) func createQuestEngine(questEngine : Types.Quest) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var canCreate : Bool = true;
    label checkQuest for (quest in state.questEngine.quests.vals()){
      if (quest.userId == caller){
        canCreate := false;
        break checkQuest;
      };
    };
    if (canCreate == true){
      let rsQuestEngine = state.questEngine.quests.get(questEngine.id);
      switch (rsQuestEngine) {
        case (?V) { return #err(#AlreadyExisting) };
        case null {
          QuestEngine.create(caller, questEngine, state);
          return #ok("Success");
        };
      };
    }
    else {
      #err(#AlreadyExisting); 
    };
  };

  public shared query ({ caller }) func checkCreatedQuestOfUser() : async Response<Types.QuestEngine> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    Debug.print(Principal.toText(caller));
    for (quest in state.questEngine.quests.vals()){
      if (quest.userId == caller){
        return #ok(quest);
      };
    };
    #err(#NotFound);
  };

  public shared query ({ caller }) func getAdminQuest() : async Response<Types.QuestEngine> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let godUser = "wijp2-ps7be-cocx3-zbfru-uuw2q-hdmpl-zudjl-f2ofs-7qgni-t7ik5-lqe";
    // let godUser = "er6vc-e6wpu-j5rhx-nalco-a5pko-5yff7-2exmn-6qe4v-tbrnz-6bhvb-yae";
    for (quest in state.questEngine.quests.vals()){
      if (Principal.toText(quest.userId) == godUser){
        return #ok(quest);
      };
    };
    #err(#NotFound);
  };

  public shared query ({ caller }) func getScenePreviewQuest(questId: Text) : async Response<Types.Scene> {
    let rsQuest = state.questEngine.quests.get(questId);
      switch (rsQuest) {
      case (?quest) {
        let listScene = quest.listScene;
        if (listScene == []) {
          #err(#NotFound);
        }
        else {
          let rsScene = state.questEngine.scenes.get(listScene[0]);
          switch (rsScene){
            case (?scene){
              #ok(scene);
            };
            case (_) {#err(#NotFound)};
          };
        };
      };
      case (_) {#err(#NotFound)};
    };
  }; 

  public shared query ({ caller }) func readQuestEngine(id : Text) : async Response<(Types.QuestEngine)> {
    let rsQuestEngine = state.questEngine.quests.get(id);
    return Result.fromOption(rsQuestEngine, #NotFound);
  };

  public shared query ({ caller }) func listQuestEngines() : async Response<[(Text, Types.QuestEngine)]> {
    var list : [(Text, Types.QuestEngine)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.questEngine.quests.entries()) {
      list := Array.append<(Text, Types.QuestEngine)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateQuestEngine(questEngine : Types.QuestEngine) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestEngine = state.questEngine.quests.get(questEngine.id);
    switch (rsQuestEngine) {
      case null { #err(#NotFound) };
      case (?V) {
        QuestEngine.update(caller, questEngine, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteQuestEngine(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestEngine = state.questEngine.quests.get(id);
    switch (rsQuestEngine) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedQuestEngine = state.questEngine.quests.delete(id);
        #ok("Success");
      };
    };
  };

  //Event Engine
  public shared ({ caller }) func createEventEngine(event : Types.Event) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsQuest = state.questEngine.quests.get(event.questId);
    let rsEvent = state.questEngine.events.get(event.id);
    switch (rsQuest) {
      case null { #err(#NotFound) };
      case (?quest) {
        switch (rsEvent) {
          case (?event) { #err(#AlreadyExisting) };
          case null {
            EventEngine.create(event, state);
            #ok("Success");
          };
        };
      };
    };
  };

  private var timeStartEvent : Time.Time = 0;
  public shared ({ caller }) func readEventEngine(id : Text) : async Response<(Types.Event, Time.Time)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.questEngine.events.get(id);
    timeStartEvent := Time.now();
    switch (rsEvent) {
      case (?event) {
        return #ok(event, timeStartEvent);
      };
      case (null) { return #err(#NotFound) };
    };
    // return Result.fromOption(rsEvent, #NotFound);
  };

  public shared ({ caller }) func updateCharacterStatsEngine(character : Types.Character) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacter = state.characters.get(character.id);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let checkTime = Time.now() -timeStartEvent;
        if (checkTime > 40_000_000_000) {
          let newCharacter : Types.Character = {
            userId = character.userId;
            id = character.id;
            name = character.name;
            level = character.level;
            currentExp = character.currentExp;
            temporaryExp = character.temporaryExp;
            levelUpExp = character.levelUpExp;
            status = "Exhausted";
            strength = character.strength;
            intelligence = character.intelligence;
            vitality = character.vitality;
            luck = character.luck;
            currentHP = character.currentHP;
            maxHP = character.maxHP;
            currentMana = character.currentMana;
            maxMana = character.maxMana;
            currentStamina = character.currentStamina;
            maxStamina = character.maxStamina;
            currentMorale = character.currentMorale;
            maxMorale = character.maxMorale;
            classId = character.classId;
            gearIds = character.gearIds;
            inventorySize = character.inventorySize;
            exhaustedTime = character.exhaustedTime;
          };
          // let updatedCharacter = state.characters.replace(character.id, newCharacter);
          Character.update(newCharacter, state);
        } else {
          Character.update(character, state);
        };
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listEventEngines() : async Response<[(Text, Types.Event)]> {
    var list : [(Text, Types.Event)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.questEngine.events.entries()) {
      list := Array.append<(Text, Types.Event)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func updateEventEngine(event : Types.Event) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.questEngine.events.get(event.id);
    switch (rsEvent) {
      case null { #err(#NotFound) };
      case (?V) {
        EventEngine.update(event, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteEventEngine(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.questEngine.events.get(id);
    switch (rsEvent) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedEvent = state.questEngine.events.delete(id);
        #ok("Success");
      };
    };
  };

  // Event Option Engine
  public shared ({ caller }) func createEventOptionEngine(eventOption : Types.EventOption) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsEvent = state.questEngine.events.get(eventOption.eventId);
    let rsEventOption = state.questEngine.eventOptions.get(eventOption.id);
    switch (rsEvent) {
      case null { #err(#NotFound) };
      case (?event) {
        switch (rsEventOption) {
          case (?eventOption) { #err(#AlreadyExisting) };
          case null {
            EventOptionEngine.create(eventOption, state);
            #ok("Success");
          };
        };
      };
    };
  };

  public shared query ({ caller }) func readEventOptionEngine(id : Text) : async Response<(Types.EventOption)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEventOption = state.questEngine.eventOptions.get(id);
    return Result.fromOption(rsEventOption, #NotFound);
  };

  public shared query ({ caller }) func listAllEventOptionEngines() : async Response<[(Text, Types.EventOption)]> {
    var list : [(Text, Types.EventOption)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.questEngine.eventOptions.entries()) {
      list := Array.append<(Text, Types.EventOption)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared query ({ caller }) func listEventOptionEngines(eventId : Text, selectedItemIds : [Text]) : async Response<[(Bool, Types.EventOption)]> {
    var list : [(Bool, Types.EventOption)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, eventOption) in state.questEngine.eventOptions.entries()) {
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

  public shared query ({ caller }) func getAllEventOptionEngines(eventId : Text) : async Response<[Types.EventOption]> {
    var list : [Types.EventOption] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (eventOption in state.questEngine.eventOptions.vals()) {
      if (eventOption.eventId == eventId) {
        list := Array.append<Types.EventOption>(list, [eventOption]);
      };
    };
    #ok((list));
  };

  public shared ({ caller }) func updateEventOptionEngine(eventOption : Types.EventOption) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEventOption = state.questEngine.eventOptions.get(eventOption.id);
    switch (rsEventOption) {
      case null { #err(#NotFound) };
      case (?V) {
        EventOption.update(eventOption, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteEventOptionEngine(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEventOption = state.questEngine.eventOptions.get(id);
    switch (rsEventOption) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedEventOption = state.questEngine.eventOptions.delete(id);
        #ok("Success");
      };
    };
  };

  // Scene Engine
  public shared ({ caller }) func createScene(scene : Types.Scene) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuest = state.questEngine.quests.get(scene.idQuest);
    switch (rsQuest) {
      case (null) {
        return #err(#NotFound);
      };
      case (?quest){
        let rsScene = state.questEngine.scenes.get(scene.id);
        switch (rsScene) {
          case (?V) { #err(#AlreadyExisting) };
          case null {
            let updateQuest : Types.QuestEngine = {
              id = quest.id;
              userId = quest.userId;
              name = quest.name;
              price = quest.price;
              description = quest.description;
              images = quest.images;
              isActive = quest.isActive;
              dateCreate = quest.dateCreate;
              listScene = Array.append<Text>(quest.listScene, [scene.id]);
            };
            let rsUpdate = updateQuestEngine(updateQuest);
            Scene.create(scene, state);
            #ok("Success");
          };
        };
      }
    };
  };

  public shared query ({ caller }) func readScene(idEvent : Text) : async Response<(Types.Scene)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.questEngine.events.get(idEvent);
    switch (rsEvent) {
      case null {
        #err(#NotFound);
      };
      case (?event) {
        for (V in state.questEngine.scenes.vals()) {
          if (event.id == V.idEvent) {
            return #ok(V);
          };
        };
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func readSceneEngine(idScene : Text) : async Response<(Types.Scene)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsScene = state.questEngine.scenes.get(idScene);
    return Result.fromOption(rsScene, #NotFound);
  };

  public shared query ({ caller }) func listScenes() : async Response<[(Text, Types.Scene)]> {
    var list : [(Text, Types.Scene)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.questEngine.scenes.entries()) {
      list := Array.append<(Text, Types.Scene)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared query ({ caller }) func listIdScenes() : async Response<[Text]> {
    //for queste engine
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var listIdScene : [Text] = [];
    for (scene in state.questEngine.scenes.vals()) {
      if (scene.idEvent == "ee1") {
        listIdScene := Array.append<Text>(listIdScene, [scene.id]);
      };
    };
    #ok(listIdScene);
  };

  public type GameQuest = {
    listEvent : [Text];
    listScene : [Text];
  };

  public shared ({ caller }) func getListEventQuest(): async Response<GameQuest> { //for quest engine
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let userId = Principal.toText(caller);
    var listIdEvent : [Text] = [];
    var listIdScene : [Text] = [];
    for (event in state.questEngine.events.vals()){
      if (event.questId == "engine"){
        listIdEvent := Array.append<Text>(listIdEvent, [event.id]);
      };
    };

    for (scene in state.questEngine.scenes.vals()){
      if (scene.idEvent == "ee1"){
        listIdScene := Array.append<Text>(listIdScene, [scene.id]);
      };
    };

    var shuffleListEvent : [var Text] = Array.thaw(listIdEvent);
    let sizeScene = listIdScene.size();
    for (i in listIdEvent.keys()){
      let j : Nat = Int.abs(Float.toInt(await Random.randomNumber(0.0, Float.fromInt(i))));
      let temp = shuffleListEvent[i];
      shuffleListEvent[i] := shuffleListEvent[j];
      shuffleListEvent[j] := temp;
    };

    var shuffleListScene : [var Text] = Array.thaw(listIdScene);
    for (i in listIdScene.keys()){
      let j : Nat = Int.abs(Float.toInt(await Random.randomNumber(0.0, Float.fromInt(i))));
      let temp = shuffleListScene[i];
      shuffleListScene[i] := shuffleListScene[j];
      shuffleListScene[j] := temp;
    };
    let shuffledListEvent : [Text] = Array.freeze(shuffleListEvent);
    let shuffledListScene : [Text] = Array.freeze(shuffleListScene);
    let game : GameQuest = {
      listEvent = shuffledListEvent;
      listScene = shuffledListScene;
    };
    #ok(game);
  };

  public shared query ({ caller }) func getAllScenes(idQuest: Text) : async Response<[Types.Scene]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var listScene : [Types.Scene] = [];
    let rsQuest = state.questEngine.quests.get(idQuest);
    switch (rsQuest) {
      case null {return #err(#NotFound)};
      case (?quest) {
        for (sceneId in quest.listScene.vals()){
          let rsScene = state.questEngine.scenes.get(sceneId);
          switch (rsScene) {
            case null {};
            case (?scene){
              listScene := Array.append<Types.Scene>(listScene, [scene]);
            };
          };
        };
      };
    };
    #ok(listScene);
  };

  public type Option = {
    option: Text;
    hp: Float;
    stamina: Float;
    morale: Float;
    mana: Float;
  };

  public shared ({ caller }) func createAllEventOptionEngine(idEvent: Text, options: [Option]) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsEvent = state.questEngine.events.get(idEvent);
    switch (rsEvent) {
      case null { return #err(#NotFound) };
      case (?event) {
        for (option in options.vals()){
          let id = await createUUID();
          let newEventOption : Types.EventOption = {
            id = id;
            eventId = idEvent;
            description = option.option;
            requireItemId = "null";
            lossHP = -Float.min(option.hp, 0);
            lossMana = -Float.min(option.mana, 0);
            lossStamina = -Float.min(option.stamina, 0);
            lossMorale = -Float.min(option.morale, 0);
            riskChance = 0.0;
            riskLost = "null";
            lossOther = "null";
            gainExp = 0;
            gainHP = Float.max(option.hp, 0);
            gainStamina = Float.max(option.stamina, 0);
            gainMorale = Float.max(option.morale, 0);
            gainMana = Float.max(option.mana, 0);
            luckyChance = 0;
            gainByLuck = "null";
            gainOther = 0.0;
          };
          let new = state.questEngine.eventOptions.put(id, newEventOption);
        };
        #ok("Success");
      };
    };
  };


  public shared ({ caller }) func updateScene(scene : Types.Scene) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsScene = state.questEngine.scenes.get(scene.id);
    switch (rsScene) {
      case null { #err(#NotFound) };
      case (?V) {
        Scene.update(scene, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteScene(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsScene = state.questEngine.scenes.get(id);
    switch (rsScene) {
      case (null) { #err(#NotFound) };
      case (?scene) {
        let rsQuest = state.questEngine.quests.get(scene.idQuest);
        switch (rsQuest) {
          case (null) {
            return #err(#NotFound);
          };
          case (?quest){
            let updateQuest : Types.QuestEngine = {
              id = quest.id;
              userId = caller;
              name = quest.name;
              price = quest.price;
              description = quest.description;
              images = quest.images;
              isActive = quest.isActive;
              dateCreate = quest.dateCreate;
              listScene = Array.filter<Text>(quest.listScene, func x = x != scene.id);
            };
            let rsUpdate = updateQuestEngine(updateQuest);
            let deletedScene = state.questEngine.scenes.delete(id);
            #ok("Success");
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteSceneEventAndEventOption(idScene : Text) : async Response<Text> { //delete scene, event, eventoption
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsScene = state.questEngine.scenes.get(idScene);
    switch (rsScene) {
      case (null) { #err(#NotFound) };
      case (?scene) {
        let rsQuest = state.questEngine.quests.get(scene.idQuest);
        switch (rsQuest) {
          case (null) {
            return #err(#NotFound);
          };
          case (?quest){
            let updateQuest : Types.QuestEngine = {
              id = quest.id;
              userId = caller;
              name = quest.name;
              price = quest.price;
              description = quest.description;
              images = quest.images;
              isActive = quest.isActive;
              dateCreate = quest.dateCreate;
              listScene = Array.filter<Text>(quest.listScene, func x = x != scene.id);
            };
            let rsUpdate = updateQuestEngine(updateQuest);
            let deletedScene = state.questEngine.scenes.delete(idScene);
          };
        };

        //delete event
        let deletedEvent = state.questEngine.events.delete(scene.idEvent);

        //delete event option
        for (eventOption in state.questEngine.eventOptions.vals()){
          if (eventOption.eventId == scene.idEvent){
            let deletedEventOption = state.questEngine.eventOptions.delete(eventOption.id);
          };
        };
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func listSceneQuests(idQuest : Text) : async Response<[Text]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var list : [Text] = [];
    let rsQuest = state.questEngine.quests.get(idQuest);
    switch (rsQuest) {
      case (null) { #err(#NotFound) };
      case (?rsQuest) {
        list := rsQuest.listScene;
        #ok(list);
      };
    };
  };

  public shared ({ caller }) func updateSceneQuest(questId : Text, listSorted: [Text]) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuest = state.questEngine.quests.get(questId);
    switch (rsQuest) {
      case (null) { #err(#NotFound) };
      case (?rsQuest) {
        for (val in rsQuest.listScene.vals()){
          if (Array.find<Text>(listSorted, func x = x == val) == null){
            return #err(#SomethingWrong);
          };
        };
        let newQuest : Types.QuestEngine = {
          id = rsQuest.id;
          userId = rsQuest.userId;
          name = rsQuest.name;
          price = rsQuest.price;
          description = rsQuest.description;
          images = rsQuest.images;
          isActive = rsQuest.isActive;
          dateCreate = rsQuest.dateCreate;
          listScene = listSorted;
        };
        let updated = state.questEngine.quests.put(questId, newQuest);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func listQuestItemEngines(idQuest : Text) : async Response<[Types.Item]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var listItemId : [Text] = [];
    var listItem : [Types.Item] = [];
    let listEvent = await listSceneQuests(idQuest);
    switch (listEvent) {
      case (#err(err)) {
        #err(err);
      };
      case (#ok(listEvent)) {
        for (event in listEvent.vals()) {
          for (eventOption in state.questEngine.eventOptions.vals()) {
            if (eventOption.requireItemId != "null" and eventOption.eventId == event) {
              switch (
                Array.find<Text>(
                  listItemId,
                  func(x : Text) {
                    x == eventOption.requireItemId;
                  }
                )
              ) {
                case null {
                  listItemId := Array.append<Text>(listItemId, [eventOption.requireItemId]);
                };
                case (?v) {};
              };
            };
          };
        };
        for (v in listItemId.vals()) {
          let item : ?Types.Item = state.items.get(v);
          switch (item) {
            case null {
              return #err(#NotFound);
            };
            case (?item) {
              listItem := Array.append<Types.Item>(listItem, [item]);
            };
          };
        };
        #ok(listItem);
      };
    };
  };

  public shared ({ caller }) func takeOptionEngine(eventId : Text) : async Response<[Types.Character]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var result : [Types.Character] = [];
    for ((K, character) in state.characters.entries()) {
      if (character.userId == caller) {
        for ((K, eventOption) in state.questEngine.eventOptions.entries()) {
          if (eventOption.eventId == eventId) {
            var strengthRequire : Float = 0;
            for (item in state.items.vals()) {
              if (item.id == eventOption.requireItemId) {
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

  public shared ({ caller }) func collectsMaterialEngines(eventId : Text) : async Response<[Types.CharacterCollectsMaterials]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var result : [Types.CharacterCollectsMaterials] = [];
    for ((K, character) in state.characters.entries()) {
      if (character.userId == caller) {
        for ((K, eventOption) in state.questEngine.eventOptions.entries()) {
          if (eventOption.eventId == eventId) {
            let characterCollectMaterial = await CharacterCollectsMaterials.collectsMaterials(character.id, eventOption, state);
            result := Array.append<Types.CharacterCollectsMaterials>(result, [characterCollectMaterial]);
          };
        };
      };
    };
    #ok(result);
  };

  //Quest Game
  public shared ({caller}) func createQuestGame(questGame: Types.QuestGame) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGame = state.questGames.get(questGame.id);
    switch (rsQuestGame) {
      case (?v) {#err(#AlreadyExisting)};
      case null {
        QuestGame.create(questGame, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readQuestGame(id: Text) : async Response<Types.QuestGame> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGame = state.questGames.get(id);
    return Result.fromOption(rsQuestGame, #NotFound);
  };

  public shared ({ caller }) func updateQuestGame(questGame : Types.QuestGame) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGame = state.questGames.get(questGame.id);
    switch (rsQuestGame) {
      case null { #err(#NotFound) };
      case (?V) {
        QuestGame.update(questGame, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteQuestGame(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGame = state.questGames.get(id);
    switch (rsQuestGame) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedQuestGame = state.questGames.delete(id);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listQuestGame() : async Response<[(Text, Types.QuestGame)]> {
    var list : [(Text, Types.QuestGame)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.questGames.entries()) {
      list := Array.append<(Text, Types.QuestGame)>(list, [(K, V)]);
    };
    #ok((list));
  };

  //save game score of user in day
  public shared ({caller}) func saveGameScore(questId: Text, character: Types.Character): async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let beginDate =  Time.now() / (864 * (10 ** 11)) * (864 * (10 ** 11));
    let endDate = beginDate + (864 * (10 ** 11));
    for (game in state.questGames.vals()){
      if (game.userId == Principal.toText(character.userId) and game.timestamp >= beginDate and game.timestamp <= endDate){
        let updateQuestGame : Types.QuestGame = {
          id = game.id;
          questId = questId;
          userId = Principal.toText(character.userId);
          timestamp = game.timestamp;
          hp = Float.max(game.hp, character.currentHP);
          stamina = Float.max(game.stamina, character.currentStamina);
          morale = Float.max(game.morale, character.currentMorale);
          mana = Float.max(game.mana, character.currentMana);
        };
        let updated = state.questGames.replace(updateQuestGame.id, updateQuestGame);
        return #ok("Success");
      };
    };
    //create
    let newQuestGame : Types.QuestGame = {
      id = await createUUID();
      questId = questId;
      userId = Principal.toText(character.userId);
      timestamp = Time.now();
      hp = character.currentHP;
      stamina = character.currentStamina;
      morale = character.currentMorale;
      mana = character.currentMana;
    };
    let created = state.questGames.put(newQuestGame.id, newQuestGame);
    #ok("Success");
  };

  //save game reward of the quest
  public shared ({caller}) func saveGameReward(questId: Text): async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuest = state.questEngine.quests.get(questId);
    switch (rsQuest){
      case (?quest) {
        let timestamp = Time.now;
        let endOfYesterday = Time.now() / (864 * (10 ** 11)) * (864 * (10 ** 11));
        let beginDate = endOfYesterday;
        let endDate = beginDate + (864 * (10 ** 11));
        for (reward in state.questGameRewards.vals()){
          if ((reward.rewarded == false)){//update
            //check user play already 
            var check : Bool = false; 
            label checkPlayer for (player in reward.player.vals()){
              if (player == Principal.toText(caller)){
                check := true;
                break checkPlayer;
              };
            };
            var listPlayer : [Text] = reward.player;
            if (check == false){
              listPlayer := Array.append<Text>(listPlayer, [Principal.toText(caller)]);
            };
            let updateGameReward : Types.QuestGameReward = {
              id = reward.id;
              questId = reward.questId;
              player = listPlayer;
              totalICP = reward.totalICP + quest.price;
              beginDate = reward.beginDate;
              endDate = endDate;
              rewarded = reward.rewarded;
            };
            let updated = state.questGameRewards.replace(updateGameReward.id, updateGameReward);
            return #ok("Success");
          };
        };
        //create
        let createGameReward : Types.QuestGameReward = {
          id = await createUUID();
          questId = questId;
          player = [Principal.toText(caller)];
          totalICP = quest.price;
          beginDate = beginDate;
          endDate = endDate;
          rewarded = false;
        };
        let created = state.questGameRewards.put(createGameReward.id, createGameReward);
        #ok("Success");
      };
      case (null) {return #err(#NotFound)};
    };
  };

  private func getWinner(questGameReward: Types.QuestGameReward) :  [Types.QuestGame] { //return characterId
    var listQuestGame : [Types.QuestGame] = [];
    //get all quest game for game reward
    for (questGame in state.questGames.vals()){
      if (questGame.questId == questGameReward.questId and questGame.timestamp >= questGameReward.beginDate 
      and questGame.timestamp <= questGameReward.endDate) {
        listQuestGame := Array.append<Types.QuestGame>(listQuestGame, [questGame]);
      };
    };
    let n : Nat = Iter.size<Types.QuestGame>(Iter.fromArray<Types.QuestGame>(listQuestGame));
    if (listQuestGame != [] and n >= 2){
      var thawListQuestGame : [var Types.QuestGame] = Array.thaw<Types.QuestGame>(listQuestGame);
      for (i in Iter.range(0, n-1)){
        for (j in Iter.range(i+1, n-1)){
          if (thawListQuestGame[i].hp < thawListQuestGame[j].hp){
            let temp = thawListQuestGame[i];
            thawListQuestGame[i] := thawListQuestGame[j];
            thawListQuestGame[j] := temp;
          }
          else if (thawListQuestGame[i].hp == thawListQuestGame[j].hp){
            if (thawListQuestGame[i].stamina < thawListQuestGame[j].stamina){
              let temp = thawListQuestGame[i];
              thawListQuestGame[i] := thawListQuestGame[j];
              thawListQuestGame[j] := temp;
            }
            else if (thawListQuestGame[i].stamina == thawListQuestGame[j].stamina){
              if (thawListQuestGame[i].morale < thawListQuestGame[j].morale){
                let temp = thawListQuestGame[i];
                thawListQuestGame[i] := thawListQuestGame[j];
                thawListQuestGame[j] := temp;
              }
              else if (thawListQuestGame[i].morale == thawListQuestGame[j].morale){
                if (thawListQuestGame[i].timestamp > thawListQuestGame[j].timestamp){
                  let temp = thawListQuestGame[i];
                  thawListQuestGame[i] := thawListQuestGame[j];
                  thawListQuestGame[j] := temp;
                };
              };
            };
          };
        };
      };
      return listQuestGame;
    };
    return listQuestGame;
  };

  public shared ({caller}) func getLeaderBoard(questId: Text) : async Response<[Types.QuestGame]> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (reward in state.questGameRewards.vals()){
      let now = Time.now();
      if (reward.rewarded == false and reward.questId == questId
        and now >= reward.beginDate and now <= reward.endDate){
        let rs = getWinner(reward);
        return #ok(rs);
      };
    };
    #err(#NotFound);
  };

  public shared ({caller}) func rewardToWinner() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (questGameReward in state.questGameRewards.vals()){
      if (questGameReward.rewarded == false) {
        //check min 2 user
        //check totalICP min 10_000
        let endDate = Time.now() / (864 * (10 ** 11)) * (864 * (10 ** 11)) + (864 * (10 ** 11));
        if (List.size(List.fromArray(questGameReward.player)) < 2 or questGameReward.totalICP < 100_000){
          let updateReward : Types.QuestGameReward = {
            id = questGameReward.id;
            questId = questGameReward.questId;
            player = questGameReward.player;
            totalICP = questGameReward.totalICP;
            beginDate = questGameReward.beginDate;
            endDate = endDate;
            rewarded = questGameReward.rewarded;
          };
          let updated = state.questGameRewards.replace(updateReward.id, updateReward);
          return #ok("Success");
        }
        else { //refund to winner and questDesign
          let rsQuest = state.questEngine.quests.get(questGameReward.questId);
          switch (rsQuest) {
            case (null) {return #err(#NotFound)};
            case (?quest) {
              let totalICP : Nat64 = questGameReward.totalICP;
              let totalIcpFloat : Float = Float.fromInt64(Int64.fromNat64(totalICP));
              let awardToDesigner : Nat64 = Int64.toNat64(Float.toInt64(totalIcpFloat*0.25))-transferFee;
              let awardToWinner : Nat64 = Int64.toNat64(Float.toInt64(totalIcpFloat*0.65))-transferFee;
              // let designer = quest.userId;
              // let winner = getWinner(questGameReward);
              Debug.print("=======================");
              Debug.print("Total ICP");
              Debug.print(debug_show(questGameReward.totalICP));
              Debug.print("Designer");
              Debug.print(debug_show(awardToDesigner));
              Debug.print("Winner");
              Debug.print(debug_show(awardToWinner));
              Debug.print("=======================");
              
              //transfer 25% ICP to quest-designer
              let receiptDesigner = await refund(awardToDesigner, quest.userId);
              switch (receiptDesigner) {
                case (#Err(error)) {
                  Debug.print(debug_show error);
                };
                case (#Ok(bIndex)) {
                  // record transaction
                  await recordTransaction(
                    caller,
                    awardToDesigner,
                    Principal.fromActor(this),
                    quest.userId,
                    #awardQuestDesigner,
                    ?quest.id,
                    bIndex
                  );
                };
              };

              //transfer 65% ICP to quest-winner
              let rsWinner : [Types.QuestGame] = getWinner(questGameReward);
              let winner : Types.QuestGame = rsWinner[0];
              let receiptWinner = await refund(awardToWinner, Principal.fromText(winner.userId));
              switch (receiptWinner) {
                case (#Err(error)) {
                  Debug.print(debug_show error);
                };
                case (#Ok(bIndex)) {
                  // record transaction
                  await recordTransaction(
                    caller,
                    awardToWinner,
                    Principal.fromActor(this),
                    Principal.fromText(winner.userId),
                    #awardQuestWinner,
                    ?quest.id,
                    bIndex
                  );
                };
              };

              //update game awarded
              let updateReward : Types.QuestGameReward = {
                id = questGameReward.id;
                questId = questGameReward.questId;
                player = questGameReward.player;
                totalICP = questGameReward.totalICP;
                beginDate = questGameReward.beginDate;
                endDate = questGameReward.endDate;
                rewarded = true;
              };
              let updated = state.questGameRewards.replace(updateReward.id, updateReward);
            };
          };
        };
      };
    };
    #ok("Success");
  };

  func checkBeginOfDay() : async () {
    let time_now = (Time.now()/(864 * (10 ** 11))*(864 * (10 ** 11)));
    let end_minute = ((time_now) + (864 * (10 ** 11)));
    if ((Time.now()) - time_now < 1_000_000_000){
      if (checkRewardToWinner == false) {
        checkRewardToWinner := true;
        let rs = await rewardToWinner();
        switch (rs){
          case (#ok(result)) {checkRewardToWinner := false};
          case _ {};
        };
      };
    };
  };

  //Quest Game Reward
  public shared ({caller}) func createQuestGameReward(questGameReward: Types.QuestGameReward) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGameReward = state.questGameRewards.get(questGameReward.id);
    switch (rsQuestGameReward) {
      case (?v) {#err(#AlreadyExisting)};
      case null {
        QuestGameReward.create(questGameReward, state);
        #ok("Success");
      };
    };
  };

  public shared query({caller}) func readQuestGameReward(id: Text) : async Response<Types.QuestGameReward> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGameReward = state.questGameRewards.get(id);
    return Result.fromOption(rsQuestGameReward, #NotFound);
  };

  public shared ({ caller }) func updateQuestGameReward(questGameReward : Types.QuestGameReward) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGameReward = state.questGameRewards.get(questGameReward.id);
    switch (rsQuestGameReward) {
      case null { #err(#NotFound) };
      case (?V) {
        QuestGameReward.update(questGameReward, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func deleteQuestGameReward(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsQuestGameReward = state.questGameRewards.get(id);
    switch (rsQuestGameReward) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deletedQuestGameReward = state.questGameRewards.delete(id);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listQuestGameReward() : async Response<[(Text, Types.QuestGameReward)]> {
    var list : [(Text, Types.QuestGameReward)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.questGameRewards.entries()) {
      list := Array.append<(Text, Types.QuestGameReward)>(list, [(K, V)]);
    };
    #ok((list));
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

  // Product
  public shared ({ caller }) func createProduct(product : Types.Product) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsProduct = state.products.get(product.id);
    switch (rsProduct) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        Product.create(product, state);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func updateProduct(product : Types.Product) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsProduct = state.products.get(product.id);
    switch (rsProduct) {
      case null { #err(#NotFound) };
      case (?V) {
        Product.update(product,state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readProduct(id : Text) : async Response<Types.Product> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rs = state.products.get(id);
    return Result.fromOption(rs, #NotFound);
  };

  public shared query ({ caller }) func listProducts() : async Response<[(Text, Types.Product)]> {
    var list : [(Text, Types.Product)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.products.entries()) {
      list := Array.append<(Text, Types.Product)>(list, [(K, V)]);
    };
    #ok((list));
  };

  

  public shared ({ caller }) func deleteProduct(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rs = state.products.get(id);
    switch (rs) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deleted = state.products.delete(id);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func restoreProducts() : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (stash in state.stashes.vals()) {
      var productId = "None";
      if (stash.usableItemId == "ui5") {productId:="p1tomato";};
      if (stash.usableItemId == "ui6") {productId:="p2carrot"};
      if (stash.usableItemId == "ui7") {productId:="p3wheat"};

      if (productId!="None") {
        var rsStash : Bool = false;
        for ((K, productStorage) in state.productStorages.entries()) {
          if (productStorage.productId == productId and productStorage.userId == stash.userId) {
            let updateProductStorage : Types.ProductStorage = {
              id = productStorage.id;
              userId = productStorage.userId;
              productId = productStorage.productId;
              quality = productStorage.quality;
              amount = productStorage.amount + stash.amount;
            };
            let updated = ProductStorage.update(updateProductStorage, state);
            rsStash := true;
          };
        };

        if (rsStash == false) {
          let newProductStorage : Types.ProductStorage = {
            id = await createUUID();
            userId = stash.userId;
            productId = productId;
            quality = "Good";
            amount = stash.amount
          };
          let created = ProductStorage.create(newProductStorage, state);
        };
        let deletedStash = state.stashes.delete(stash.id);
      };
    };
    #ok("Success");
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
            increaseStamina = usableItem.increaseStamina;
            increaseHP = usableItem.increaseHP;
            increaseMorale = usableItem.increaseMorale;
            increaseMana = usableItem.increaseMana;
            effect = usableItem.effect;
          }
        );
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func updateUsableItem(usableItem : Types.UsableItem) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsUsableItem = state.usableItems.get(usableItem.id);
    switch (rsUsableItem) {
      case null { #err(#NotFound) };
      case (?V) {
        let updated = state.usableItems.replace(usableItem.id, usableItem);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readUsableItem(id : Text) : async Response<Types.UsableItem> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rs = state.usableItems.get(id);
    return Result.fromOption(rs, #NotFound);
  };

  public shared query ({ caller }) func listUsableItems() : async Response<[(Text, Types.UsableItem)]> {
    var list : [(Text, Types.UsableItem)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.usableItems.entries()) {
      list := Array.append<(Text, Types.UsableItem)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func deleteUsableItem(id : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rs = state.usableItems.get(id);
    switch (rs) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deleted = state.usableItems.delete(id);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listUsableItem(id : Text, ) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rs = state.usableItems.get(id);
    switch (rs) {
      case (null) { #err(#NotFound) };
      case (?V) {
        let deleted = state.usableItems.delete(id);
        #ok("Success");
      };
    };
  };

  public shared ({ caller }) func useUsableItem(characterId : Text, stashId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsCharacter = state.characters.get(characterId);
    switch (rsCharacter) {
      case (null) { #err(#NotFound) };
      case (?character) {
        let rsStash = state.stashes.get(stashId);
        switch (rsStash) {
          case null #err(#NotFound);
          case (?stash) {
            let rsUsable = state.usableItems.get(stash.usableItemId);
            switch (rsUsable) {
              case (null) return #err(#NotFound);
              case (?usable) {
                let newCharacter : Types.Character = {
                  userId = character.userId;
                  id = character.id;
                  name = character.name;
                  level = character.level;
                  currentExp = character.currentExp;
                  temporaryExp = character.temporaryExp;
                  levelUpExp = character.levelUpExp;
                  status = character.status;
                  strength = character.strength;
                  intelligence = character.intelligence;
                  vitality = character.vitality;
                  luck = character.luck;
                  currentHP = Float.min(character.currentHP +usable.increaseHP, character.maxHP);
                  maxHP = character.maxHP;
                  currentMana = Float.min(character.currentMana +usable.increaseMana, character.maxMana);
                  maxMana = character.maxMana;
                  currentStamina = Float.min(character.currentStamina +usable.increaseStamina, character.maxStamina);
                  maxStamina = character.maxStamina;
                  currentMorale = Float.min(character.currentMorale +usable.increaseMorale, character.maxMorale);
                  maxMorale = character.maxMorale;
                  classId = character.classId;
                  gearIds = character.gearIds;
                  inventorySize = character.inventorySize;
                  exhaustedTime = character.exhaustedTime;
                };
                let updatedCharacter = state.characters.replace(character.id, newCharacter);

                //substract stash
                if (stash.amount - 1 > 0) {
                  let newStash : Types.Stash = {
                    id = stash.id;
                    userId = stash.userId;
                    usableItemId = stash.usableItemId;
                    quality = stash.quality;
                    amount = stash.amount-1;
                  };
                  let updated = state.stashes.replace(stash.id, newStash);
                } else {
                  let deletedStash = state.stashes.delete(stash.id);
                };
                #ok("Success");
              };
            };
          };
        };
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

  public shared ({ caller }) func getUsableItem() : async Response<Types.UsableItem> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (stash in state.stashes.vals()) {
      if (stash.userId == Principal.toText(caller)) {
        let rsUsableItem = state.usableItems.get(stash.usableItemId);
        return Result.fromOption(rsUsableItem, #NotFound);
      };
    };
    #err(#NotFound);
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
        let newAmount = Int.max(inventory.amount -1, 0);
        if (newAmount == 0) {
          let deleted = state.inventories.delete(inventoryId);
        } else {
          let updateInventory : Types.Inventory = {
            id = inventory.id;
            characterId = inventory.characterId;
            materialId = inventory.materialId;
            amount = Int.max(inventory.amount -1, 0);
          };
          let updated = Inventory.update(updateInventory, state);
        };
        return #ok("Success");
      };
    };
  };

  public type QuestGameInfo = {
    userProfile : Types.Profile;
    characterData : [(Text, Types.Character)];
    characterStatus : Text;
    stashInfo : [StashInfo];
    characterTakesOption : [Types.Character];
  };

  public query ({ caller }) func getQuestGameInfo(eventId : Text) : async Response<QuestGameInfo> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var characterData : [(Text, Types.Character)] = [];
    var characterStatus : Text = "";
    var stashInfo : [StashInfo] = [];
    var characterTakesOption : [Types.Character] = [];

    switch (state.profiles.get(caller)) {
      case null { #err(#NotFound) };
      case (?userProfile) {
        for ((key, character) in state.characters.entries()) {
          if (character.userId == caller) {
            for ((K, eventOption) in state.eventOptions.entries()) {
              if (eventOption.eventId == eventId) {
                var strengthRequire : Float = 0;
                for (item in state.items.vals()) {
                  if (item.id == eventOption.requireItemId) {
                    strengthRequire := item.strengthRequire;
                  };
                };
                characterTakesOption := Array.append<Types.Character>(characterTakesOption, [Character.takeOption(character, strengthRequire, eventOption, state)]);
              };
            };
            characterStatus := character.status;
            characterData := Array.append<(Text, Types.Character)>(characterData, [(key, character)]);
          };
        };
        for ((_, stash) in state.stashes.entries()) {
          if (stash.userId == Principal.toText(caller)) {
            let rsUsableItem = state.usableItems.get(stash.usableItemId);
            switch (rsUsableItem) {
              case null {};
              case (?usableItem) {
                let newStashInfo : StashInfo = {
                  id = stash.id;
                  userId = stash.userId;
                  usableItemId = stash.usableItemId;
                  usableItemName = usableItem.name;
                  amount = stash.amount;
                };
                stashInfo := Array.append<StashInfo>(stashInfo, [newStashInfo]);
              };
            };
          };
        };
        let result : QuestGameInfo = {
          userProfile = userProfile;
          characterData = characterData;
          characterStatus = characterStatus;
          stashInfo = stashInfo;
          characterTakesOption = characterTakesOption;
        };
        #ok(result);
      };
    };
  };

  // Get user profile by principal
  public shared query ({ caller }) func getProfileByPrincipal(principalText : Text) : async Response<Types.Profile> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    switch (state.profiles.get(Principal.fromText(principalText))) {
      case null { #err(#NotFound) };
      case (?v) {
        #ok(v);
      };
    };
  };

  // Product Storage
  public shared ({ caller }) func createProductStorage(userId : Text, seedId : Text) : () {
    let rsSeed = state.seeds.get(seedId);
    switch rsSeed {
      case null {
      };
      case (?seed) {
        var rsStash : Bool = false;
        for ((K, productStorage) in state.productStorages.entries()) {
          if (productStorage.userId == userId and productStorage.productId == seed.harvestedProductId) {
            let updateProductStorage : Types.ProductStorage = {
              id = productStorage.id;
              userId = productStorage.userId;
              productId = productStorage.productId;
              quality = productStorage.quality;
              amount = productStorage.amount + Float.toInt(await Random.randomNumber(Float.fromInt(seed.minAmount), Float.fromInt(seed.maxAmount)));
            };
            let updated = ProductStorage.update(updateProductStorage, state);
            rsStash := true;
          };
        };

        if (rsStash == false) {
          let newProductStorage : Types.ProductStorage = {
            id = await createUUID();
            userId = userId;
            productId = seed.harvestedProductId;
            quality = "Good";
            amount = Float.toInt(await Random.randomNumber(Float.fromInt(seed.minAmount), Float.fromInt(seed.maxAmount)));
          };
          let created = ProductStorage.create(newProductStorage, state);
        };
      };
    };
  };

  public type ProductStorageInfo = {
    id : Text;
    userId : Text;
    productId : Text;
    productName : Text;
    amount : Int;
  };

  public shared query ({ caller }) func listProductStorage() : async Response<[ProductStorageInfo]> {
    var list : [ProductStorageInfo] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((_, productStorage) in state.productStorages.entries()) {
      if (productStorage.userId == Principal.toText(caller)) {
        let rsProduct = state.products.get(productStorage.productId);
        switch (rsProduct) {
          case null {};
          case (?product) {
            let productStorageInfo : ProductStorageInfo = {
              id = productStorage.id;
              userId = productStorage.userId;
              productId = productStorage.productId;
              productName = product.name;
              amount = productStorage.amount;
            };
            list := Array.append<ProductStorageInfo>(list, [productStorageInfo]);
          };
        };
      };
    };
    #ok((list));
  };


  
  // Stash
  public shared ({ caller }) func createStash(userId : Text, usableItemId : Text) : () {
    let rsUsableItem = state.usableItems.get(usableItemId);
    switch (rsUsableItem) {
      case null {};
      case (?usableItem) {
        var rsStash : Bool = false;
        for ((K, stash) in state.stashes.entries()) {
          if (stash.userId == userId and stash.usableItemId == usableItemId) {
            let updateStash : Types.Stash = {
              id = stash.id;
              userId = stash.userId;
              usableItemId = stash.usableItemId;
              quality = stash.quality;
              amount = stash.amount + 1;
            };
            let updated = Stash.update(updateStash, state);
            rsStash := true;
          };
        };
        if (rsStash == false) {
          let newStash : Types.Stash = {
            id = await createUUID();
            userId = userId;
            usableItemId = usableItemId;
            quality = "Good";
            amount = 1;
          };
          let created = Stash.create(newStash, state);
        };
      };
    };
  };

  public type StashInfo = {
    id : Text;
    userId : Text;
    usableItemId : Text;
    usableItemName : Text;
    amount : Int;
  };

  public shared query ({ caller }) func listStash() : async Response<[StashInfo]> {
    var list : [StashInfo] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((_, stash) in state.stashes.entries()) {
      if (stash.userId == Principal.toText(caller)) {
        let rsUsableItem = state.usableItems.get(stash.usableItemId);
        switch (rsUsableItem) {
          case null {};
          case (?usableItem) {
            let stashInfo : StashInfo = {
              id = stash.id;
              userId = stash.userId;
              usableItemId = stash.usableItemId;
              usableItemName = usableItem.name;
              amount = stash.amount;
            };
            list := Array.append<StashInfo>(list, [stashInfo]);
          };
        };
      };
    };
    #ok((list));
  };

  public shared ({ caller }) func randomStashPotion() : async Response<(Types.Stash, Text)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var listPotion : [(Types.Stash, Text)] = [];
    for (stash in state.stashes.vals()){
      if (stash.userId == Principal.toText(caller)){
        let rsUsable = state.usableItems.get(stash.usableItemId);
        switch (rsUsable){
          case null {return #err(#NotFound)};
          case (?usable){
            if (Text.contains(usable.name, #text "Potion") == true){
              listPotion := Array.append<(Types.Stash, Text)>(listPotion, [(stash, usable.name)]);
            };
          };
        };
      };
    };
    if (listPotion == []){
      #err(#NotFound);
    }
    else {
      let index : Nat = Int.abs(Float.toInt(await Random.randomNumber(0.0, Float.fromInt(listPotion.size()-1))));
      #ok(listPotion[index]);
    };
  };

  // convert utm2lonlat
  public shared func utm2lonlat(easting : Float, northing : Float, zoneNum : Int32, zoneLetter : Text) : async (Float, Float) {
    let result = await georust.proj(easting, northing, zoneNum, zoneLetter);
    return result;
  };
  // public shared func randomIndex(begin : Float, end : Float) : async Int {
  //   let result = await georust.randomnumber(begin, end);
  //   return Nat64.toNat(result);
  // };

  // public shared func randomPair(begin : Float, end : Float) : async (Int, Int) {
  //   let result = await georust.randompair(begin, end);
  //   return (Nat64.toNat(result.0), Nat64.toNat(result.1));
  // };

  public query func randomIndex(min : Float, max : Float) : async Int {
    let n = Float.toInt(max) - Float.toInt(min) + 1;
    let x = (Time.now() * Time.now() * Time.now()) % 2038074743;
    return Float.toInt(min) + x % n;
  };

  public query func randomPair(min : Float, max : Float) : async (Int, Int) {
    let n = Float.toInt(max) - Float.toInt(min) + 1;
    let x = (Time.now() * Time.now() * Time.now()) % 2038074743;
    return (Float.toInt(min) + x % n, Float.toInt(min) + x * 2 % n);
  };

  // convert i,j to geometry with lat,lng
  public shared func landSlotToGeometry(i : Nat, j : Nat) : async Types.Geometry {
    let latlng1 = await georust.proj(Float.fromInt(1000 * j), Float.fromInt(1000 * i), 20, "N");
    let latlng2 = await georust.proj(Float.fromInt(1000 * (j + 1)), Float.fromInt(1000 * (i + 1)), 20, "N");
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

  public shared ({ caller }) func readLandConfig() : async Response<Types.LandConfig> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsLandConfig = state.landConfigs.get(Principal.toText(Principal.fromActor(this)));
    return Result.fromOption(rsLandConfig, #NotFound);
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
    let created = state.landSlots.put(newLandSlot.id, newLandSlot);
    // save land transter history
    createLandTransferHistory(newLandSlot.ownerId, newLandSlot.id, 0.0003);
    // delete user's current buying status
    deleteLandBuyingStatus(newLandSlot.ownerId);
    // update user nation
    createNation(newLandSlot.ownerId, newLandSlot.id, nationUTMS);
    // create user has land effect
    createUserHasLandEffect(newLandSlot.ownerId);
    
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
        ignore await randomLandSlot(?caller);
        #ok("Success");
      };
      case (#err(error)) {
        #err(error);
      };
    };
  };

  public shared ({ caller }) func randomLandSlot(userId : ?Principal) : async Response<Types.Geometry> {
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
            switch (userId) {
              case (null) { updateLandBuyingStatus(caller, Int.abs(i), Int.abs(j)); };
              case (?id) { updateLandBuyingStatus(id, Int.abs(i), Int.abs(j)); };
            };
            return #ok(
              {
                zoneNumber = 20;
                zoneLetter = "N";
                i = Int.abs(j);
                j = Int.abs(j);
              }
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

            switch (userId) {
              case (null) { updateLandBuyingStatus(caller, Int.abs(result.i), Int.abs(result.j)); };
              case (?id) { updateLandBuyingStatus(id, Int.abs(result.i), Int.abs(result.j)); };
            };
            
            return #ok(
              {
                zoneNumber = 20;
                zoneLetter = "N";
                i = Int.abs(result.i);
                j = Int.abs(result.j);
              }
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
        for (landSlotId in nation.landSlotIds.vals()) {
          let rsLandSlot = state.landSlots.get(landSlotId);
          switch (rsLandSlot) {
            case null {};
            case (?landSlot) {
              list := Array.append<Types.LandSlot>(list, [landSlot]);
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

  // public shared ({ caller }) func loadNationsArea(beginX : Int, beginY : Int, endX : Int, endY : Int) : async Response<[Types.NationGeometry]> {
  //   var list : [Types.Nation] = [];
  //   if (Principal.toText(caller) == "2vxsx-fae") {
  //     return #err(#NotAuthorized); //isNotAuthorized
  //   };
  //   let id = Principal.toText(Principal.fromActor(this));
  //   let rsLandConfig = state.landConfigs.get(id);
  //   switch (rsLandConfig) {
  //     case null {
  //       return #err(#NotFound);
  //     };
  //     case (?landConfig) {
  //       let iterI = Iter.range(
  //         Int.abs(Int.max(beginX, 0)),
  //         Int.abs(Int.min(endX, landConfig.mapHeight -1))
  //       );
  //       for (i in iterI) {
  //         let iterJ = Iter.range(
  //           Int.abs(Int.max(beginY, 0)),
  //           Int.abs(Int.min(endY, landConfig.mapWidth -1))
  //         );
  //         for (j in iterJ) {
  //           let id = Nat.toText(i) # "-" #Nat.toText(j);
  //           let rsLandSlot = state.landSlots.get(id);
  //           switch (rsLandSlot) {
  //             case (null) {};
  //             case (?landSlot) {
  //               let rsNation = state.nations.get(Principal.toText(landSlot.ownerId));
  //               switch (rsNation) {
  //                 case null {};
  //                 case (?nation) {
  //                   if (
  //                     Array.find<Types.Nation>(
  //                       list,
  //                       func(val : Types.Nation) : Bool {
  //                         val == nation;
  //                       }
  //                     ) == null
  //                   ) {
  //                     list := Array.append<Types.Nation>(list, [nation]);
  //                   };
  //                 };
  //               };
  //             };
  //           };
  //         };
  //       };

  //       var geometries : [Types.NationGeometry] = [];
  //       for (value in list.vals()) {
  //         var coordinates : [[Float]] = [];
  //         for (utm in value.utms.vals()) {
  //           let lonlat = await utm2lonlat(Float.fromInt(utm[1]), Float.fromInt(utm[0]), 20, "N");
  //           coordinates := Array.append(coordinates, [[lonlat.0, lonlat.1]]);
  //         };
  //         let newGeometry : Types.NationGeometry = {
  //           id = Principal.toText(value.id);
  //           zoneLetter = "N";
  //           zoneNumber = 20;
  //           i = value.indexRow;
  //           j = value.indexColumn;
  //           coordinates = [coordinates];
  //         };
  //         geometries := Array.append(geometries, [newGeometry]);
  //       };

  //       return #ok((geometries));
  //     };
  //   };
  // };

  public shared ({ caller }) func loadNationsArea(centerX : Nat, centerY : Nat, nearbyUsers : Nat) : async Response<[Types.NationGeometry]> {
    var list : [Types.Nation] = [];

    let id = Principal.toText(Principal.fromActor(this));
    let rsLandConfig = state.landConfigs.get(id);
    switch (rsLandConfig) {
      case null {
        return #err(#NotFound);
      };
      case (?landConfig) {

        // get nearby nations
        if (state.nations.size() <= nearbyUsers) {
          list := Iter.toArray(state.nations.vals());
        } else {
          // caculate euclid distance from center Point to all Nations and store to a distance list
          var distanceList : [(Text, Float)] = [];
          for (nation in state.nations.vals()) {
            let distance = Float.sqrt(
              (Float.fromInt(centerX) -Float.fromInt(nation.indexRow)) ** 2 +
              (Float.fromInt(centerY) -Float.fromInt(nation.indexColumn)) ** 2
            );
            distanceList := Array.append<(Text, Float)>(distanceList, [(Principal.toText(nation.id), distance)]);
          };
          // sort distance list
          distanceList := Array.sort<(Text, Float)>(
            distanceList,
            func(x : (Text, Float), y : (Text, Float)) : { #less; #equal; #greater } {
              if (x.1 < y.1) { #less } else if (x.1 == y.1) { #equal } else { #greater };
            }
          );
          // get n nearest nations based on sorted distance list
          for (index in Iter.range(0, nearbyUsers -1)) {
            let rsNation = state.nations.get(distanceList[index].0);
            switch (rsNation) {
              case null {};
              case (?nation) {
                list := Array.append<Types.Nation>(list, [nation]);
              };
            };
          };
        };

        // return geometries list
        var geometries : [Types.NationGeometry] = [];
        for (value in list.vals()) {
          //var coordinates : [[Float]] = [];
          var coordinates : [[Nat]] = [];
          for (utm in value.utms.vals()) {
            //let lonlat = await utm2lonlat(Float.fromInt(utm[1]), Float.fromInt(utm[0]), 20, "N");
            //coordinates := Array.append(coordinates, [[lonlat.0, lonlat.1]]);
            coordinates := Array.append(coordinates, [[ utm[0], utm[1] ]]);
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
  public shared ({ caller }) func createNation(ownerId : Principal, landId : Text, nationUTMS : [[Nat]]) : () {
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

  public shared query ({ caller }) func getNationIndex(landSlotIds : [Text]) : async { i : Nat; j : Nat } {
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
  public shared ({ caller }) func createLandTransferHistory(buyerId : Principal, landId : Text, price : Float) : () {
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
  public shared ({ caller }) func updateLandBuyingStatus(userId : Principal, indexRow : Nat, indexColumn : Nat) : () {
    let newGeometry : Types.Geometry = {
      i = indexRow;
      j = indexColumn;
      zoneNumber = 20;
      zoneLetter = "N";
    };
    let principalId = Principal.toText(userId);
    let rsLandBuyingStatus = state.landBuyingStatuses.get(principalId);
    switch (rsLandBuyingStatus) {
      case (?V) {
        let updateLandBuyingStatus : Types.LandBuyingStatus = {
          id = userId;
          geometry = newGeometry;
          randomTimes = V.randomTimes -1;
        };
        let updated = LandBuyingStatus.update(updateLandBuyingStatus, state);
      };
      case null {
        let newLandBuyingStatus : Types.LandBuyingStatus = {
          id = userId;
          geometry = newGeometry;
          randomTimes = 2;
        };
        let created = LandBuyingStatus.create(newLandBuyingStatus, state);
      };
    };
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

  public shared ({ caller }) func deleteLandBuyingStatus(id : Principal) : () {
    let rsLandBuyingStatus = state.landBuyingStatuses.get(Principal.toText(id));
    switch (rsLandBuyingStatus) {
      case (null) {};
      case (?V) {
        let deleted = state.landBuyingStatuses.delete(Principal.toText(id));
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

  // Land Effect
  public shared ({ caller }) func createLandEffect(effect : Types.LandEffect) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsLandEffect = state.landEffects.get(effect.id);
    switch (rsLandEffect) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        LandEffect.create(effect, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listLandEffects() : async Response<[(Text, Types.LandEffect)]> {
    var list : [(Text, Types.LandEffect)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.landEffects.entries()) {
      list := Array.append<(Text, Types.LandEffect)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // User has land efffect
  public shared ({ caller }) func createUserHasLandEffect(userId : Principal) : () {
    let id = Principal.toText(userId);
    let rsUserHaslandEffect = state.userHasLandEffects.get(id);
    switch (rsUserHaslandEffect) {
      case null {
        let rsNation = state.nations.get(id);
        switch (rsNation) {
          case null {};
          case (?nation) {
            // get landSlots of user
            var landSlots : [Types.LandSlot] = [];
            for (landSlotId in nation.landSlotIds.vals()) {
              let rsLandSlot = state.landSlots.get(landSlotId);
              switch (rsLandSlot) {
                case null {};
                case (?landSlot) {
                  landSlots := Array.append(landSlots, [landSlot]);
                };
              };
            };

            // check land effect
            let landEffectId = LandEffect.checkEffect(landSlots, state);
            if (landEffectId != "None") {
              let newUserHasLandEffect : Types.UserHasLandEffect = {
                id = userId;
                landEffectId = landEffectId;
              };
              let created = UserHasLandEffect.create(newUserHasLandEffect, state);
            };
          };
        };
      };
      case (?V) {};
    };
  };


  public shared query ({ caller }) func readUserHasLandEffect() : async Response<(Types.UserHasLandEffect)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let id = Principal.toText(caller);
    let rsHasLandEffect = state.userHasLandEffects.get(id);
    switch (rsHasLandEffect) {
      case null { return #err(#NotFound) };
      case (?hasLandEffect) {
        return #ok(hasLandEffect);
      };
    };
  };

  public shared query ({ caller }) func listAllUserHasLandEffects() : async Response<[(Text, Types.UserHasLandEffect)]> {
    var list : [(Text, Types.UserHasLandEffect)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.userHasLandEffects.entries()) {
      list := Array.append<(Text, Types.UserHasLandEffect)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public shared ({ caller }) func addAllInventory(characterId : Text, amount : Int) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for (material in state.materials.vals()) {
      var check : Bool = false;
      for ((k, v) in state.inventories.entries()) {
        if (v.characterId == characterId and v.materialId == material.id) {
          let updateInventory : Types.Inventory = {
            id = v.id;
            characterId = characterId;
            materialId = material.id;
            amount = v.amount + amount;
          };
          let update = state.inventories.replace(v.id, updateInventory);
          check := true;
        };
      };
      if (check == false) {
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

  public shared ({ caller }) func updateSeed(seed : Types.Seed) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsSeed = state.seeds.get(seed.id);
    switch (rsSeed) {
      case null { #err(#NotFound) };
      case (?V) {
        Seed.update(seed, state);
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

  // sow seed
  public shared ({ caller }) func sowSeed(landId : Text, indexRow : Nat, indexColumn : Nat, materialId : Text) : async Response<Text> {
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
            let objectId = await createPlant(caller,materialId);
            createTile(landId, indexRow, indexColumn, objectId);
            await createUserHasFarmEffect(indexRow,indexColumn,objectId,landSlot);     
            return #ok("Success"); 
          };
        };
      };
    };
  };

  public query func plantedTreesCounter() : async Response<Nat> {
    #ok(state.plants.size());
  };

  // Harvest Tree
  public shared ({ caller }) func harvestPlant(tileId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let rsTile = state.tiles.get(tileId);
    switch (rsTile) {
      case null {
        #err(#NotFound);
      };
      case (?tile) {
        let plantId = tile.objectId;
        let harvestTime = Time.now() / 1000000000;
        // create plant harvesting history
        createPlantHarvestingHistory(caller,plantId);
        // update plant: status to newlyPlanted and plantingTime to Now
        let rsPlant = state.plants.get(plantId);
        switch (rsPlant) {
          case null {};
          case (?plant) {
            // create plant's penalty time
            createPlantPenaltyTime(plant,harvestTime,1.2,0.3);
            // update plant
            let updatePlant : Types.Plant = {
              id = plant.id;
              seedId = plant.seedId;
              hasEffectId = plant.hasEffectId;
              status = "newlyPlanted";
              plantTime = harvestTime;
            };
            let updated = Plant.update(updatePlant, state);
            // add harvested product to user's Stash
            createProductStorage(Principal.toText(caller), plant.seedId);
          };
        };
        #ok("Success");
      };
    };
  };

  // Remove Plant/Building
  public shared ({ caller }) func removeObject(tileId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let rsTile = state.tiles.get(tileId);
    switch (rsTile) {
      case (null) { #err(#NotFound) };
      case (?tile) {
        let plantId = tile.objectId;
        let rsPlant = state.plants.get(plantId);
        switch (rsPlant) {
          case null {
            let rsBuilding = state.buildings.get(tile.objectId);
            switch (rsBuilding) {
              case null {};
              case (?building) {
                // delete Building in tile
                let deletedBuilding = state.buildings.delete(tile.objectId);
                // delete building's production queue if it has one
                deleteProductionQueue(tile.objectId);
              };
            }
          };
          case (?plant) {
            // delete Plant in tile
            let deletedPlant = state.plants.delete(plantId);
            // delete land effect pine
            deleteOneTreeLandEffect(caller,plant);
          };
        };
        // delete Tile
        let deletedTile = state.tiles.delete(tileId);
        // update Farm Effect
        let rsLand = state.landSlots.get(tile.landSlotId);
        switch (rsLand) {
          case null {
          };
          case (?landSlot) {
            let adjacentTiles = Tile.getAdjacentTiles(tile.indexRow,tile.indexColumn,state);
            Debug.print(Nat.toText(adjacentTiles.size()));
            for (t in adjacentTiles.vals()) {
              await createUserHasFarmEffect(t.indexRow, t.indexColumn, t.objectId, landSlot); 
            };
          };
        }; 

        #ok("Success");
      };
    };
  };

  // Tile
  public shared ({ caller }) func createTile(landId : Text, indexRow : Nat, indexColumn : Nat, objectId : Text) : () {
    let tileId = Nat.toText(indexRow) # "-" #Nat.toText(indexColumn);
    let newTile : Types.Tile = {
      id = tileId;
      landSlotId = landId;
      indexRow = indexRow;
      indexColumn = indexColumn;
      objectId = objectId;
    };
    let created = Tile.create(newTile, state);
  };

  public shared ({ caller }) func loadTilesArea(beginX : Int, beginY : Int, endX : Int, endY : Int) : async Response<[Types.FarmObject]> {
    var list : [Types.FarmObject] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    var ignoredTiles : [Text] = [];
    // load PLants
    let iterI = Iter.range(Int.abs(beginX), Int.abs(endX));
    for (i in iterI) {
      let iterJ = Iter.range(Int.abs(beginY), Int.abs(endY));
      for (j in iterJ) {
        let id = Nat.toText(i) # "-" #Nat.toText(j);
        let isIgnored = Array.find<Text>(ignoredTiles, func (val: Text) : Bool {val==id});
        if (isIgnored == null) {
          let rsTile = state.tiles.get(id);
          switch (rsTile) {
            case (null) {
              // add empty farm object
              let newFarmObject : Types.FarmObject = {
                id = "None";
                landSlotId = "None";
                indexRow = i;
                indexColumn = j;
                rowSize = 1;
                columnSize = 1;
                objectId = "None";
                name = "None";
                hasEffectId = "None";
                status = "None";
                remainingTime = 0;
              };
              list := Array.append(list, [newFarmObject]);
            };
            case (?tile) {
              let rsPlant = state.plants.get(tile.objectId);
              switch (rsPlant) {
                case null {
                  // if the tile is not a plant. it definitely is a construction 
                  let rsBuilding = state.buildings.get(tile.objectId);
                  switch (rsBuilding) {
                    case null {};
                    case (?building) {
                      let rsBuildingType = state.buildingTypes.get(building.buildingTypeId);
                      switch (rsBuildingType) {
                        case null {};
                        case (?buildingType) {
                          let newFarmObject : Types.FarmObject = {
                            id = tile.id;
                            landSlotId = tile.landSlotId;
                            indexRow = tile.indexRow;
                            indexColumn = tile.indexColumn;
                            rowSize = buildingType.rowSize;
                            columnSize = buildingType.columnSize;
                            objectId = building.id;
                            name = buildingType.name;
                            hasEffectId = "None";
                            status = building.status;
                            remainingTime = 0;
                          };
                          list := Array.append(list, [newFarmObject]);
                          // update building's production queue if it has one
                          let rsProductionQueue = state.productionQueues.get(building.id);
                          switch(rsProductionQueue) {
                            case null {};
                            case (?productionQueue) {
                              updateProductionQueueNodeStatuses(productionQueue);
                            };
                          };
                          // update ignored-tiles list
                          let iterX = Iter.range(Int.abs(tile.indexRow), Int.abs(tile.indexRow+buildingType.rowSize-1));
                          for (i in iterX) {
                            let iterY = Iter.range(Int.abs(tile.indexColumn), Int.abs(tile.indexColumn+buildingType.columnSize-1));
                            for (j in iterY) {
                              let ignoredTileId = Nat.toText(i) # "-" #Nat.toText(j);
                              if (ignoredTileId!=id) {
                                ignoredTiles := Array.append<Text>(ignoredTiles,[ignoredTileId]);
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
                case (?plant) {
                  let rsSeed = state.seeds.get(plant.seedId);
                  switch (rsSeed) {
                    case null {};
                    case (?seed) {
                      // check if this tile has waitTime-related landEffect
                      let landEffectValue : Float = LandEffect.getLandEffectTimeValue(caller,state);
                      // check if the plant has Penalty Time
                      let plantPenaltyTime : Int = PlantPenaltyTime.getPlantPenaltyTime(plant,state);
                      // check if this tile has waitTime-related farmEffect
                      let farmEffectValue : Float = FarmEffect.getFarmEffectTimeValue(plant,state);
                      
                      let newWaitTime : Int = seed.waitTime + Float.toInt((landEffectValue+farmEffectValue)*Float.fromInt(seed.waitTime));
                      let remainingTime : Int = Int.max(newWaitTime + plantPenaltyTime - (Time.now() / 1000000000 - plant.plantTime), 0);

                      // update plant status
                      let status : Text = Plant.updatePlantStatus(remainingTime, plant,seed,state);
                      // add farm object
                      let newFarmObject : Types.FarmObject = {
                        id = tile.id;
                        landSlotId = tile.landSlotId;
                        indexRow = tile.indexRow;
                        indexColumn = tile.indexColumn;
                        rowSize = seed.rowSize;
                        columnSize = seed.columnSize;
                        objectId = plant.id;
                        name = seed.name;
                        hasEffectId = plant.hasEffectId;
                        status = status;
                        remainingTime = remainingTime;
                      };
                      list := Array.append(list, [newFarmObject]);
                      // update ignored-tiles list
                      let iterX = Iter.range(Int.abs(tile.indexRow), Int.abs(tile.indexRow+seed.rowSize-1));
                      for (i in iterX) {
                        let iterY = Iter.range(Int.abs(tile.indexColumn), Int.abs(tile.indexColumn+seed.columnSize-1));
                        for (j in iterY) {
                          let ignoredTileId = Nat.toText(i) # "-" #Nat.toText(j);
                          if (ignoredTileId!=id) {
                            ignoredTiles := Array.append<Text>(ignoredTiles,[ignoredTileId]);
                          };
                        };
                      };
                    };
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
  private func createPlant(userId : Principal, materialId : Text) : async Text {
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
          hasEffectId = "None";
          status = "newlyPlanted";
          plantTime = Time.now() / 1000000000;
        };
        // create Plant
        let created = Plant.create(newPlant, state);
        // create one tree land effect (Pine Tree)
        createOneTreeLandEffect(userId,newPlant);
        return uuid;
      };
    };
    "NotFound";
  };

  // Plant Penalty Time
  public shared func createPlantPenaltyTime(plant : Types.Plant, harvestTime : Int, latePercent : Float, penaltyPercent : Float ) : () {
    var penaltyTime : Int = 0;
    let rsPlantPenaltyTime = state.plantPenaltyTimes.get(plant.id);
    switch (rsPlantPenaltyTime) {
      case null {};
      case (?V) {penaltyTime:=V.penaltyTime;};
    };
    
    let rsSeed = state.seeds.get(plant.seedId);
    switch (rsSeed) {
      case null {};
      case (?seed) {
        if (harvestTime-plant.plantTime - penaltyTime >= Float.toInt(Float.fromInt(seed.waitTime)*latePercent)) {
          let plantPenaltyTime : Types.PlantPenaltyTime = {
            id = plant.id;
            penaltyTime = Float.toInt(Float.fromInt(seed.waitTime)*penaltyPercent);
          };
          let updated = PlantPenaltyTime.update(plantPenaltyTime,state);
        }
        else {
          let plantPenaltyTime : Types.PlantPenaltyTime = {
            id = plant.id;
            penaltyTime = 0;
          };
          let updated = PlantPenaltyTime.update(plantPenaltyTime,state);
        };
      };
    };
  };
  

  // Plant Harvesting History
  public shared func createPlantHarvestingHistory(userId : Principal,plantId : Text) : () {
    var uuid : Text = await createUUID();
    label whileLoop loop {
      while (true) {
        let rsPlantHarvestingHistory = state.plantHarvestingHistories.get(uuid);
        switch (rsPlantHarvestingHistory) {
          case (?V) {
            uuid := await createUUID();
          };
          case null {
            break whileLoop;
          };
        };
      };
    };
    let newPlantHarvestingHistory : Types.PlantHarvestingHistory = {
      id = uuid;
      harvesterId = userId;
      plantId= plantId;
      harvestTime = Time.now();
    };
    PlantHarvestingHistory.create(newPlantHarvestingHistory,state);
  };

  public shared query ({ caller }) func listPlantHarvestingHistories() : async Response<[(Text, Types.PlantHarvestingHistory)]> {
    var list : [(Text, Types.PlantHarvestingHistory)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.plantHarvestingHistories.entries()) {
      list := Array.append<(Text, Types.PlantHarvestingHistory)>(list, [(K, V)]);
    };
    #ok((list));
  };



  // Farm Effect
  public shared ({ caller }) func createFarmEffect(effect : Types.FarmEffect) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // let uuid : Text = await createUUID();
    let rsFarmEffect = state.farmEffects.get(effect.id);
    switch (rsFarmEffect) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        FarmEffect.create(effect, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func listFarmEffects() : async Response<[(Text, Types.FarmEffect)]> {
    var list : [(Text, Types.FarmEffect)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.farmEffects.entries()) {
      list := Array.append<(Text, Types.FarmEffect)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // user has farm effect
  public shared ({ caller }) func createUserHasFarmEffect(indexTileRow : Nat, indexTileColumn : Nat, objectId : Text, landSlot : Types.LandSlot) : async () { 
    let rsPlant = state.plants.get(objectId);
    switch (rsPlant) {
      case null {};
      case (?plant) {
        var plantsInLandSlot : [Types.FarmObject] = LandSlot.listFarmObjectsFromLandSlot( landSlot.indexRow, landSlot.indexColumn, state);
        var farmObjects : [Types.FarmObject] = Tile.getFarmObjectsFromFarmObject( indexTileRow, indexTileColumn, plant.seedId, plantsInLandSlot);
        
        // if list of farmObjects is not Empty
        if (farmObjects != []) {
          // create new HasFarmEffect for user if the result effect is not "None"
          let effectId = FarmEffect.checkEffect(farmObjects,state);
          var uuid : Text = "None";
          if (effectId != "None") {
            uuid := await createUUID();
            label whileLoop loop {
              while (true) {
                let rsHasFarmEffect = state.hasFarmEffects.get(uuid);
                switch (rsHasFarmEffect) {
                  case (?V) {
                    uuid := await createUUID();
                  };
                  case null {
                    break whileLoop;
                  };
                };
              };
            };
            let newHasFarmEffect : Types.UserHasFarmEffect = {
              id = uuid;
              farmEffectId = effectId;
              userId = landSlot.ownerId;
            };
            let created = HasFarmEffect.create(newHasFarmEffect, state);
          };

          // apply new Effect to farmObjects
          for (farmObject in farmObjects.vals()) {
            let rsTile = state.tiles.get(farmObject.id);
            switch (rsTile) {
              case null {};
              case (?tile) {
                let rsPlant = state.plants.get(tile.objectId);
                switch (rsPlant) {
                  case null {};
                  case (?plant) {
                    // delete old Farm Effect that user has
                    let deleted = state.hasFarmEffects.delete(plant.hasEffectId);

                    // update hasEffectId in plant of tile
                    let updatePlant : Types.Plant = {
                      id = plant.id;
                      seedId = plant.seedId;
                      hasEffectId = uuid;
                      status = plant.status;
                      plantTime = plant.plantTime;
                    };
                    let updated = Plant.update(updatePlant, state);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  public shared query ({ caller }) func listHasFarmEffects() : async Response<[(Text, Types.UserHasFarmEffect)]> {
    var list : [(Text, Types.UserHasFarmEffect)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.hasFarmEffects.entries()) {
      if (V.userId == caller) {
        list := Array.append<(Text, Types.UserHasFarmEffect)>(list, [(K, V)]);
      };
    };
    #ok((list));
  };

  public shared query ({ caller }) func listAllUserHasFarmEffects() : async Response<[(Text, Types.UserHasFarmEffect)]> {
    var list : [(Text, Types.UserHasFarmEffect)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.hasFarmEffects.entries()) {
      list := Array.append<(Text, Types.UserHasFarmEffect)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // alchemyRecipe
  public shared ({ caller }) func createAlchemyRecipe(alchemyRecipe : Types.AlchemyRecipe) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsAlchemyRecipe = state.alchemyRecipes.get(alchemyRecipe.id);
    switch (rsAlchemyRecipe) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        AlchemyRecipe.create(alchemyRecipe, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readAlchemyRecipe(id : Text) : async Response<(Types.AlchemyRecipe)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsAlchemyRecipe = state.alchemyRecipes.get(id);
    return Result.fromOption(rsAlchemyRecipe, #NotFound);
  };

  public shared query ({ caller }) func listAlchemyRecipes() : async Response<[(Text, Types.AlchemyRecipe)]> {
    var list : [(Text, Types.AlchemyRecipe)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.alchemyRecipes.entries()) {
      list := Array.append<(Text, Types.AlchemyRecipe)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public type AlchemyRecipeDetailInfo = {
    id : Text;
    recipeId : Text;
    productId : Text;
    productName : Text; 
    currentAmount : Int;
    requiredAmount : Int;
  };

  public type AlchemyRecipeInfo = {
    id : Text;
    usableItemId : Text;
    usableItemName : Text;
    description : Text;
    craftingTime : Int;
    canCraft : Bool;
    alchemyRecipeDetails : [AlchemyRecipeDetailInfo];
  };

  public shared query ({ caller }) func listAlchemyRecipesInfo() : async Response<[AlchemyRecipeInfo]> {
    var list : [AlchemyRecipeInfo] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    // get user's product Storage
    let productStorages =  ProductStorage.getProductStorages(Principal.toText(caller),state);
    for ((K, alchemyRecipe) in state.alchemyRecipes.entries()) {
      var canCraft : Bool = true;
      var detailList : [AlchemyRecipeDetailInfo] = [];
      // get recipe's details
      let alchemyRecipeDetails = AlchemyRecipeDetail.getAlchemyRecipeDetails(alchemyRecipe.id,state);
      for (alchemyRecipeDetail in alchemyRecipeDetails.vals()) {
        var currentAmount : Int = 0;
        for (productStorage in productStorages.vals()) {
          if (productStorage.productId == alchemyRecipeDetail.productId) {
            currentAmount := productStorage.amount;
          };
        };
        // get product Name
        var productName : Text = "None";
        let rsProduct = state.products.get(alchemyRecipeDetail.productId);
        switch (rsProduct) {
          case null {};
          case (?product) {productName:=product.name};
        };
        // add detail info to detailList
        let alchemyRecipeDetailInfo : AlchemyRecipeDetailInfo = {
          id = alchemyRecipeDetail.id;
          recipeId = alchemyRecipeDetail.recipeId;
          productId = alchemyRecipeDetail.productId;
          productName = productName;
          currentAmount = currentAmount;
          requiredAmount = alchemyRecipeDetail.amount;
        };
        detailList := Array.append<AlchemyRecipeDetailInfo>(detailList,[alchemyRecipeDetailInfo]);
        // check if user has enough ingredient
        if (currentAmount < alchemyRecipeDetail.amount) {
          canCraft:=false;
        };
      };
      // get usableItem name for recipe
      var usableItemName = "None";
      let rsUsableItem = state.usableItems.get(alchemyRecipe.usableItemId);
      switch (rsUsableItem) {
        case null {};
        case (?usableItem) {
          usableItemName := usableItem.name;
        };
      };
      // add recipe info to result list
      let alchemyRecipeInfo : AlchemyRecipeInfo = {
        id = alchemyRecipe.id;
        usableItemId = alchemyRecipe.usableItemId;
        usableItemName = usableItemName;
        description = alchemyRecipe.description;
        craftingTime = alchemyRecipe.craftingTime;
        canCraft = canCraft;
        alchemyRecipeDetails = detailList;
      };
      list := Array.append<AlchemyRecipeInfo>(list,[alchemyRecipeInfo]);

    };
    #ok((list));
  };

  // alchemyRecipeDetail
  public shared ({ caller }) func createAlchemyRecipeDetail(alchemyRecipeDetail : Types.AlchemyRecipeDetail) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsAlchemyRecipeDetail = state.alchemyRecipeDetails.get(alchemyRecipeDetail.id);
    switch (rsAlchemyRecipeDetail) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        AlchemyRecipeDetail.create(alchemyRecipeDetail, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readAlchemyRecipeDetail(id : Text) : async Response<(Types.AlchemyRecipeDetail)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsAlchemyRecipeDetail = state.alchemyRecipeDetails.get(id);
    return Result.fromOption(rsAlchemyRecipeDetail, #NotFound);
  };

  public shared query ({ caller }) func listAlchemyRecipeDetails() : async Response<[(Text, Types.AlchemyRecipeDetail)]> {
    var list : [(Text, Types.AlchemyRecipeDetail)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.alchemyRecipeDetails.entries()) {
      list := Array.append<(Text, Types.AlchemyRecipeDetail)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // BuildingType
  public shared ({ caller }) func createBuildingType(buildingType : Types.BuildingType) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsBuildingType = state.buildingTypes.get(buildingType.id);
    switch (rsBuildingType) {
      case (?V) { #err(#AlreadyExisting) };
      case null {
        BuildingType.create(buildingType, state);
        #ok("Success");
      };
    };
  };

  public shared query ({ caller }) func readBuildingType(id : Text) : async Response<(Types.BuildingType)> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsBuildingType = state.buildingTypes.get(id);
    return Result.fromOption(rsBuildingType, #NotFound);
  };

  public shared query ({ caller }) func listBuildingTypes() : async Response<[(Text, Types.BuildingType)]> {
    var list : [(Text, Types.BuildingType)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.buildingTypes.entries()) {
      list := Array.append<(Text, Types.BuildingType)>(list, [(K, V)]);
    };
    #ok((list));
  };

  // construct Building
  public shared ({ caller }) func constructBuilding(landId : Text, indexRow : Nat, indexColumn : Nat, buildingTypeId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };

    let rsBuildingType = state.buildingTypes.get(buildingTypeId);
    switch (rsBuildingType) {
      case null {
        #err(#NotFound);
      };
      case (?buildingType) {
        let rsLandSlot = state.landSlots.get(landId);
        switch (rsLandSlot) {
          case null {
            #err(#NotFound);
          };
          case (?landSlot) {
            let objectId = await createBuilding(buildingTypeId);
            createTile(landId, indexRow, indexColumn, objectId);
            return #ok("Success"); 
          };
        };
      };
    };
  };


  // Building
  private func createBuilding(buildingTypeId : Text) : async Text {
    var uuid : Text = await createUUID();
    label whileLoop loop {
      while (true) {
        let rsPlant = state.buildings.get(uuid);
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
    let newBuilding : Types.Building = {
      id = uuid;
      buildingTypeId = buildingTypeId;
      resultUsableItemId = "None";
      status = "completed";
      buildTime = Time.now() / 1000000000;
      startProducingTime = -1;
    };
    let created = Building.create(newBuilding, state);
    if (buildingTypeId=="c1") {
      createProductionQueue(uuid);
    };
    return uuid;
  };

  public shared query ({ caller }) func listBuildings() : async Response<[(Text, Types.Building)]> {
    var list : [(Text, Types.Building)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.buildings.entries()) {
      list := Array.append<(Text, Types.Building)>(list, [(K, V)]);
    };
    #ok((list));
  };


  // craft UsableItem 
  public shared ({ caller }) func craftUsableItem(buildingId : Text, alchemyRecipeId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsBuilding = state.buildings.get(buildingId);
    switch (rsBuilding) {
      case null {
        return #err(#NotFound);
      };
      case (?building) {
        let rsAlchemyRecipe = state.alchemyRecipes.get(alchemyRecipeId);
        switch (rsAlchemyRecipe) {
          case null {
            return #err(#NotFound);
          };
          case (?alchemyRecipe) {
            // create node in production queue
            let rsProductionQueue = state.productionQueues.get(buildingId);
            switch (rsProductionQueue) {
              case null {
                // create new productionQueue if the building doesnt have one
                let  newProductionQueue : Types.ProductionQueue = {
                  id = buildingId;
                  nodeAmount = 0;
                  queueMaxSize = 5;
                };
                let createdProductionQueue = ProductionQueue.create(newProductionQueue, state);
                createProductionQueueNode(newProductionQueue,alchemyRecipe.id);
                updateProductionQueueNodeStatuses(newProductionQueue);
              };
              case (?productionQueue) {
                if (productionQueue.nodeAmount == productionQueue.queueMaxSize) {
                  return #ok("QueueIsMaxed");
                };
                createProductionQueueNode(productionQueue,alchemyRecipe.id);
                updateProductionQueueNodeStatuses(productionQueue);
              };
            };
            // get user's product storage
            let productStorages =  ProductStorage.getProductStorages(Principal.toText(caller),state);
            // get recipe's details
            let alchemyRecipeDetails = AlchemyRecipeDetail.getAlchemyRecipeDetails(alchemyRecipeId,state);
            // subtract required ingredients
            for (productStorage in productStorages.vals()) {
              for (alchemyRecipeDetail in alchemyRecipeDetails.vals()) {
                if (productStorage.productId == alchemyRecipeDetail.productId) {
                  let subtractedProductStorage = {
                    id = productStorage.id;
                    userId = productStorage.userId;
                    productId = productStorage.productId;
                    quality = productStorage.quality;
                    amount = productStorage.amount-alchemyRecipeDetail.amount;
                  };
                  let updated = ProductStorage.update(subtractedProductStorage,state);
                };
              };
            };
            return #ok("Success");
          };
        };
      };
    };
  };

  // collect completed usable Items
  public shared ({ caller }) func collectUsableItems(buildingId : Text) : async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsProductionQueue = state.productionQueues.get(buildingId);
    switch (rsProductionQueue) {
      case null {
        return #err(#NotFound);
      };
      case (?productionQueue) {
        var processingNodes : [Types.ProductionQueueNode] = [];
        for (i in Iter.range(0,productionQueue.nodeAmount-1)) {
          let rsProductionQueueNode = state.productionQueueNodes.get(
            productionQueue.id # "-node" # Int.toText(i)
          );
          switch (rsProductionQueueNode) {
            case null {};
            case (?productionQueueNode) {
              if (productionQueueNode.status != "Completed") {
                processingNodes := Array.append<Types.ProductionQueueNode>(processingNodes,[productionQueueNode]);
              }
              else {
                // collect usableItem
                let rsAlchmyRecipe = state.alchemyRecipes.get(productionQueueNode.recipeId);
                switch (rsAlchmyRecipe) {
                  case null {};
                  case (?alchemyRecipe) {
                    createStash(Principal.toText(caller),alchemyRecipe.usableItemId);
                  };
                }; 
              };
              let deleted = state.productionQueueNodes.delete(productionQueueNode.id);
            };
          };
        };
        // update ProductionNode (remove all completed nodes)
        // if (processingNodes.size() == 0) {
        //   return #ok("noneCompleted");
        // };
        let nodeAmount = processingNodes.size();
        for ( key in processingNodes.keys()) {
          let newProductionQueueNode : Types.ProductionQueueNode = {
            id = productionQueue.id # "-node" # Int.toText(key);
            recipeId = processingNodes[key].recipeId;
            status = processingNodes[key].status;
            startCraftingTime = processingNodes[key].startCraftingTime;
          };
          let created = ProductionQueueNode.create(newProductionQueueNode,state);
        };

        let updateProductionQueue : Types.ProductionQueue = {
          id = productionQueue.id;
          nodeAmount = nodeAmount;
          queueMaxSize = productionQueue.queueMaxSize;
        };
        let updatedQueue = ProductionQueue.update(updateProductionQueue,state);
        return #ok("Success");
      };
    };
  };

  // Production Queue
  public shared func createProductionQueue(buildingId : Text) : () {
    let  newProductionQueue : Types.ProductionQueue = {
      id = buildingId;
      nodeAmount = 0;
      queueMaxSize = 5;
    };
    let createdProductionQueue = ProductionQueue.create(newProductionQueue, state);
  };

  public shared func deleteProductionQueue(buildingId : Text) : () {
    let rsProductionQueue = state.productionQueues.get(buildingId);
    switch (rsProductionQueue) {
      case null {};
      case (?productionQueue) {
        // delete all nodes belong to this queue
        for (i in Iter.range(0,productionQueue.nodeAmount-1)) {
          let rsProductionQueueNode = state.productionQueueNodes.get(
            productionQueue.id # "-node" # Int.toText(i)
          );
          switch (rsProductionQueueNode) {
            case null {};
            case (?productionQueueNode) {
              let deletedNode = state.productionQueueNodes.delete(productionQueueNode.id);
            };
          };
        };
        // delete this queue
        let deletedQueue = state.productionQueues.delete(productionQueue.id);
      };
    };
  };

  public shared query ({ caller }) func listProductionQueues() : async Response<[(Text, Types.ProductionQueue)]> {
    var list : [(Text, Types.ProductionQueue)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.productionQueues.entries()) {
      list := Array.append<(Text, Types.ProductionQueue)>(list, [(K, V)]);
    };
    #ok((list));
  };

  

  // Production Queue Node
  public shared func createProductionQueueNode(productionQueue : Types.ProductionQueue, recipeId : Text) : () {
    // get complete Time for current last Node in the Queue
    var lastNodeCompleteTime : Int = 0;
    let rsProductionQueueNode = state.productionQueueNodes.get(
      productionQueue.id # "-node" # Int.toText(productionQueue.nodeAmount-1)
    );
    switch (rsProductionQueueNode) {
      case null {};
      case (?productionQueueNode) {
        let rsAlchemyRecipe = state.alchemyRecipes.get(productionQueueNode.recipeId);
        switch (rsAlchemyRecipe) {
          case null {};
          case (?alchemyRecipe) {
            lastNodeCompleteTime := productionQueueNode.startCraftingTime + alchemyRecipe.craftingTime;
          };
        };
      };
    };
    // create new Queue Node
    let newProductionQueueNode : Types.ProductionQueueNode = {
      id = productionQueue.id # "-node" # Int.toText(productionQueue.nodeAmount);
      recipeId = recipeId;
      status = "Processing";
      startCraftingTime = Int.max(Time.now() / 1000000000,lastNodeCompleteTime);
    };
    let created = ProductionQueueNode.create(newProductionQueueNode,state);

    let updateProductionQueue : Types.ProductionQueue = {
      id = productionQueue.id;
      nodeAmount = productionQueue.nodeAmount+1;
      queueMaxSize = productionQueue.queueMaxSize;
    };
    let updatedProductionQueue = ProductionQueue.update(updateProductionQueue,state);
  };

  public shared query ({ caller }) func listProductionQueueNodes() : async Response<[(Text, Types.ProductionQueueNode)]> {
    var list : [(Text, Types.ProductionQueueNode)] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    for ((K, V) in state.productionQueueNodes.entries()) {
      list := Array.append<(Text, Types.ProductionQueueNode)>(list, [(K, V)]);
    };
    #ok((list));
  };

  public type ProductionQueueNodeInfo = {
    id : Text;
    recipeId : Text;
    usableItemName : Text;
    status : Text;
    startCraftingTime : Int;
    remainingTime : Int;
  };

  public shared query ({ caller }) func listProductionQueueNodesInfo(buildingId : Text) : async Response<[ProductionQueueNodeInfo]> {
    var list : [ProductionQueueNodeInfo] = [];
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsProductionQueue = state.productionQueues.get(buildingId);
    switch (rsProductionQueue) {
      case null {};
      case (?productionQueue) {
        for (i in Iter.range(0,productionQueue.nodeAmount-1)) {
          let rsProductionQueueNode = state.productionQueueNodes.get(
            productionQueue.id # "-node" # Int.toText(i)
          );
          switch (rsProductionQueueNode) {
            case null {};
            case (?productionQueueNode) {
              
              // get usableItem name of node
              var usableItemName : Text = "None";
              var craftingTime : Int = 0;
              let rsAlchemyRecipe = state.alchemyRecipes.get(productionQueueNode.recipeId);
              switch (rsAlchemyRecipe) {
                case null {};
                case (?alchemyRecipe) {
                  craftingTime := alchemyRecipe.craftingTime;
                  let rsUsableItem = state.usableItems.get(alchemyRecipe.usableItemId);
                  switch (rsUsableItem) {
                    case null {};
                    case (?usableItem) {
                      usableItemName := usableItem.name;
                    };
                  };
                };
              };
              // caculate remainingTime of node
              let remainingTime = Int.max(craftingTime - (Time.now() / 1000000000 - productionQueueNode.startCraftingTime), 0);
              // add node info to result list
              let productionQueueNodeInfo : ProductionQueueNodeInfo = {
                id = productionQueueNode.id;
                recipeId = productionQueueNode.recipeId;
                usableItemName = usableItemName;
                status = productionQueueNode.status;
                startCraftingTime = productionQueueNode.startCraftingTime;
                remainingTime = remainingTime;
              };
              list := Array.append<ProductionQueueNodeInfo>(list,[productionQueueNodeInfo]);
            };
          }
        };
      };
    };
    #ok((list));
  };



  public shared func updateProductionQueueNodeStatuses(productionQueue : Types.ProductionQueue) : () {
    for (i in Iter.range(0,productionQueue.nodeAmount-1)) {
      let rsProductionQueueNode = state.productionQueueNodes.get(
        productionQueue.id # "-node" # Int.toText(i)
      );
      switch (rsProductionQueueNode) {
        case null {};
        case (?productionQueueNode) {
          let rsAlchemyRecipe = state.alchemyRecipes.get(productionQueueNode.recipeId);
          switch (rsAlchemyRecipe) {
            case null {};
            case (?alchemyRecipe) {
              let remainingTime = Int.max(alchemyRecipe.craftingTime - (Time.now() / 1000000000 - productionQueueNode.startCraftingTime), 0);
              if (remainingTime==0) {
                let updateProductionQueueNode : Types.ProductionQueueNode = {
                  id = productionQueueNode.id;
                  recipeId = productionQueueNode.recipeId;
                  status = "Completed";
                  startCraftingTime = productionQueueNode.startCraftingTime;
                };
                let updated = ProductionQueueNode.update(updateProductionQueueNode,state);
              };
            };
          };
        };
      };
    };
  };




  // Event land effect (pine tree)
  public shared func createOneTreeLandEffect(userId: Principal, plant: Types.Plant): () {
    if (plant.seedId == "s4pine") {
      let rsLandEffect = state.userHasLandEffects.get(Principal.toText(userId));
      switch (rsLandEffect) {
        case null {
          let userHasLandEffect : Types.UserHasLandEffect = {
            id = userId;
            landEffectId = "le2";
          };
          let created = UserHasLandEffect.create(userHasLandEffect, state);
        };
        case (?hasLandEffect) {
          let rsLandEffect = state.landEffects.get(hasLandEffect.landEffectId);
          switch (rsLandEffect) {
            case null {};
            case (?landEffect) {
              if (landEffect.effect == "waitTime" and landEffect.value > -0.12) {
                let userHasLandEffect : Types.UserHasLandEffect = {
                  id = userId;
                  landEffectId = "le2";
                };
                let updated = UserHasLandEffect.update(userHasLandEffect, state);
              };
            };
          };
        };
      };
    };
  };

  public shared func deleteOneTreeLandEffect(userId: Principal, plant: Types.Plant): () {
    if (plant.seedId == "s4pine") {
      let rsNation = state.nations.get(Principal.toText(userId));
      switch (rsNation) {
        case null { };
        case (?nation) {
          // get landSlots of user
          var landSlots : [Types.LandSlot] = [];
          for (landSlotId in nation.landSlotIds.vals()){
            let rsLandSlot = state.landSlots.get(landSlotId);
            switch (rsLandSlot) {
              case null {};
              case (?landSlot) {
                landSlots := Array.append(landSlots, [landSlot]);
              };
            };
          };
          let landEffectId = LandEffect.checkEffect(landSlots, state);

          let counter = await countSeedInNation(userId, "s4pine");
          if (counter == 0) {
            if (landEffectId == "None") {
              let deleted = state.userHasLandEffects.delete(Principal.toText(userId));
            } else {
              let updateUserHasLandEffect : Types.UserHasLandEffect = {
                id = userId;
                landEffectId = landEffectId;
              };
              let updated = UserHasLandEffect.update(updateUserHasLandEffect, state);
            };
          };
        };
      };
    };
  };


  public shared ({caller}) func removeAllUsersHasLandEffect(landEffectId: Text): async Response<Text> {
    if (Principal.toText(caller) == "2vxsx-fae") {
      return #err(#NotAuthorized); //isNotAuthorized
    };
    let rsLandEffect = state.landEffects.get(landEffectId);
    switch (rsLandEffect) {
      case null {
        return #err(#NotFound);
      };
      case (?landEffect) {
        for (userHasLandEffect in state.userHasLandEffects.vals()) {
          if (userHasLandEffect.landEffectId == landEffectId) {
            let userId = userHasLandEffect.id;
            let rsNation = state.nations.get(Principal.toText(userId));
            switch (rsNation) {
              case null { };
              case (?nation) {
                // get landSlots of user
                var landSlots : [Types.LandSlot] = [];
                for (landSlotId in nation.landSlotIds.vals()){
                  let rsLandSlot = state.landSlots.get(landSlotId);
                  switch (rsLandSlot) {
                    case null {};
                    case (?landSlot) {
                      landSlots := Array.append(landSlots, [landSlot]);
                    };
                  };
                };
                // get new landeffect for user
                let newlandEffectId = LandEffect.checkEffect(landSlots, state);
                if (newlandEffectId == "None") {
                  let deleted = state.userHasLandEffects.delete(Principal.toText(userId));
                } else {
                  let updateUserHasLandEffect : Types.UserHasLandEffect = {
                    id = userId;
                    landEffectId = newlandEffectId;
                  };
                  let updated = UserHasLandEffect.update(updateUserHasLandEffect, state);
                };
              };
            };
          };
        };
        let deleted = state.landEffects.delete(landEffectId);
        return #ok("Success");
      };
    };
  };

  public shared query func countSeedInNation(userId : Principal, seedId : Text): async Nat {
    var counter : Nat = 0;
    let rsNation = state.nations.get(Principal.toText(userId));
    switch (rsNation) {
      case null { 0; };
      case (?nation) {
        for (landSlotId in nation.landSlotIds.vals()) {
          let rsLandSlot = state.landSlots.get(landSlotId);
          switch (rsLandSlot) {
            case null {};
            case (?landSlot) {
              let iterI = Iter.range(Int.abs(landSlot.indexRow*10), Int.abs((landSlot.indexRow*10) + 9));
              for (i in iterI) {
                let iterJ = Iter.range(Int.abs(landSlot.indexColumn*10), Int.abs((landSlot.indexColumn*10) + 9));
                for (j in iterJ) {
                  let id = Nat.toText(i) # "-" #Nat.toText(j);
                  let rsTile = state.tiles.get(id);
                  switch (rsTile) {
                    case null {};
                    case (?tile) {
                      let rsPlant = state.plants.get(tile.objectId);
                      switch (rsPlant) {
                        case null {};
                        case (?plant) {
                          if (plant.seedId == seedId) counter := counter + 1;
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        return counter;
      };
    };
  };


};