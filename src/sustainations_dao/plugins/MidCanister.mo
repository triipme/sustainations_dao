module {
  public type Interface = actor {
    randomIndex : (begin : Float, end : Float) -> async Int;
    randomPair : (begin : Float, end : Float) -> async (Int, Int);
    utm2lonlat : (
      easting : Float,
      northing : Float,
      zoneNum : Int32,
      zoneLetter : Text
    ) -> async (Float, Float);
  };
};
