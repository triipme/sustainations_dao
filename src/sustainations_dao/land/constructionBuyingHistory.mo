import Types "../types";
import State "../state";

module Building {
  public func getData(constructionBuyingHistory : Types.ConstructionBuyingHistory) : Types.ConstructionBuyingHistory {
    let newConstructionBuyingHistory : Types.ConstructionBuyingHistory = {
      id = constructionBuyingHistory.id;
      buyerId = constructionBuyingHistory.buyerId;
      constructionId = constructionBuyingHistory.constructionId;
      buyTime = constructionBuyingHistory.buyTime;
      price = constructionBuyingHistory.price;
    };
    return newConstructionBuyingHistory;
  };

  public func create(constructionBuyingHistory : Types.ConstructionBuyingHistory, state : State.State) {
    state.constructionBuyingHistories.put(constructionBuyingHistory.id, getData(constructionBuyingHistory));
  };

  public func update(constructionBuyingHistory : Types.ConstructionBuyingHistory, state : State.State) {
    let updated = state.constructionBuyingHistories.replace(constructionBuyingHistory.id, getData(constructionBuyingHistory));
  };
}