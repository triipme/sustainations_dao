import Option "mo:base/Option";
import Types "../types";
import State "../state";

module Item {
  public func getData(item : Types.Item) : Types.Item {
    let newItem : Types.Item = {
      id = item.id;
      name = item.name;
      strengthRequire = item.strengthRequire;
      images = item.images;
    };
    return newItem;
  };

  public func create(item : Types.Item, state : State.State) {
    state.items.put(item.id, getData(item));
  };

  public func update(item : Types.Item, state : State.State) {
    let updated = state.items.replace(item.id, getData(item));
  };
}