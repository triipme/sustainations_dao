import Option "mo:base/Option";
import Time "mo:base/Time";

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
      strength = characterClass.baseStrength;
      intelligence = characterClass.baseIntelligence;
      vitality = characterClass.baseVitality;
      luck = characterClass.baseLuck;
      currentHP = characterClass.baseHP;
      maxHP = characterClass.baseHP;
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
    let newCharacterTakeOption : Types.CharacterTakeOption = {
      characterId = uuid;
      optionId : ?Text = Option.get(null, ?"");
      pickUpTime = Time.now();
      currentHP = newCharacter.currentHP;
      maxHP = newCharacter.maxHP;
      currentMana = newCharacter.currentMana;
      maxMana = newCharacter.maxMana;
      currentStamina = newCharacter.currentStamina;
      maxStamina = newCharacter.maxStamina;
      currentMorale = newCharacter.currentMorale;
      maxMorale = newCharacter.maxMorale;
    };
    let createdCharacterTakeOption = state.characterTakeOptions.put(uuid, newCharacterTakeOption);
  };

  public func update(characterId : Text, character : Types.Character, eventOption : Types.EventOption, totalStrength : Int, state : State.State) {
    let newCharacter : Types.Character = {
      uuid = ?characterId;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp + eventOption.gainExp;
      levelUpExp = character.levelUpExp;
      status = character.status;
      strength = character.strength - totalStrength;
      intelligence = character.intelligence;
      vitality = character.vitality;
      luck = character.luck;
      currentHP = character.currentHP;
      maxHP = character.maxHP;
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
    let newCharacterTakeOption : Types.CharacterTakeOption = {
      characterId = characterId;
      optionId = eventOption.uuid;
      pickUpTime = Time.now();
      currentHP = newCharacter.currentHP;
      maxHP = newCharacter.maxHP;
      currentMana = newCharacter.currentMana;
      maxMana = newCharacter.maxMana;
      currentStamina = newCharacter.currentStamina;
      maxStamina = newCharacter.maxStamina;
      currentMorale = newCharacter.currentMorale;
      maxMorale = newCharacter.maxMorale;
    };
    let updatedCharacterTakeOption = state.characterTakeOptions.replace(characterId, newCharacterTakeOption);
  };
}
