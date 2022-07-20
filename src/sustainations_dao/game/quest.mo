import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Quest {
  public func getData(quest : Types.Quest) : Types.Quest {
    let newQuest : Types.Quest = {
      id = quest.id;
      name = quest.name;
      price = quest.price;
      description = quest.description;
      images = quest.images;
    };
    return newQuest;
  };

  public func create(uuid : Text, quest : Types.Quest, state : State.State) {
    state.quests.put(uuid, getData(quest));
  };

  public func update(uuid : Text, quest : Types.Quest, state : State.State) {
    let updated = state.quests.replace(uuid, getData(quest));
  };
}