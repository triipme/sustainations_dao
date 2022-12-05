import Types "../types";
import State "../state";

module AlchemyRecipeDetail {
  public func getData(alchemyRecipeDetail : Types.AlchemyRecipeDetail) : Types.AlchemyRecipeDetail {
    let newAlchemyRecipeDetail : Types.AlchemyRecipeDetail = {
      id = alchemyRecipeDetail.id;
      recipeId = alchemyRecipeDetail.recipeId;
      usableItemId = alchemyRecipeDetail.usableItemId;
      amount = alchemyRecipeDetail.amount;
    };
    return newAlchemyRecipeDetail;
  };

  public func create(alchemyRecipeDetail : Types.AlchemyRecipeDetail, state : State.State) {
    state.alchemyRecipeDetails.put(alchemyRecipeDetail.id, getData(alchemyRecipeDetail));
  };

  public func update(alchemyRecipeDetail : Types.AlchemyRecipeDetail, state : State.State) {
    let updated = state.alchemyRecipeDetails.replace(alchemyRecipeDetail.id, getData(alchemyRecipeDetail));
  };
}