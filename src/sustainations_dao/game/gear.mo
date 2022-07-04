import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Gear {
  public func create(uuid : Text, gear : Types.Gear, state : State.State) {
    let newGear : Types.Gear = {
      uuid = ?uuid;
      name = gear.name;
      description = gear.description;
      images = gear.images;
      gearClassId = gear.gearClassId;
      gearRarity = gear.gearRarity;
      substatIds : ?[Text] = Option.get(null, ?[]);
    };
    let createdGear = state.gears.put(uuid, newGear);
  };

  public func update(uuid : Text, gear : Types.Gear, state : State.State) {
    let newGear : Types.Gear = {
      uuid = ?uuid;
      name = gear.name;
      description = gear.description;
      images = gear.images;
      gearClassId = gear.gearClassId;
      gearRarity = gear.gearRarity;
      substatIds = gear.substatIds;
    };
    let updatedGear = state.gears.replace(uuid, newGear);
  };
}