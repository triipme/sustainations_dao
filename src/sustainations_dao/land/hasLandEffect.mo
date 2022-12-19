import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "../types";
import State "../state";

module UserHasLandEffect {
  public func getData(userHasLandEffect : Types.UserHasLandEffect) : Types.UserHasLandEffect {
    let newUserHasLandEffect : Types.UserHasLandEffect = {
      id = userHasLandEffect.id;
      landEffectId = userHasLandEffect.landEffectId;
    };
    return newUserHasLandEffect;
  };

  public func create(userHasLandEffect : Types.UserHasLandEffect, state : State.State) {
    state.userHasLandEffects.put(Principal.toText(userHasLandEffect.id), getData(userHasLandEffect));
  };

  public func update(userHasLandEffect : Types.UserHasLandEffect, state : State.State) {
    state.userHasLandEffects.put(Principal.toText(userHasLandEffect.id), getData(userHasLandEffect));
  };
}