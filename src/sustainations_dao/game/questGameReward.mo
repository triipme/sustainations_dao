import Option "mo:base/Option";

import Types "../types";
import State "../state";

module QuestGameReward{
  public func getData(questGameReward : Types.QuestGameReward) : Types.QuestGameReward {
    let newQuestGameReward : Types.QuestGameReward = {
        id = questGameReward.id;
        questId = questGameReward.questId;
        player = questGameReward.player;
        totalICP = questGameReward.totalICP;
    };
    return newQuestGameReward;
  };

  public func create(questGameReward : Types.QuestGameReward, state : State.State) {
    state.questGameRewards.put(questGameReward.id, getData(questGameReward));
  };

  public func update(questGameReward : Types.QuestGameReward, state : State.State) {
    let updated = state.questGameRewards.replace(questGameReward.id, getData(questGameReward));
  };
}