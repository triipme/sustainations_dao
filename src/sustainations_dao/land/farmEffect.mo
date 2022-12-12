import Option "mo:base/Option";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Types "../types";
import State "../state";

module FarmEffect {
  public func getData(farmEffect : Types.FarmEffect) : Types.FarmEffect {
    let newFarmEffect : Types.FarmEffect = {
      id = farmEffect.id;
      symbol = farmEffect.symbol;
      value = farmEffect.value;
      effect = farmEffect.effect;
      description = farmEffect.description;
    };
    return newFarmEffect;
  };

  public func create(farmEffect : Types.FarmEffect, state : State.State) {
    state.farmEffects.put(farmEffect.id, getData(farmEffect));
  };

  public func update(farmEffect : Types.FarmEffect, state : State.State) {
    state.farmEffects.put(farmEffect.id, getData(farmEffect));
  };

  // check Farm Effect
  public func checkEffect(farmObjects : [Types.FarmObject], state : State.State) : async Text {
    for (effect in state.farmEffects.vals()) {
      for (farmObject in farmObjects.vals()) {        
        if ((effect.symbol == "T") 
          and farmObjects.size() == 7
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == farmObject.indexRow and val.indexColumn == Int.max(farmObject.indexColumn - 1, 0)}) != null)
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == farmObject.indexRow and val.indexColumn == farmObject.indexColumn + 1}) != null)
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == Int.max(farmObject.indexRow - 1, 0) and val.indexColumn == farmObject.indexColumn}) != null) 
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == Int.max(farmObject.indexRow - 2, 0) and val.indexColumn == farmObject.indexColumn}) != null)
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == Int.max(farmObject.indexRow - 3, 0) and val.indexColumn == farmObject.indexColumn}) != null)
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == Int.max(farmObject.indexRow - 4, 0) and val.indexColumn == farmObject.indexColumn}) != null)
        ) {
          return effect.id;
        };

        if ((effect.symbol == "-") 
          and farmObjects.size() == 5
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == farmObject.indexRow and val.indexColumn == farmObject.indexColumn + 1}) != null)
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == farmObject.indexRow and val.indexColumn == farmObject.indexColumn + 2}) != null)
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == farmObject.indexRow and val.indexColumn == farmObject.indexColumn + 3}) != null) 
          and (Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == farmObject.indexRow and val.indexColumn == farmObject.indexColumn + 4}) != null)
          ) {
          return effect.id;
        };
        
      };
    };
    return "None";
  };

  public func getFarmEffectTimeValue(plant : Types.Plant, state : State.State) : Float {
    let rsHasEffect = state.hasFarmEffects.get(plant.hasEffectId);
    switch (rsHasEffect) {
      case null {
        return 0.0;
      };
      case (?hasEffect) {
        let rsEffect = state.farmEffects.get(hasEffect.farmEffectId);
        switch (rsEffect) {
          case null {
            return 0.0;
          };
          case (?farmEffect) {
            if (farmEffect.effect=="waitTime") {
              return farmEffect.value;
            } else {
              return 0.0;
            };
          };
        };
      };
    };
  };
}