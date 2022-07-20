import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module Character {
  public func getData(uuid : Text, character : Types.Character, eventOptionUuid : Text) : Types.CharacterTakeOption {
    let newCharacterTakeOption : Types.CharacterTakeOption = {
      characterId = uuid;
      eventOptionUuid = eventOptionUuid;
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

  public func create(caller : Principal, uuid : Text, characterClass : Types.CharacterClass, characterName : Text, state : State.State) {
    let newCharacter : Types.Character = {
      userId = caller;
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
      classId = characterClass.id;
      gearIds : ?[Text] = Option.get(null, ?[]);
      materialIds : ?[Text] = Option.get(null, ?[]);
    };
    let createdCharacter = state.characters.put(uuid, newCharacter);
    let createdCharacterTakeOption = state.characterTakeOptions.put(uuid, getData(uuid, newCharacter, ""));
  };

  public func update(uuid : Text, character : Types.Character, strengthRequire : Float, eventOption : Types.EventOption, state : State.State) {
    let newCharacter : Types.Character = {
      userId = character.userId;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp + eventOption.gainExp;
      levelUpExp = character.levelUpExp;
      status = character.status;
      strength = character.strength - strengthRequire;
      intelligence = character.intelligence;
      vitality = character.vitality;
      luck = character.luck;
      currentHP = character.currentHP - eventOption.lossHP + eventOption.gainHP;
      maxHP = character.maxHP;
      currentMana = character.currentMana - eventOption.lossMana + eventOption.gainMana;
      maxMana = character.maxMana;
      currentStamina = character.currentStamina - eventOption.lossStamina + eventOption.gainStamina;
      maxStamina = character.maxStamina;
      currentMorale = character.currentMorale - eventOption.lossMorale + eventOption.gainMorale;
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      materialIds = character.materialIds;
    };
    let updatedCharacter = state.characters.replace(uuid, newCharacter);
    for((K, V) in state.eventOptions.entries()){
      if(V == eventOption){
        let updatedCharacterTakeOption = state.characterTakeOptions.replace(uuid, getData(uuid, newCharacter, K));
      };
    };
  };
}