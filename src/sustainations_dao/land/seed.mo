import Option "mo:base/Option";
import Types "../types";
import State "../state";

module Seed {
  public func getData(seed : Types.Seed) : Types.Seed {
    let newSeed : Types.Seed = {
      id = seed.id;
      harvestedProductId = seed.harvestedProductId;
      materialId = seed.materialId;
      rowSize = seed.rowSize;
      columnSize = seed.columnSize;
      name = seed.name;
      description = seed.description;
      waitTime = seed.waitTime;
      expiryTime = seed.expiryTime;
      grownCondition = seed.grownCondition;
      minAmount = seed.minAmount;
      maxAmount = seed.maxAmount;
    };
    return newSeed;
  };

  public func create(seed : Types.Seed, state : State.State) {
    state.seeds.put(seed.id, getData(seed));
  };

  public func update(seed : Types.Seed, state : State.State) {
    let updated = state.seeds.replace(seed.id, getData(seed));
  };
}