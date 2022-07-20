import Types "../types";
import State "../state";

module GearClass {
  public func getData(gearClass : Types.GearClass) : Types.GearClass {
    let newGearClass : Types.GearClass = {
      id = gearClass.id;
      name = gearClass.name;
      description = gearClass.description;
      mainStat = gearClass.mainStat;
    };
    return newGearClass;
  };

  public func create(gearClass : Types.GearClass, state : State.State) {
    state.gearClasses.put(gearClass.id, getData(gearClass));
  };

  public func update(gearClass : Types.GearClass, state : State.State) {
    let updated = state.gearClasses.replace(gearClass.id, getData(gearClass));
  };
}