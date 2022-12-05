import Types "../types";
import State "../state";

module Construction {
  public func getData(construction : Types.Construction) : Types.Construction {
    let newConstruction : Types.Construction = {
      id = construction.id;
      name = construction.name;
      price = construction.price;
      rowSize = construction.rowSize;
      columnSize = construction.columnSize;
      buildWaitTime = construction.buildWaitTime;
      usableItemId = construction.usableItemId;
      resultUsableItemId = construction.resultUsableItemId;
      description = construction.description;
      produceWaitTime = construction.produceWaitTime;
      minAmount = construction.minAmount;
      maxAmount = construction.maxAmount;
    };
    return newConstruction;
  };

  public func create(construction : Types.Construction, state : State.State) {
    state.constructions.put(construction.id, getData(construction));
  };

  public func update(construction : Types.Construction, state : State.State) {
    let updated = state.constructions.replace(construction.id, getData(construction));
  };
}