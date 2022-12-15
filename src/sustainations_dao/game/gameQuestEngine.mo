import Types "../types";
import State "../state";

module GameQuestEngine {
  public func getData(gameQuestEngine : Types.GameQuestEngine) : Types.GameQuestEngine {
    let gameQuest : Types.GameQuestEngine = {
        userId = gameQuestEngine.userId;
        listScene = gameQuestEngine.listScene;
        listEvent = gameQuestEngine.listEvent;
        score = gameQuestEngine.score;
    };
    return gameQuest;
  };

  public func create(gameQuest : Types.GameQuestEngine, state : State.State) {
    state.gameQuestEngines.put(gameQuest.userId, getData(gameQuest));
  };

  public func update(gameQuest : Types.GameQuestEngine, state : State.State) {
    let updated = state.gameQuestEngines.replace(gameQuest.userId, getData(gameQuest));
  };
}