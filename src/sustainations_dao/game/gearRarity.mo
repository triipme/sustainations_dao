import Types "../types";
import State "../state";

module GearRarity {
  public func create(uuid : Text, gearRarity : Types.GearRarity, state : State.State) {
    let newGearRarity : Types.GearRarity = {
      uuid = ?uuid;
      name = gearRarity.name;
      description = gearRarity.description;
      boxColor = gearRarity.boxColor;
    };
    let createdGearRarity = state.gearRarities.put(uuid, newGearRarity);
  };

  public func update(uuid : Text, gearRarity : Types.GearRarity, state : State.State) {
    let newGearRarity : Types.GearRarity = {
      uuid = ?uuid;
      name = gearRarity.name;
      description = gearRarity.description;
      boxColor = gearRarity.boxColor;
    };
    let updatedGearRarity = state.gearRarities.replace(uuid, newGearRarity);
  };
}