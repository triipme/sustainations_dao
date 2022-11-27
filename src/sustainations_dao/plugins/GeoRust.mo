import Result "mo:base/Result";
module {
  public type Interface = actor {
    greet : () -> async ();
    proj : (easting: Float, northing: Float, zone_num: Int32, zone_letter: Text) -> async (Float, Float);
    randomnumber : (begin: Float, end: Float) -> async Nat64;
    randompair : (begin: Float, end: Float) -> async (Nat64,Nat64);
    fetch_coin_price : (id : Text) -> async Float;
  };
};
