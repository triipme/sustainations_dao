import Types "../types";
import State "../state";

module GearClass {
  public func getData(gearClass : Types.GearClass) : Types.GearClass {
    let newGearClass : Types.GearClass = {
      name = gearClass.name;
      description = gearClass.description;
      mainStat = gearClass.mainStat;
    };
    return newGearClass;
  };

  public func create(uuid : Text, gearClass : Types.GearClass, state : State.State) {
    state.gearClasses.put(uuid, getData(gearClass));
  };

  public func update(uuid : Text, gearClass : Types.GearClass, state : State.State) {
    let updated = state.gearClasses.replace(uuid, getData(gearClass));
  };
}