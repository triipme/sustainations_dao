import Types "../types";
import State "../state";

module GearSubstat {
  public func getData(gearSubstat : Types.GearSubstat) : Types.GearSubstat {
    let newGearSubstat : Types.GearSubstat = {
      id = gearSubstat.id;
      substat = gearSubstat.substat;
      description = gearSubstat.description;
    };
    return newGearSubstat;
  };
  public func create(gearSubstat : Types.GearSubstat, state : State.State) {
    state.gearSubstats.put(gearSubstat.id, getData(gearSubstat));
  };

  public func update(gearSubstat : Types.GearSubstat, state : State.State) {
    let updated = state.gearSubstats.replace(gearSubstat.id, getData(gearSubstat));
  };
}