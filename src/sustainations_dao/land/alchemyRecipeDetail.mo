import Types "../types";
import State "../state";
import Array "mo:base/Array";

module AlchemyRecipeDetail {
  public func getData(alchemyRecipeDetail : Types.AlchemyRecipeDetail) : Types.AlchemyRecipeDetail {
    let newAlchemyRecipeDetail : Types.AlchemyRecipeDetail = {
      id = alchemyRecipeDetail.id;
      recipeId = alchemyRecipeDetail.recipeId;
      productId = alchemyRecipeDetail.productId;
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

  public func getAlchemyRecipeDetails(alchemyRecipeId : Text, state : State.State) : [Types.AlchemyRecipeDetail] {
    var list : [Types.AlchemyRecipeDetail] = [];
    for (alchemyRecipeDetail in state.alchemyRecipeDetails.vals()) {
      if (alchemyRecipeDetail.recipeId == alchemyRecipeId) {
        list := Array.append<Types.AlchemyRecipeDetail>(list,[alchemyRecipeDetail]);
      };
    };
    return list;
  };
}