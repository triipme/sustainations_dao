import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Character {
  public func create(uuid : Text, characterClass : Types.CharacterClass, characterName : Text, state : State.State) {
    let newCharacter : Types.Character = {
      uuid = ?uuid;
      name = characterName;
      level = 1;
      currentExp = 0;
      levelUpExp = 100;
      status : ?Text = Option.get(null, ?"");
      strength = 6;
      intelligent = 0;
      vitality = 0;
      luck = 0;
      currentHp = characterClass.baseHp;
      maxHp = characterClass.baseHp;
      currentMana = characterClass.baseMana;
      maxMana = characterClass.baseMana;
      currentStamina = characterClass.baseStamina;
      maxStamina = characterClass.baseStamina;
      currentMorale = characterClass.baseMorale;
      maxMorale = characterClass.baseMorale;
      classId = characterClass.uuid;
      gearIds : ?[Text] = Option.get(null, ?[]);
      materialIds : ?[Text] = Option.get(null, ?[]);
    };
    let createdCharacter = state.characters.put(uuid, newCharacter);
  };

  public func update(characterId : Text, character : Types.Character, state : State.State) {
   let newCharacter : Types.Character = {
      uuid = ?characterId;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp;
      levelUpExp = character.levelUpExp;
      status = character.status;
      strength = character.strength;
      intelligent = character.intelligent;
      vitality = character.vitality;
      luck = character.luck;
      currentHp = character.currentHp;
      maxHp = character.maxHp;
      currentMana = character.currentMana;
      maxMana = character.maxMana;
      currentStamina = character.currentStamina;
      maxStamina = character.maxStamina;
      currentMorale = character.currentMorale;
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      materialIds = character.materialIds;
    };
    let updatedCharacter = state.characters.replace(characterId, newCharacter);
  };
}

