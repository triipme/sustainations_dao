import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module QuestEngine {
  public func getDataEngine(questEngine : Types.QuestEngine) : Types.QuestEngine {
    let newQuestEngine : Types.QuestEngine = {
      id = questEngine.id;
      name = questEngine.name;
      price = questEngine.price;
      description = questEngine.description;
      images = questEngine.images;
      isActive = false;
      dateCreate = Option.get(?questEngine.dateCreate, Time.now());
      listScene = Option.get(?questEngine.listScene, []);
    };
    return newQuestEngine;
  };
  public func getData(questEngine : Types.Quest) : Types.QuestEngine {
    let newQuestEngine : Types.QuestEngine = {
      id = questEngine.id;
      name = questEngine.name;
      price = questEngine.price;
      description = questEngine.description;
      images = questEngine.images;
      isActive = false;
      dateCreate = Time.now();
      listScene = [];
    };
    return newQuestEngine;
  };

  public func create(questEngine : Types.Quest, state : State.State) {
    state.questEngine.quests.put(questEngine.id, getData(questEngine));
  };

  public func update(questEngine : Types.QuestEngine, state : State.State) {
    let updated = state.questEngine.quests.replace(questEngine.id, getDataEngine(questEngine));
  };
};
