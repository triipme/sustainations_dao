import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module Character {
  public func getData(character : Types.Character, eventOptionId : Int) : Types.CharacterTakeOption {
    let newCharacterTakeOption : Types.CharacterTakeOption = {
      characterId = character.id;
      eventOptionId = eventOptionId;
      pickUpTime = Time.now();
      currentHP = character.currentHP;
      maxHP = character.maxHP;
      currentMana = character.currentMana;
      maxMana = character.maxMana;
      currentStamina = character.currentStamina;
      maxStamina = character.maxStamina;
      currentMorale = character.currentMorale;
      maxMorale = character.maxMorale;
    };
    return newCharacterTakeOption;
  };

  public func create(id : Int, character : Types.Character, eventOptionId : Int, state : State.State) {
    state.characterTakeOptions.put(id, getData(character, eventOptionId));
  };

  public func update(id : Int, character : Types.Character, eventOptionId : Int, state : State.State) {
    let updatedCharacterTakeOption = state.characterTakeOptions.replace(id, getData(character, eventOptionId));
  };
}