import Random "mo:base/Random";
import Float "mo:base/Float";
import Nat8 "mo:base/Nat8";

module RandomMethod {
  public func randomNumber(from : Float, to : Float) : async Float {
    let x = await Random.blob();
    return Float.fromInt((Random.rangeFrom(8,x)%(Float.toInt(to) - Float.toInt(from)+1))+Float.toInt(from));
  };
  public func randomPercent() : async Float {
    let x = await Random.blob();
    return Float.fromInt(((Random.rangeFrom(8,x)%(99 - 0+1))+0))*0.01;
  };

  public func randomNat() : async Nat {
    var b : Blob = await Random.blob();
    return Nat8.toNat(Random.byteFrom(b));
  };
};