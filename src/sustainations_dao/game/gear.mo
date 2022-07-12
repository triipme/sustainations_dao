import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Gear {
  public func getData(gear : Types.Gear) : Types.Gear {
    let newGear : Types.Gear = {
      name = gear.name;
      description = gear.description;
      images = gear.images;
      gearClassId = gear.gearClassId;
      gearRarity = gear.gearRarity;
      substatIds = gear.substatIds;
    };
    return newGear;
  };
  public func create(uuid : Text, gear : Types.Gear, state : State.State) {
    state.gears.put(uuid, getData(gear));
  };

  public func update(uuid : Text, gear : Types.Gear, state : State.State) {
    let updated = state.gears.replace(uuid, getData(gear));
  };
}