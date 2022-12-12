import Option "mo:base/Option";
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

  public func updatePlantStatus(remainingTime : Int, plant : Types.Plant, seed : Types.Seed, state : State.State) : Text {
    if (remainingTime == 0) {
      let updatePlant : Types.Plant = {
        id = plant.id;
        seedId = plant.seedId;
        hasEffectId = plant.hasEffectId;
        status = "fullGrown";
        plantTime = plant.plantTime;
      };
      let updated = Plant.update(updatePlant, state);
      return "fullGrown";
    };
    if (remainingTime <= seed.waitTime / 2) {
      let updatePlant : Types.Plant = {
        id = plant.id;
        seedId = plant.seedId;
        hasEffectId = plant.hasEffectId;
        status = "growing";
        plantTime = plant.plantTime;
      };
      let updated = Plant.update(updatePlant, state);
      return "growing";
    };
    return "newlyPlanted";
  };
}