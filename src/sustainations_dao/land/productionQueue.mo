import Types "../types";
import State "../state";

module ProductionQueue {
  public func getData(productionQueue : Types.ProductionQueue) : Types.ProductionQueue {
    let newProductionQueue : Types.ProductionQueue = {
      id = productionQueue.id;
      nodeAmount = productionQueue.nodeAmount;
      queueMaxSize = productionQueue.queueMaxSize;
    };
    return newProductionQueue;
  };

  public func create(productionQueue : Types.ProductionQueue, state : State.State) {
    state.productionQueues.put(productionQueue.id, getData(productionQueue));
  };

  public func update(productionQueue : Types.ProductionQueue, state : State.State) {
    let updated = state.productionQueues.replace(productionQueue.id, getData(productionQueue));
  };
}