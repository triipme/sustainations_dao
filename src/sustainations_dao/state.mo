import Text "mo:base/Text";
import Int "mo:base/Int";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";

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
    characterClasses : Map<Int, Types.CharacterClass>;
    characters : Map<Text, Types.Character>;
    characterTakeOptions : Map<Int, Types.CharacterTakeOption>;
    quests : Map<Int, Types.Quest>;
    items : Map<Int, Types.Item>;
    questItems : Map<Int, Types.QuestItem>;
    events : Map<Int, Types.Event>;
    eventOptions : Map<Int, Types.EventOption>;
    gears : Map<Int,Types.Gear>;
    gearClasses : Map<Int,Types.GearClass>;
    gearRarities : Map<Int, Types.GearRarity>;
    gearSubstats : Map<Int, Types.GearSubstat>;
    materials : Map<Int, Types.Material>;
    inventories : Map<Int, Types.Inventory>;
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
      memoryCardEngine  = {
        games = TrieMap.TrieMap<Text, Types.MemoryCardEngineGame>(Text.equal, Text.hash);
        stages = TrieMap.TrieMap<Text, Types.MemoryCardEngineStage>(Text.equal, Text.hash);
        cards = TrieMap.TrieMap<Text, Types.MemoryCardEngineCard>(Text.equal, Text.hash);
        players = TrieMap.TrieMap<Text, Types.MemoryCardEnginePlayer>(Text.equal, Text.hash);
        rewards = TrieMap.TrieMap<Text, Types.MemoryCardEngineReward>(Text.equal, Text.hash);
      };
      characterClasses = TrieMap.TrieMap<Int, Types.CharacterClass>(Int.equal, Int.hash);
      characters = TrieMap.TrieMap<Text, Types.Character>(Text.equal, Text.hash);
      characterTakeOptions = TrieMap.TrieMap<Int, Types.CharacterTakeOption>(Int.equal, Int.hash);
      quests = TrieMap.TrieMap<Int, Types.Quest>(Int.equal, Int.hash);
      items = TrieMap.TrieMap<Int, Types.Item>(Int.equal, Int.hash);
      questItems = TrieMap.TrieMap<Int, Types.QuestItem>(Int.equal, Int.hash);
      events = TrieMap.TrieMap<Int, Types.Event>(Int.equal, Int.hash);
      eventOptions = TrieMap.TrieMap<Int, Types.EventOption>(Int.equal, Int.hash);
      gears = TrieMap.TrieMap<Int, Types.Gear>(Int.equal, Int.hash);
      gearClasses = TrieMap.TrieMap<Int, Types.GearClass>(Int.equal, Int.hash);
      gearRarities = TrieMap.TrieMap<Int, Types.GearRarity>(Int.equal, Int.hash);
      gearSubstats = TrieMap.TrieMap<Int, Types.GearSubstat>(Int.equal, Int.hash);
      materials = TrieMap.TrieMap<Int, Types.Material>(Int.equal, Int.hash);
      inventories = TrieMap.TrieMap<Int, Types.Inventory>(Int.equal, Int.hash);
    };
  };
};