import Random "mo:base/Random";
import Float "mo:base/Float";
import Option "mo:base/Option";
import Time "mo:base/Time";

module RandomMethod {
  public func randomNumber(from : Float, to : Float) : async Float {
    let x = await Random.blob();
    return Float.fromInt((Random.rangeFrom(8,x)%(Float.toInt(to) - Float.toInt(from)+1))+Float.toInt(from));
  };

  public func randomPercent() : async Float {
    let x = await Random.blob();
    return Float.fromInt(((Random.rangeFrom(8,x)%(99 - 0+1))+0))*0.01;
  };
};