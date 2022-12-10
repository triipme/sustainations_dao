import Array "mo:base/Array";
import Int "mo:base/Int";
import Types "../types";
import State "../state";

module LandEffect {
  public func getData(landEffect : Types.LandEffect) : Types.LandEffect {
    let newLandEffect : Types.LandEffect = {
      id = landEffect.id;
      symbol = landEffect.symbol;
      value = landEffect.value;
      effect = landEffect.effect;
      description = landEffect.description;
    };
    return newLandEffect;
  };

  public func create(landEffect : Types.LandEffect, state : State.State) {
    state.landEffects.put(landEffect.id, getData(landEffect));
  };

  public func update(landEffect : Types.LandEffect, state : State.State) {
    state.landEffects.put(landEffect.id, getData(landEffect));
  };

  public func checkEffect(landSlots : [Types.LandSlot], state : State.State) : Text {
    for (effect in state.landEffects.vals()) {
      for (landSlot in landSlots.vals()) {        
        if ((effect.symbol == "-") 
          and landSlots.size() >= 3
          and (Array.find<Types.LandSlot>(landSlots, func (val : Types.LandSlot) : Bool {val.indexRow == landSlot.indexRow and val.indexColumn == landSlot.indexColumn + 1}) != null)
          and (Array.find<Types.LandSlot>(landSlots, func (val : Types.LandSlot) : Bool {val.indexRow == landSlot.indexRow and val.indexColumn == landSlot.indexColumn + 2}) != null)
        ) {
          return effect.id;
        };
      };
    };
    return "None";
  };  
}