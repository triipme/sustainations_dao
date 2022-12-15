import Types "../types";
import State "../state";

module Stash {
  public func getData(stash : Types.Stash) : Types.Stash {
    let newStash : Types.Stash = {
      id = stash.id;
      userId = stash.userId;
      productId = stash.productId;
      quality = stash.quality;
      amount = stash.amount;
    };
    return newStash;
  };

  public func create(stash : Types.Stash, state : State.State) {
    state.stashes.put(stash.id, getData(stash));
  };

  public func update(stash : Types.Stash, state : State.State) {
    let updated = state.stashes.replace(stash.id, getData(stash));
  };
}