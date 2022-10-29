module {
  public type Interface = actor {
    greet : () -> async ();
    proj : (easting: Float, northing: Float, zone_num: Int32, zone_letter: Text) -> async (Float, Float);
    randomnumber : (begin: Float, end: Float, d: Nat64) -> async Nat64;
  };
};
