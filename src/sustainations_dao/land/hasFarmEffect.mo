import Types "../types";
import State "../state";

module UserHasFarmEffect {
  public func getData(hasFarmEffect : Types.UserHasFarmEffect) : Types.UserHasFarmEffect {
    let newHasFarmEffect : Types.UserHasFarmEffect = {
      id = hasFarmEffect.id;
      farmEffectId = hasFarmEffect.farmEffectId;
      userId = hasFarmEffect.userId;
    };
    return newHasFarmEffect;
  };

  public func create(hasFarmEffect : Types.UserHasFarmEffect, state : State.State) {
    state.hasFarmEffects.put(hasFarmEffect.id, getData(hasFarmEffect));
  };

  public func update(hasFarmEffect : Types.UserHasFarmEffect, state : State.State) {
    state.hasFarmEffects.put(hasFarmEffect.id, getData(hasFarmEffect));
  };
}