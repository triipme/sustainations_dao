import Option "mo:base/Option";

import Types "../types";
import State "../state";

module QuestItemForQuest {
  public func create(uuid : Text, questItemForQuest : Types.QuestItemForQuest, state : State.State) {
    let newQuestItemForQuest : Types.QuestItemForQuest = {
      uuid = ?uuid;
      questItemId = questItemForQuest.questItemId;
      questId = questItemForQuest.questId;
    };
    let createdQuestItemForQuest = state.questItemForQuests.put(uuid, newQuestItemForQuest);
  };

  public func update(questItemForQuestId : Text, questItemForQuest : Types.QuestItemForQuest, state : State.State) {
   let newQuestItemForQuest : Types.QuestItemForQuest = {
      uuid = ?questItemForQuestId;
      questItemId = questItemForQuest.questItemId;
      questId = questItemForQuest.questId;
    };
    let updatedQuestItemForQuest = state.questItemForQuests.replace(questItemForQuestId, newQuestItemForQuest);
  };
}
