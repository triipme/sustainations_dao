import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Quest {
  public func create(uuid : Text, quest : Types.Quest, state : State.State) {
    let newQuest : Types.Quest = {
      uuid = ?uuid;
      name = quest.name;
      price = quest.price;
      description = quest.description;
      images : ?[Text] = Option.get(null, ?[]);
    };
    let createdQuest = state.quests.put(uuid, newQuest);
  };

  public func update(uuid : Text, quest : Types.Quest, state : State.State) {
    let newQuest : Types.Quest = {
      uuid = ?uuid;
      name = quest.name;
      price = quest.price;
      description = quest.description;
      images = quest.images;
    };
    let createdQuest = state.quests.replace(uuid, newQuest);
  };
}