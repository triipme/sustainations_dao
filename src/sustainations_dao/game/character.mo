import Option "mo:base/Option";
import Time "mo:base/Time";
import RandomMethod "../utils/random";

import Types "../types";
import State "../state";

module Character {
  public func init(caller : Principal, id : Text, characterClass : Types.CharacterClass) : Types.Character{
    let newCharacter : Types.Character = {
      userId = caller;
      id = id;
      name = "Default Character";
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
  public func create(caller : Principal, id : Text, characterClass : Types.CharacterClass, state : State.State) {
    state.characters.put(id, init(caller, id, characterClass));
  };

  public func resetStat(caller : Principal, id : Text, characterClass : Types.CharacterClass, state : State.State) {
    let updated = state.characters.replace(id, init(caller, id, characterClass));
  };

  public func updateCurrentStat(currentStat : Float, lossStat : Float, gainStat : Float) : Float {
    let result = currentStat - lossStat + gainStat;
    return if((result) <= 0) {0} else {result}; 
  };

  public func takeOption(character : Types.Character, strengthRequire : Float, eventOption : Types.EventOption, state : State.State) : async Types.Character {
    let lossHP : Float = if(eventOption.lossHP != 0) {await RandomMethod.random(eventOption.lossHP - 1, eventOption.lossHP + 1)} else {0};
    let lossMana : Float = if(eventOption.lossMana != 0) {await RandomMethod.random(eventOption.lossMana - 1, eventOption.lossMana + 1)} else {0};
    let lossMorale : Float = if(eventOption.lossMorale != 0) {await RandomMethod.random(eventOption.lossMorale - 1, eventOption.lossMorale + 1)} else {0};
    let lossStamina : Float = if(eventOption.lossStamina != 0) {await RandomMethod.random(eventOption.lossStamina - 1, eventOption.lossStamina + 1)} else {0};
    let newCharacter : Types.Character = {
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
      currentHP = updateCurrentStat(character.currentHP, lossHP, eventOption.gainHP);
      maxHP = character.maxHP;
      currentMana = updateCurrentStat(character.currentMana, lossMana, eventOption.gainMana);
      maxMana = character.maxMana;
      currentStamina = updateCurrentStat(character.currentStamina, lossStamina, eventOption.gainStamina);
      maxStamina = character.maxStamina;
      currentMorale = updateCurrentStat(character.currentMorale, lossMorale, eventOption.gainMorale);
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      materialIds = character.materialIds;
    };
    // let updatedCharacter = state.characters.replace(character.id, newCharacter);
    return newCharacter;
  };

  public func isExhaust(status : Text ,hp : Float, stamina : Float, morale : Float) : Text {
    var result = status;
    if(hp == 0 or stamina == 0 or morale == 0){
      result := "Exhausted";
    };
    return result; 
  };

  public func update(character : Types.Character, state : State.State) {
    var newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp;
      levelUpExp = character.levelUpExp;
      status = isExhaust(character.status, character.currentHP, character.currentStamina, character.currentMorale);
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