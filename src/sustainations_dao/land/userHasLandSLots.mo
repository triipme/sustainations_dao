import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "../types";
import State "../state";

module UserHasLands {
  public func getData(userHasLands : Types.UserHasLandSLots) : Types.UserHasLandSLots {
    let newLandConfig : Types.UserHasLandSLots = {
      id = userHasLands.id;
      landSlotIds = userHasLands.landSlotIds;
    };
    return newLandConfig;
  };

  public func create(userHasLands : Types.UserHasLandSLots, state : State.State) {
    state.userHasLandSlots.put(Principal.toText(userHasLands.id), getData(userHasLands));
  };

  public func update(userHasLands : Types.UserHasLandSLots, state : State.State) {
    state.userHasLandSlots.put(Principal.toText(userHasLands.id), getData(userHasLands));
  };  
}