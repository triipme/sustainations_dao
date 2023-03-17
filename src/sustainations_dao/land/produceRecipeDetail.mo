import Types "../types";
import State "../state";
import Array "mo:base/Array";

module ProduceRecipeDetail {
  public func getData(produceRecipeDetail : Types.ProduceRecipeDetail) : Types.ProduceRecipeDetail {
    let newProduceRecipeDetail : Types.ProduceRecipeDetail = {
      id = produceRecipeDetail.id;
      recipeId = produceRecipeDetail.recipeId;
      productId = produceRecipeDetail.productId;
      amount = produceRecipeDetail.amount;
    };
    return newProduceRecipeDetail;
  };

  public func create(produceRecipeDetail : Types.ProduceRecipeDetail, state : State.State) {
    state.produceRecipeDetails.put(produceRecipeDetail.id, getData(produceRecipeDetail));
  };

  public func update(produceRecipeDetail : Types.ProduceRecipeDetail, state : State.State) {
    let updated = state.produceRecipeDetails.replace(produceRecipeDetail.id, getData(produceRecipeDetail));
  };

  public func getProduceRecipeDetails(produceRecipeId : Text, state : State.State) : [Types.ProduceRecipeDetail] {
    var list : [Types.ProduceRecipeDetail] = [];
    for (produceRecipeDetail in state.produceRecipeDetails.vals()) {
      if (produceRecipeDetail.recipeId == produceRecipeId) {
        list := Array.append<Types.ProduceRecipeDetail>(list,[produceRecipeDetail]);
      };
    };
    return list;
  };
}