import Nat64 "mo:base/Nat64";

import Env "../sustainations_dao/.env";
import GeoRust "../sustainations_dao/plugins/GeoRust";

actor {
  stable var state = 0;
  
  public func name(arg : Text) : async Text {
    return arg;
  };

  private let georust : GeoRust.Interface = actor (Env.GEORUST_ID);

  public shared func randomIndex(begin : Float, end : Float) : async Int {
    let result = await georust.randomnumber(begin, end);
    return Nat64.toNat(result);
  };

  public shared func randomPair(begin : Float, end : Float) : async (Int, Int) {
    let result = await georust.randompair(begin, end);
    return (Nat64.toNat(result.0), Nat64.toNat(result.1));
  };

  public shared func utm2lonlat(easting : Float, northing : Float, zoneNum : Int32, zoneLetter : Text) : async (Float, Float) {
    let result = await georust.proj(easting, northing, zoneNum, zoneLetter);
    return result;
  };
};