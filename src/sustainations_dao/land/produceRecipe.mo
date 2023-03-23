import Types "../types";
import State "../state";

module ProduceRecipe {
  public func getData(produceRecipe : Types.ProduceRecipe) : Types.ProduceRecipe {
    let newProduceRecipe : Types.ProduceRecipe = {
      id = produceRecipe.id;
      productId = produceRecipe.productId;
      buildingTypeId = produceRecipe.buildingTypeId;
      description = produceRecipe.description;
      craftingTime = produceRecipe.craftingTime;
    };
    return newProduceRecipe;
  };

  public func create(produceRecipe : Types.ProduceRecipe, state : State.State) {
    state.produceRecipes.put(produceRecipe.id, getData(produceRecipe));
  };

  public func update(produceRecipe : Types.ProduceRecipe, state : State.State) {
    let updated = state.produceRecipes.replace(produceRecipe.id, getData(produceRecipe));
  };
}