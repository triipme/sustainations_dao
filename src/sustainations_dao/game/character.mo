import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module Character {
  public func init(caller : Principal, id : Int, characterClass : Types.CharacterClass, characterName : Text) : Types.Character{
    let newCharacter : Types.Character = {
      userId = caller;
      id = id;
      name = characterName;
      level = 1;
      currentExp = 0;
      levelUpExp = 100;
      status = "Survive";
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
    return newCharacter;
  };
  public func create(caller : Principal, id : Int, characterClass : Types.CharacterClass, characterName : Text, state : State.State) {
    state.characters.put(id, init(caller, id, characterClass, characterName));
  };

  public func resetStat(caller : Principal, id : Int, characterClass : Types.CharacterClass, characterName : Text, state : State.State) {
    let updated = state.characters.replace(id, init(caller, id, characterClass, characterName));
  };

  public func updateCurrentStat(currentStat : Float, lossStat : Float, gainStat : Float) : Float {
    let result = currentStat - lossStat + gainStat;
    return if((result) <= 0) {0} else {result}; 
  };

  public func takeOption(character : Types.Character, strengthRequire : Float, eventOption : Types.EventOption, state : State.State) {
    var newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp + eventOption.gainExp;
      levelUpExp = character.levelUpExp;
      status = character.status;
      strength = updateCurrentStat(character.strength, strengthRequire, 0);
      intelligence = character.intelligence;
      vitality = character.vitality;
      luck = character.luck;
      currentHP = updateCurrentStat(character.currentHP, eventOption.lossHP, eventOption.gainHP);
      maxHP = character.maxHP;
      currentMana = updateCurrentStat(character.currentMana, eventOption.lossMana, eventOption.gainMana);
      maxMana = character.maxMana;
      currentStamina = updateCurrentStat(character.currentStamina, eventOption.lossStamina, eventOption.gainStamina);
      maxStamina = character.maxStamina;
      currentMorale = updateCurrentStat(character.currentMorale, eventOption.lossMorale, eventOption.gainMorale);
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      materialIds = character.materialIds;
    };
    let updatedCharacter = state.characters.replace(character.id, newCharacter);
  };

  public func updateStatus(character : Types.Character, status : Text, state : State.State) {
    var newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp;
      levelUpExp = character.levelUpExp;
      status = status;
      strength = character.strength;
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
    let updatedCharacter = state.characters.replace(character.id, newCharacter);
  };
}