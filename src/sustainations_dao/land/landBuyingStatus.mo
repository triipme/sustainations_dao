import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "../types";
import State "../state";

module LandBuyingStatus {
  public func getData(landBuyingStatus : Types.LandBuyingStatus) : Types.LandBuyingStatus {
    let newLandBuyingStatus : Types.LandBuyingStatus = {
      id = landBuyingStatus.id;
      currentZoneNumber = landBuyingStatus.currentZoneNumber;
      currentZoneLetter = landBuyingStatus.currentZoneLetter;
      currentIndexRow = landBuyingStatus.currentIndexRow;
      currentIndexColumn = landBuyingStatus.currentIndexColumn;
      randomTimes = landBuyingStatus.randomTimes;
    };
    return newLandBuyingStatus;
  };

  public func create(landBuyingStatus : Types.LandBuyingStatus, state : State.State) {
    state.landBuyingStatuses.put(Principal.toText(landBuyingStatus.id), getData(landBuyingStatus));
  };

  public func update(landBuyingStatus : Types.LandBuyingStatus, state : State.State) {
    state.landBuyingStatuses.put(Principal.toText(landBuyingStatus.id), getData(landBuyingStatus));
  };
}