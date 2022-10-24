import Array "mo:base/Array";
import Iter "mo:base/Iter";

module Nation {
  public type LandSlot = {
    i : Nat;
    j : Nat;
  };
  public type UTM = (Nat, Nat);

  public func convertLandslotijToUTM(d : Nat, landslot : LandSlot) : [UTM] {
    var result : [UTM] = [];
    var point1 : UTM = (landslot.i * d, landslot.j * d);
    var point2 : UTM = (landslot.i * d, (landslot.j + 1) * d);
    var point3 : UTM = ((landslot.i + 1) * d, (landslot.j + 1)* d);
    var point4 : UTM = ((landslot.i + 1)* d, landslot.j * d);
    result := Array.append<UTM>(result, [point1, point2, point3, point4]);
    return result;
  };

  public func removeDuplicatePoints(list : [UTM]) : [UTM] {
    var result : [UTM] = [];
    for(i in Iter.range(0, list.size()-1)){
      var duplicate = false;
      for(j in Iter.range(i+1, list.size()-1)){
        if(list[i] == list[j]){
          duplicate := true;
        };
      };
      if(duplicate == false){
        result := Array.append<UTM>(result, [list[i]]);
      };
    };
    return result;
  };
};