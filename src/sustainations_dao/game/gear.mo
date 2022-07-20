import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Gear {
  public func getData(gear : Types.Gear) : Types.Gear {
    let newGear : Types.Gear = {
      id = gear.id;
      name = gear.name;
      description = gear.description;
      images = gear.images;
      gearClassId = gear.gearClassId;
      gearRarity = gear.gearRarity;
      substatIds = gear.substatIds;
    };
    return newGear;
  };
  public func create(gear : Types.Gear, state : State.State) {
    state.gears.put(gear.id, getData(gear));
  };

  public func update(gear : Types.Gear, state : State.State) {
    let updated = state.gears.replace(gear.id, getData(gear));
  };
}