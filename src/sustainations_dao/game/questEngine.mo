import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module QuestEngine {
  public func getData(questEngine : Types.Quest) : Types.QuestEngine {
    let newQuestEngine : Types.QuestEngine = {
      id = questEngine.id;
      name = questEngine.name;
      price = questEngine.price;
      description = questEngine.description;
      images = questEngine.images;
      dateCreate = Time.now();
    };
    return newQuestEngine;
  };

  public func create(questEngine : Types.Quest, state : State.State) {
    state.questEngine.quests.put(questEngine.id, getData(questEngine));
  };

  public func update(questEngine : Types.Quest, state : State.State) {
    let updated = state.questEngine.quests.replace(questEngine.id, getData(questEngine));
  };
}