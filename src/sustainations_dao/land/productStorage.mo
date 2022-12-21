import Types "../types";
import State "../state";

module ProductStorage {
  public func getData(productStorage : Types.ProductStorage) : Types.ProductStorage {
    let newProductStorage : Types.ProductStorage = {
      id = productStorage.id;
      userId = productStorage.userId;
      productId = productStorage.productId;
      quality = productStorage.quality;
      amount = productStorage.amount;
    };
    return newProductStorage;
  };

  public func create(productStorage : Types.ProductStorage, state : State.State) {
    state.productStorages.put(productStorage.id, getData(productStorage));
  };

  public func update(productStorage : Types.ProductStorage, state : State.State) {
    let updated = state.productStorages.replace(productStorage.id, getData(productStorage));
  };
}