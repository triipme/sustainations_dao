import Option "mo:base/Option";

import Types "../types";
import State "../state";

module QuestItem {
  public func getData(questItem : Types.QuestItem) : Types.QuestItem {
    let newQuestItem : Types.QuestItem = {
      itemId = questItem.itemId;
      questId = questItem.questId;
    };
    return newQuestItem;
  };

  public func create(uuid : Text, questItem : Types.QuestItem, state : State.State) {
    state.questItems.put(uuid, getData(questItem));
  };

  public func update(itemId : Text, questItem : Types.QuestItem, state : State.State) {
    let updated = state.questItems.replace(itemId, getData(questItem));
  };
}
