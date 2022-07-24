import Option "mo:base/Option";

import Types "../types";
import State "../state";

module QuestItem {
  public func getData(questItem : Types.QuestItem) : Types.QuestItem {
    let newQuestItem : Types.QuestItem = {
      id = questItem.id;
      itemId = questItem.itemId;
      questId = questItem.questId;
    };
    return newQuestItem;
  };

  public func create(questItem : Types.QuestItem, state : State.State) {
    state.questItems.put(questItem.id, getData(questItem));
  };

  public func update(questItem : Types.QuestItem, state : State.State) {
    let updated = state.questItems.replace(questItem.id, getData(questItem));
  };
}
