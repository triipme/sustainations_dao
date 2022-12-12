import Types "../types";
import State "../state";

module PlantPenaltyTime {
  public func getData(plantPenaltyTime : Types.PlantPenaltyTime) : Types.PlantPenaltyTime {
    let newPlantPenaltyTime : Types.PlantPenaltyTime = {
      id = plantPenaltyTime.id;
      penaltyTime = plantPenaltyTime.penaltyTime;
    };
    return newPlantPenaltyTime;
  };

  public func create(plantPenaltyTime : Types.PlantPenaltyTime, state : State.State) {
    state.plantPenaltyTimes.put(plantPenaltyTime.id, getData(plantPenaltyTime));
  };

  public func update(plantPenaltyTime : Types.PlantPenaltyTime, state : State.State) {
    let updated = state.plantPenaltyTimes.replace(plantPenaltyTime.id, getData(plantPenaltyTime));
  };

  public func getPlantPenaltyTime(plant : Types.Plant, state : State.State) : Int {
    let rsPlantPenaltyTime = state.plantPenaltyTimes.get(plant.id);
    switch(rsPlantPenaltyTime) {
      case null { return 0;};
      case (?V) { return V.penaltyTime;};
    };
  };
}