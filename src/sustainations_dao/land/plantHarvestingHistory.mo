import Types "../types";
import State "../state";

module PlantHarvestingHistory {
  public func getData(plantHarvestingHistory : Types.PlantHarvestingHistory) : Types.PlantHarvestingHistory {
    let newPlantHarvestingHistory : Types.PlantHarvestingHistory = {
      id = plantHarvestingHistory.id;
      harvesterId = plantHarvestingHistory.harvesterId;
      plantId = plantHarvestingHistory.plantId;
      harvestTime = plantHarvestingHistory.harvestTime;
    };
    return newPlantHarvestingHistory;
  };

  public func create(plantHarvestingHistory : Types.PlantHarvestingHistory, state : State.State) {
    state.plantHarvestingHistories.put(plantHarvestingHistory.id, getData(plantHarvestingHistory));
  };

  public func update(plantHarvestingHistory : Types.PlantHarvestingHistory, state : State.State) {
    let updated = state.plantHarvestingHistories.replace(plantHarvestingHistory.id, getData(plantHarvestingHistory));
  };
}