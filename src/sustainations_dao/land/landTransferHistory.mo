import Option "mo:base/Option";
import Types "../types";
import State "../state";

module LandSlotHistory {
  public func getData(landTransferHistory : Types.LandTransferHistory) : Types.LandTransferHistory {
    let newLandTransferHistory : Types.LandTransferHistory = {
      id = landTransferHistory.id;
      buyerId = landTransferHistory.buyerId;
      ownerId = landTransferHistory.ownerId;
      landId = landTransferHistory.landId;
      transferTime = landTransferHistory.transferTime;
      price = landTransferHistory.price;
    };
    return newLandTransferHistory;
  };

  public func create(landTransferHistory : Types.LandTransferHistory, state : State.State) {
    state.landTransferHistories.put(landTransferHistory.id, getData(landTransferHistory));
  };

  public func update(landTransferHistory : Types.LandTransferHistory, state : State.State) {
    state.landTransferHistories.put(landTransferHistory.id, getData(landTransferHistory));
  };

}