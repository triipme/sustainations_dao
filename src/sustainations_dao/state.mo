import Text "mo:base/Text";
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
    memoryCardEngine : {
      games : Map<Text, Types.MemoryCardEngineGame>;
      stages : Map<Text, Types.MemoryCardEngineStage>;
      cards : Map<Text, Types.MemoryCardEngineCard>;
      players : Map<Text, Types.MemoryCardEnginePlayer>;
      rewards : Map<Text, Types.MemoryCardEngineReward>;
    }
  };

  public func empty() : State {
    {
      profiles = TrieMap.TrieMap<Principal, Types.Profile>(Principal.equal, Principal.hash);
      proposals = TrieMap.TrieMap<Text, Types.Proposal>(Text.equal, Text.hash);
      transactions = TrieMap.TrieMap<Text, Types.TxRecord>(Text.equal, Text.hash);
      userAgreements = TrieMap.TrieMap<Principal, Types.UserAgreement>(Principal.equal, Principal.hash);
      memoryCardEngine  = {
        games = TrieMap.TrieMap<Text, Types.MemoryCardEngineGame>(Text.equal, Text.hash);
        stages = TrieMap.TrieMap<Text, Types.MemoryCardEngineStage>(Text.equal, Text.hash);
        cards = TrieMap.TrieMap<Text, Types.MemoryCardEngineCard>(Text.equal, Text.hash);
        players = TrieMap.TrieMap<Text, Types.MemoryCardEnginePlayer>(Text.equal, Text.hash);
        rewards = TrieMap.TrieMap<Text, Types.MemoryCardEngineReward>(Text.equal, Text.hash);
      }
    };
  };
};