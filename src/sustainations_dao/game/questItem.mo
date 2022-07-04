import Option "mo:base/Option";
import Types "../types";
import State "../state";

module QuestItem {
  public func create(uuid : Text, questItem : Types.QuestItem, state : State.State) {
    let newQuestItem : Types.QuestItem = {
      uuid = ?uuid;
      name = questItem.name;
      strengthRequire = questItem.strengthRequire;
      images : ?[Text] = Option.get(null, ?[]);
    };
    let createdQuestItem = state.questItems.put(uuid, newQuestItem);
  };

  public func update(uuid : Text, questItem : Types.QuestItem, state : State.State) {
    let newQuestItem : Types.QuestItem = {
      uuid = ?uuid;
      name = questItem.name;
      strengthRequire = questItem.strengthRequire;
      images = questItem.images;
    };
    let updatedQuestItem = state.questItems.replace(uuid, newQuestItem);
  };
}