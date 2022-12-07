import Random "mo:base/Random";
import Float "mo:base/Float";
import Option "mo:base/Option";
import Time "mo:base/Time";

module RandomMethod {
  public func randomNumber(from : Float, to : Float) : async Float {
    let x = await Random.blob();
    return Float.fromInt((Random.rangeFrom(8,x)%(Float.toInt(to) - Float.toInt(from)+1))+Float.toInt(from));
  };

  // public func randomPercent() : async Float {
  //   let x = await Random.blob();
  //   return Float.fromInt(((Random.rangeFrom(8,x)%(99 - 0+1))+0))*0.01;
  // };

  public func randomInRange(min : Float, max : Float) : Float {
    let n = max - min + 1;
    let x = (Time.now() * Time.now() * Time.now()) % 2038074743;
    return min + Float.fromInt(x) % n;
  };

  public func randomPercent() : Float {
    let x = (Time.now() * Time.now() * Time.now()) % 2038074743;
    return Float.fromInt(((x%(99 - 0+1))+0))*0.01;
  };
};