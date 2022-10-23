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
      zone = landSlot.zone;
      xIndex = landSlot.xIndex;
      yIndex = landSlot.yIndex;
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