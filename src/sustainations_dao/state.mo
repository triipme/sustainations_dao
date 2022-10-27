import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Hash "mo:base/Hash";

import Types "types";

module {
  private type Map<K, V> = TrieMap.TrieMap<K, V>;

  public type State = {
    profiles : Map<Principal, Types.Profile>;
    proposals : Map<Text, Types.Proposal>;
    transactions : Map<Text, Types.TxRecord>;
    userAgreements : Map<Principal, Types.UserAgreement>;
    currencies : Map<Text, Types.Currency>;
    refillBrand : {
      brands : Map<Text, Types.RefillBrand>;
      managers : Map<Principal, Types.RBManager>;
      stations : Map<Text, Types.RBStation>;
      categories : Map<Text, Types.RBCategory>;
      tags : Map<Text, Types.RBTag>;
      productUnits : Map<Text, Types.RBProductUnit>;
      products : Map<Text, Types.RBProduct>;
      orders : Map<Text, Types.RBOrder>;
    };
    memoryCardEngine : {
      games : Map<Text, Types.MemoryCardEngineGame>;
      stages : Map<Text, Types.MemoryCardEngineStage>;
      cards : Map<Text, Types.MemoryCardEngineCard>;
      players : Map<Text, Types.MemoryCardEnginePlayer>;
      rewards : Map<Text, Types.MemoryCardEngineReward>;
    };
    questEngine : {
      quests : TrieMap.TrieMap<Text, Types.QuestEngine>;
      events : TrieMap.TrieMap<Text, Types.Event>;
      scenes : TrieMap.TrieMap<Text, Types.Scene>;
      eventOptions : TrieMap.TrieMap<Text, Types.EventOption>;
    };
    characterClasses : Map<Text, Types.CharacterClass>;
    characters : Map<Text, Types.Character>;
    characterTakesOptions : Map<Text, Types.CharacterTakesOption>;
    characterSelectsItems : Map<Text, Types.CharacterSelectsItems>;
    characterCollectsMaterials : Map<Text, Types.CharacterCollectsMaterials>;
    quests : Map<Text, Types.Quest>;
    items : Map<Text, Types.Item>;
    questItems : Map<Text, Types.QuestItem>;
    usableItems : Map<Text, Types.UsableItem>;
    eventItems : Map<Text, Types.EventItem>;
    arItems : Map<Text, Types.ARItem>;
    events : Map<Text, Types.Event>;
    eventOptions : Map<Text, Types.EventOption>;
    gears : Map<Text, Types.Gear>;
    gearClasses : Map<Text, Types.GearClass>;
    gearRarities : Map<Text, Types.GearRarity>;
    gearSubstats : Map<Text, Types.GearSubstat>;
    materials : Map<Text, Types.Material>;
    inventories : Map<Text, Types.Inventory>;
    landSlots : Map<Text,Types.LandSlot>;
    landTransferHistories : Map<Text,Types.LandTransferHistory>;
    landBuyingStatuses : Map<Text,Types.LandBuyingStatus>;
  };

  public func empty() : State {
    {
      profiles = TrieMap.TrieMap<Principal, Types.Profile>(Principal.equal, Principal.hash);
      proposals = TrieMap.TrieMap<Text, Types.Proposal>(Text.equal, Text.hash);
      transactions = TrieMap.TrieMap<Text, Types.TxRecord>(Text.equal, Text.hash);
      userAgreements = TrieMap.TrieMap<Principal, Types.UserAgreement>(Principal.equal, Principal.hash);
      currencies = TrieMap.TrieMap<Text, Types.Currency>(Text.equal, Text.hash);
      refillBrand = {
        brands = TrieMap.TrieMap<Text, Types.RefillBrand>(Text.equal, Text.hash);
        managers = TrieMap.TrieMap<Principal, Types.RBManager>(Principal.equal, Principal.hash);
        stations = TrieMap.TrieMap<Text, Types.RBStation>(Text.equal, Text.hash);
        categories = TrieMap.TrieMap<Text, Types.RBCategory>(Text.equal, Text.hash);
        tags = TrieMap.TrieMap<Text, Types.RBTag>(Text.equal, Text.hash);
        productUnits = TrieMap.TrieMap<Text, Types.RBProductUnit>(Text.equal, Text.hash);
        products = TrieMap.TrieMap<Text, Types.RBProduct>(Text.equal, Text.hash);
        orders = TrieMap.TrieMap<Text, Types.RBOrder>(Text.equal, Text.hash);
      };
      memoryCardEngine = {
        games = TrieMap.TrieMap<Text, Types.MemoryCardEngineGame>(Text.equal, Text.hash);
        stages = TrieMap.TrieMap<Text, Types.MemoryCardEngineStage>(Text.equal, Text.hash);
        cards = TrieMap.TrieMap<Text, Types.MemoryCardEngineCard>(Text.equal, Text.hash);
        players = TrieMap.TrieMap<Text, Types.MemoryCardEnginePlayer>(Text.equal, Text.hash);
        rewards = TrieMap.TrieMap<Text, Types.MemoryCardEngineReward>(Text.equal, Text.hash);
      };
      questEngine = {
        quests = TrieMap.TrieMap<Text, Types.QuestEngine>(Text.equal, Text.hash);
        events = TrieMap.TrieMap<Text, Types.Event>(Text.equal, Text.hash);
        scenes = TrieMap.TrieMap<Text, Types.Scene>(Text.equal, Text.hash);
        eventOptions = TrieMap.TrieMap<Text, Types.EventOption>(Text.equal, Text.hash);
      };
      characterClasses = TrieMap.TrieMap<Text, Types.CharacterClass>(Text.equal, Text.hash);
      characters = TrieMap.TrieMap<Text, Types.Character>(Text.equal, Text.hash);
      characterTakesOptions = TrieMap.TrieMap<Text, Types.CharacterTakesOption>(Text.equal, Text.hash);
      characterSelectsItems = TrieMap.TrieMap<Text, Types.CharacterSelectsItems>(Text.equal, Text.hash);
      characterCollectsMaterials = TrieMap.TrieMap<Text, Types.CharacterCollectsMaterials>(Text.equal, Text.hash);
      quests = TrieMap.TrieMap<Text, Types.Quest>(Text.equal, Text.hash);
      items = TrieMap.TrieMap<Text, Types.Item>(Text.equal, Text.hash);
      questItems = TrieMap.TrieMap<Text, Types.QuestItem>(Text.equal, Text.hash);
      usableItems = TrieMap.TrieMap<Text, Types.UsableItem>(Text.equal, Text.hash);
      eventItems = TrieMap.TrieMap<Text, Types.EventItem>(Text.equal, Text.hash);
      arItems = TrieMap.TrieMap<Text, Types.ARItem>(Text.equal, Text.hash);
      events = TrieMap.TrieMap<Text, Types.Event>(Text.equal, Text.hash);
      eventOptions = TrieMap.TrieMap<Text, Types.EventOption>(Text.equal, Text.hash);
      gears = TrieMap.TrieMap<Text, Types.Gear>(Text.equal, Text.hash);
      gearClasses = TrieMap.TrieMap<Text, Types.GearClass>(Text.equal, Text.hash);
      gearRarities = TrieMap.TrieMap<Text, Types.GearRarity>(Text.equal, Text.hash);
      gearSubstats = TrieMap.TrieMap<Text, Types.GearSubstat>(Text.equal, Text.hash);
      materials = TrieMap.TrieMap<Text, Types.Material>(Text.equal, Text.hash);
      inventories = TrieMap.TrieMap<Text, Types.Inventory>(Text.equal, Text.hash);
      landSlots = TrieMap.TrieMap<Text,Types.LandSlot>(Text.equal,Text.hash);
      landTransferHistories = TrieMap.TrieMap<Text,Types.LandTransferHistory>(Text.equal,Text.hash);
      landBuyingStatuses = TrieMap.TrieMap<Text,Types.LandBuyingStatus>(Text.equal,Text.hash);
    };
  };
};
