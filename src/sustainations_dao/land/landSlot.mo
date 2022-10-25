import Option "mo:base/Option";
import Types "../types";
import State "../state";

module LandSlot {
  public func getData(landSlot : Types.LandSlot) : Types.LandSlot {
    let newLandSlot : Types.LandSlot = {
      id = landSlot.id;
      ownerId = landSlot.ownerId;
      isPremium = landSlot.isPremium;
      isSelling = landSlot.isSelling;
      indexRow = landSlot.indexRow;
      indexColumn = landSlot.indexColumn;
      zoneNumber = landSlot.zoneNumber;
      zoneLetter = landSlot.zoneLetter;
      easting = landSlot.easting;
      northing = landSlot.northing;
      price = landSlot.price;
    };
    return newLandSlot;
  };

  public func create(landSlot : Types.LandSlot, state : State.State) {
    state.landSlots.put(landSlot.id, getData(landSlot));
  };

  public func update(landSlot : Types.LandSlot, state : State.State) {
    state.landSlots.put(landSlot.id, getData(landSlot));
  };
}