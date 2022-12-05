import Types "../types";
import State "../state";

module Plant {
  public func getData(plant : Types.Plant) : Types.Plant {
    let newPlant : Types.Plant = {
      id = plant.id;
      seedId = plant.seedId;
      hasEffectId = plant.hasEffectId;
      status = plant.status;
      plantTime = plant.plantTime;
    };
    return newPlant;
  };

  public func create(plant : Types.Plant, state : State.State) {
    state.plants.put(plant.id, getData(plant));
  };

  public func update(plant : Types.Plant, state : State.State) {
    let updated = state.plants.replace(plant.id, getData(plant));
  };
}