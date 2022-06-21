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
  };

  public func empty() : State {
    {
      profiles = TrieMap.TrieMap<Principal, Types.Profile>(Principal.equal, Principal.hash);
      proposals = TrieMap.TrieMap<Text, Types.Proposal>(Text.equal, Text.hash);
      transactions = TrieMap.TrieMap<Text, Types.TxRecord>(Text.equal, Text.hash);
      userAgreements = TrieMap.TrieMap<Principal, Types.UserAgreement>(Principal.equal, Principal.hash);
    };
  };
};