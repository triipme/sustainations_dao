import Option "mo:base/Option";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Int64 "mo:base/Int64";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";

import Types "../types";
import State "../state";

module QuestEngine {
   public func getDataEngine(caller: Principal, questEngine : Types.QuestEngine) : Types.QuestEngine {
    let newQuestEngine : Types.QuestEngine = {
      id = questEngine.id;
      userId = caller;
      name = questEngine.name;
      price = questEngine.price;
      description = questEngine.description;
      images = questEngine.images;
      isActive = questEngine.isActive;
      dateCreate = questEngine.dateCreate;
      listScene = questEngine.listScene;
    };
    return newQuestEngine;
  };
  public type Quest = {
    id : Text;
    name : Text;
    price : Float;
    description : Text;
    images : Text;
  };
  public func getData(caller: Principal, questEngine : Quest) : Types.QuestEngine {
    let newQuestEngine : Types.QuestEngine = {
      id = questEngine.id;
      userId = caller;
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

  public func create(caller: Principal, questEngine : Quest, state : State.State) {
    state.questEngine.quests.put(questEngine.id, getData(caller, questEngine));
  };

  public func update(caller: Principal, questEngine : Types.QuestEngine, state : State.State) {
    let updated = state.questEngine.quests.replace(questEngine.id, getDataEngine(caller, questEngine));
  };
};
