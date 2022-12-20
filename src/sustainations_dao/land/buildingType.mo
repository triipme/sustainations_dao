import Types "../types";
import State "../state";

module BuildingType {
  public func getData(buildingType : Types.BuildingType) : Types.BuildingType {
    let newBuildingType : Types.BuildingType = {
      id = buildingType.id;
      name = buildingType.name;
      price = buildingType.price;
      rowSize = buildingType.rowSize;
      columnSize = buildingType.columnSize;
      buildWaitTime = buildingType.buildWaitTime;
      // usableItemId = buildingType.usableItemId;
      // resultUsableItemId = buildingType.resultUsableItemId;
      description = buildingType.description;
      // produceWaitTime = buildingType.produceWaitTime;
      // minAmount = buildingType.minAmount;
      // maxAmount = buildingType.maxAmount;
    };
    return newBuildingType;
  };

  public func create(buildingType : Types.BuildingType, state : State.State) {
    state.buildingTypes.put(buildingType.id, getData(buildingType));
  };

  public func update(buildingType : Types.BuildingType, state : State.State) {
    let updated = state.buildingTypes.replace(buildingType.id, getData(buildingType));
  };
}