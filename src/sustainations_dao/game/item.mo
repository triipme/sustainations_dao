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

  public func create(uuid : Text, item : Types.Item, state : State.State) {
    state.items.put(uuid, getData(item));
  };

  public func update(uuid : Text, item : Types.Item, state : State.State) {
    let updated = state.items.replace(uuid, getData(item));
  };
}