import Types "../types";
import State "../state";

module GearRarity {
  public func getData(gearRarity : Types.GearRarity) : Types.GearRarity {
    let newGearRarity : Types.GearRarity = {
      id = gearRarity.id;
      name = gearRarity.name;
      description = gearRarity.description;
      boxColor = gearRarity.boxColor;
    };
    return newGearRarity;
  };

  public func create(gearRarity : Types.GearRarity, state : State.State) {
    state.gearRarities.put(gearRarity.id, getData(gearRarity));
  };

  public func update(gearRarity : Types.GearRarity, state : State.State) {
    let updated = state.gearRarities.replace(gearRarity.id, getData(gearRarity));
  };
}