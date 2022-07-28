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
    };
  };
};