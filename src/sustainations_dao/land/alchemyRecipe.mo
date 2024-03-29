import Types "../types";
import State "../state";

module AlchemyRecipe {
  public func getData(alchemyRecipe : Types.AlchemyRecipe) : Types.AlchemyRecipe {
    let newAlchemyRecipe : Types.AlchemyRecipe = {
      id = alchemyRecipe.id;
      usableItemId = alchemyRecipe.usableItemId;
      description = alchemyRecipe.description;
      craftingTime = alchemyRecipe.craftingTime;
    };
    return newAlchemyRecipe;
  };

  public func create(alchemyRecipe : Types.AlchemyRecipe, state : State.State) {
    state.alchemyRecipes.put(alchemyRecipe.id, getData(alchemyRecipe));
  };

  public func update(alchemyRecipe : Types.AlchemyRecipe, state : State.State) {
    let updated = state.alchemyRecipes.replace(alchemyRecipe.id, getData(alchemyRecipe));
  };
}