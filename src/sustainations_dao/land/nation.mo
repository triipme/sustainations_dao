import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "../types";
import State "../state";

module Nation {
  public func getData(nation : Types.Nation) : Types.Nation {
    let newLandConfig : Types.Nation = {
      id = nation.id;
      landSlotIds = nation.landSlotIds;
      indexRow = nation.indexRow;
      indexColumn = nation.indexColumn;
      utms = nation.utms;
    };
    return newLandConfig;
  };

  public func create(nation : Types.Nation, state : State.State) {
    state.nations.put(Principal.toText(nation.id), getData(nation));
  };

  public func update(nation : Types.Nation, state : State.State) {
    state.nations.put(Principal.toText(nation.id), getData(nation));
  };  

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
}