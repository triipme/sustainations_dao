import Types "../types";
import State "../state";

module GearClass {
  public func create(uuid : Text, gearClass : Types.GearClass, state : State.State) {
    let newGearClass : Types.GearClass = {
      uuid = ?uuid;
      name = gearClass.name;
      description = gearClass.description;
      mainStat = gearClass.mainStat;
    };
    let createdGearClass = state.gearClasses.put(uuid, newGearClass);
  };

  public func update(uuid : Text, gearClass : Types.GearClass, state : State.State) {
    let newGearClass : Types.GearClass = {
      uuid = ?uuid;
      name = gearClass.name;
      description = gearClass.description;
      mainStat = gearClass.mainStat;
    };
    let updatedGearClass = state.gearClasses.replace(uuid, newGearClass);
  };
}