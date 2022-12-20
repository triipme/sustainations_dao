import Principal "mo:base/Principal";
import Types "../types";
import State "../state";

module LandBuyingStatus {
  public func getData(landBuyingStatus : Types.LandBuyingStatus) : Types.LandBuyingStatus {
    let newLandBuyingStatus : Types.LandBuyingStatus = {
      id = landBuyingStatus.id;
      geometry = landBuyingStatus.geometry;
      randomTimes = landBuyingStatus.randomTimes;
    };
    return newLandBuyingStatus;
  };

  public func create(landBuyingStatus : Types.LandBuyingStatus, state : State.State) {
    state.landBuyingStatuses.put(Principal.toText(landBuyingStatus.id), getData(landBuyingStatus));
  };

  public func update(landBuyingStatus : Types.LandBuyingStatus, state : State.State) {
    let updated = state.landBuyingStatuses.replace(Principal.toText(landBuyingStatus.id), getData(landBuyingStatus));
  };
}