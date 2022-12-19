import Types "../types";
import State "../state";

module BuildingBuyingHistory {
  public func getData(buildingBuyingHistory : Types.BuildingBuyingHistory) : Types.BuildingBuyingHistory {
    let newBuildingBuyingHistory : Types.BuildingBuyingHistory = {
      id = buildingBuyingHistory.id;
      buyerId = buildingBuyingHistory.buyerId;
      constructionId = buildingBuyingHistory.constructionId;
      buyTime = buildingBuyingHistory.buyTime;
      price = buildingBuyingHistory.price;
    };
    return newBuildingBuyingHistory;
  };

  public func create(buildingBuyingHistory : Types.BuildingBuyingHistory, state : State.State) {
    state.buildingBuyingHistories.put(buildingBuyingHistory.id, getData(buildingBuyingHistory));
  };

  public func update(buildingBuyingHistory : Types.BuildingBuyingHistory, state : State.State) {
    let updated = state.buildingBuyingHistories.replace(buildingBuyingHistory.id, getData(buildingBuyingHistory));
  };
}