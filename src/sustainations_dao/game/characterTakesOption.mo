import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module Character {
  public func getData(character : Types.Character, eventOptionId : Text) : Types.CharacterTakesOption {
    let newCharacterTakeOption : Types.CharacterTakesOption = {
      characterId = character.id;
      eventOptionId = eventOptionId;
      takeable = true;
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

  public func create(id : Text, character : Types.Character, eventOptionId : Text, state : State.State) {
    state.characterTakesOptions.put(id, getData(character, eventOptionId));
  };

  public func update(id : Text, character : Types.Character, eventOptionId : Text, state : State.State) {
    let updatedCharacterTakesOption = state.characterTakesOptions.replace(id, getData(character, eventOptionId));
  };
}