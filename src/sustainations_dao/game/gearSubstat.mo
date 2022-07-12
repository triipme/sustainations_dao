import Types "../types";
import State "../state";

module GearSubstat {
  public func getData(gearSubstat : Types.GearSubstat) : Types.GearSubstat {
    let newGearSubstat : Types.GearSubstat = {
      substat = gearSubstat.substat;
      description = gearSubstat.description;
    };
    return newGearSubstat;
  };
  public func create(uuid : Text, gearSubstat : Types.GearSubstat, state : State.State) {
    state.gearSubstats.put(uuid, getData(gearSubstat));
  };

  public func update(uuid : Text, gearSubstat : Types.GearSubstat, state : State.State) {
    let updated = state.gearSubstats.replace(uuid, getData(gearSubstat));
  };
}