import Option "mo:base/Option";
import Types "../types";
import State "../state";

module FarmEffect {
  public func getData(farmEffect : Types.FarmEffect) : Types.FarmEffect {
    let newFarmEffect : Types.FarmEffect = {
      id = farmEffect.id;
      symbol = farmEffect.symbol;
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
}