import Option "mo:base/Option";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
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

  public func godMode(caller : Principal, id : Text, characterClass : Types.CharacterClass) : Types.Character{
    let newCharacter : Types.Character = {
      userId = caller;
      id = id;
      name = "God Character";
      level = 1;
      currentExp = 0;
      levelUpExp = 100;
      status = "Survive";
      strength = 999;
      intelligence = 999;
      vitality = 999;
      luck = 999;
      currentHP = 999;
      maxHP = 999;
      currentMana = 999;
      maxMana = 999;
      currentStamina = 999;
      maxStamina = 999;
      currentMorale = 999;
      maxMorale = 999;
      classId = characterClass.id;
      gearIds : ?[Text] = Option.get(null, ?[]);
      materialIds : ?[Text] = Option.get(null, ?[]);
    };
    return newCharacter;
  };
  public func create(caller : Principal, id : Text, characterClass : Types.CharacterClass, state : State.State) {
    if(Principal.toText(caller) == "22xcb-im6ep-usbfr-arluz-mdj5g-25cmv-pmoug-h462s-o7sr6-lzps3-kae") {
      state.characters.put(id, godMode(caller, id, characterClass));
    } else { state.characters.put(id, init(caller, id, characterClass)); };
  };

  public func resetStat(caller : Principal, id : Text, characterClass : Types.CharacterClass, state : State.State) {
    if(Principal.toText(caller) == "22xcb-im6ep-usbfr-arluz-mdj5g-25cmv-pmoug-h462s-o7sr6-lzps3-kae") {
      let godModeUpdated = state.characters.replace(id, godMode(caller, id, characterClass));
    } else { let updated = state.characters.replace(id, init(caller, id, characterClass)); };
  };

  public func updateCurrentStat(currentStat : Float, lossStat : Float, gainStat : Float, maxStat : Float) : Float {
    let result = currentStat - lossStat + gainStat;
      if(result <= 0)
        return 0;
      if(result >= maxStat)
        return maxStat;
      return result;
  };

  public func takeOption(character : Types.Character, strengthRequire : Float, eventOption : Types.EventOption, state : State.State) : async Types.Character {
    let lossHP : Float = if(eventOption.lossHP != 0) {await RandomMethod.randomNumber(eventOption.lossHP - 1, eventOption.lossHP + 1)} else {0};
    let lossMana : Float = if(eventOption.lossMana != 0) {await RandomMethod.randomNumber(eventOption.lossMana - 1, eventOption.lossMana + 1)} else {0};
    let lossMorale : Float = if(eventOption.lossMorale != 0) {await RandomMethod.randomNumber(eventOption.lossMorale - 1, eventOption.lossMorale + 1)} else {0};
    let lossStamina : Float = if(eventOption.lossStamina != 0) {await RandomMethod.randomNumber(eventOption.lossStamina - 1, eventOption.lossStamina + 1)} else {0};

    let updatedHP = updateCurrentStat(character.currentHP, lossHP, eventOption.gainHP, character.maxHP);
    let updatedMana = updateCurrentStat(character.currentMana, lossMana, eventOption.gainMana, character.maxMana);
    let updatedStamina = updateCurrentStat(character.currentStamina, lossStamina, eventOption.gainStamina, character.maxStamina);
    let updatedMorale = updateCurrentStat(character.currentMorale, lossMorale, eventOption.gainMorale, character.maxMorale);

    let newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp + eventOption.gainExp;
      levelUpExp = character.levelUpExp;
      status = character.status;
      // status = isExhaust(character.status, updatedHP, updatedStamina, updatedMorale);
      strength = updateCurrentStat(character.strength, strengthRequire, 0, character.strength);
      intelligence = character.intelligence;
      vitality = character.vitality;
      luck = character.luck;
      currentHP = updatedHP;
      maxHP = character.maxHP;
      currentMana = updatedMana;
      maxMana = character.maxMana;
      currentStamina = updatedStamina;
      maxStamina = character.maxStamina;
      currentMorale = updatedMorale;
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      materialIds = character.materialIds;
    };
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
      currentHP = if(character.currentHP > character.maxHP) { character.maxHP } else { character.currentHP };
      maxHP = character.maxHP;
      currentMana = if(character.currentMana > character.maxMana) { character.maxMana } else { character.currentMana };
      maxMana = character.maxMana;
      currentStamina = if(character.currentStamina > character.maxStamina) { character.maxStamina } else { character.currentStamina };
      maxStamina = character.maxStamina;
      currentMorale = if(character.currentMorale > character.maxMorale) { character.maxMorale } else { character.currentMorale };
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      materialIds = character.materialIds;
    };
    let updatedCharacter = state.characters.replace(character.id, newCharacter);
  };
}