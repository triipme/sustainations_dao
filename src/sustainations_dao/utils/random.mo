import Random "mo:base/Random";
import Float "mo:base/Float";
import Option "mo:base/Option";

module RandomMethod {
  public func randomNumber(from : Float, to : Float) : async Float {
    let x = await Random.blob();
    return Float.fromInt((Random.rangeFrom(8,x)%(Float.toInt(to) - Float.toInt(from)+1))+Float.toInt(from));
  };

  public func randomPercent() : async Float {
    let x = await Random.blob();
    return Float.fromInt(((Random.rangeFrom(8,x)%(99 - 0+1))+0))*0.01;
  };

  public func randomIndex(from : Int, to : Int) : async Int {
    let n = to - from + 1;
    let remainder = 32767 % n;
    let blob = await Random.blob();
    var x =Random.rangeFrom(8,blob);
    while (x >= 32767-remainder )
    {
        x := Random.rangeFrom(8,blob);
    };
    return from + x % n;
  };
};