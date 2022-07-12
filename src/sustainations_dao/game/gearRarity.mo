import Types "../types";
import State "../state";

module GearRarity {
  public func getData(gearRarity : Types.GearRarity) : Types.GearRarity {
    let newGearRarity : Types.GearRarity = {
      name = gearRarity.name;
      description = gearRarity.description;
      boxColor = gearRarity.boxColor;
    };
    return newGearRarity;
  };

  public func create(uuid : Text, gearRarity : Types.GearRarity, state : State.State) {
    state.gearRarities.put(uuid, getData(gearRarity));
  };

  public func update(uuid : Text, gearRarity : Types.GearRarity, state : State.State) {
    let updated = state.gearRarities.replace(uuid, getData(gearRarity));
  };
}