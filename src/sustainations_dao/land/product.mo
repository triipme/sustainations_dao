import Types "../types";
import State "../state";

module Product {
  public func getData(product : Types.Product) : Types.Product {
    let newProduct : Types.Product = {
      id = product.id;
      name = product.name;
      description = product.description;
    };
    return newProduct;
  };

  public func create(product : Types.Product, state : State.State) {
    state.products.put(product.id, getData(product));
  };

  public func update(product : Types.Product, state : State.State) {
    let updated = state.products.replace(product.id, getData(product));
  };
}