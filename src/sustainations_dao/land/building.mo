import Types "../types";
import State "../state";

module Building {
  public func getData(building : Types.Building) : Types.Building {
    let newBuilding : Types.Building = {
      id = building.id;
      buildingTypeId = building.buildingTypeId;
      resultUsableItemId = building.resultUsableItemId;
      status = building.status;
      buildTime = building.buildTime;
      startProducingTime = building.startProducingTime;
    };
    return newBuilding;
  };

  public func create(building : Types.Building, state : State.State) {
    state.buildings.put(building.id, getData(building));
  };

  public func update(building : Types.Building, state : State.State) {
    let updated = state.buildings.replace(building.id, getData(building));
  };
}