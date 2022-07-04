import Types "../types";
import State "../state";

module GearSubstat {
  public func create(uuid : Text, gearSubstat : Types.GearSubstat, state : State.State) {
    let newGearSubstat : Types.GearSubstat = {
      uuid = ?uuid;
      substat = gearSubstat.substat;
      description = gearSubstat.description;
    };
    let createdGearSubstat = state.gearSubstats.put(uuid, newGearSubstat);
  };

  public func update(uuid : Text, gearSubstat : Types.GearSubstat, state : State.State) {
    let newGearSubstat : Types.GearSubstat = {
      uuid = ?uuid;
      substat = gearSubstat.substat;
      description = gearSubstat.description;
    };
    let updatedGearSubstat = state.gearSubstats.replace(uuid, newGearSubstat);
  };
}