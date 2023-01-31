import Option "mo:base/Option";

import Types "../types";
import State "../state";

module QuestGame{
  public func getData(questGame : Types.QuestGame) : Types.QuestGame {
    let newQuestGame : Types.QuestGame = {
        id = questGame.id;
        questId = questGame.questId;
        characterId = questGame.characterId;
        timestamp = questGame.timestamp;
        hp = questGame.hp;
        stamina = questGame.stamina;
        morale = questGame.morale;
        mana = questGame.mana;
    };
    return newQuestGame;
  };

  public func create(questGame : Types.QuestGame, state : State.State) {
    state.questGames.put(questGame.id, getData(questGame));
  };

  public func update(questGame : Types.QuestGame, state : State.State) {
    let updated = state.questGames.replace(questGame.id, getData(questGame));
  };
}