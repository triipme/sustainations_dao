import Types "../types";
import State "../state";

module ProductionQueueNode {
  public func getData(productionQueueNode : Types.ProductionQueueNode) : Types.ProductionQueueNode {
    let newProductionQueueNode : Types.ProductionQueueNode = {
      id = productionQueueNode.id;
      recipeId = productionQueueNode.recipeId;
      status = productionQueueNode.status;
      startCraftingTime = productionQueueNode.startCraftingTime;
    };
    return newProductionQueueNode;
  };

  public func create(productionQueueNode : Types.ProductionQueueNode, state : State.State) {
    state.productionQueueNodes.put(productionQueueNode.id, getData(productionQueueNode));
  };

  public func update(productionQueueNode : Types.ProductionQueueNode, state : State.State) {
    let updated = state.productionQueueNodes.replace(productionQueueNode.id, getData(productionQueueNode));
  };
}