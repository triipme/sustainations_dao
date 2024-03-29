module {
  public type Interface = actor {
    greet : () -> async ();
    proj : query (easting: Float, northing: Float, zone_num: Int32, zone_letter: Text) -> async (Float, Float);
    randomnumber : (begin: Float, end: Float) -> async Nat64;
    randompair : (begin: Float, end: Float) -> async (Nat64,Nat64);
  };
};
