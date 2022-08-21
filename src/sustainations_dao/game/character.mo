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
      temporaryExp = 0;
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
      inventorySize = 10;
      exhaustedTime = 0;
    };
    return newCharacter;
  };

  public func godMode(caller : Principal, characterId : Text, characterClassId : Text) : Types.Character{
    let newCharacter : Types.Character = {
      userId = caller;
      id = characterId;
      name = "God Character";
      level = 1;
      currentExp = 0;
      temporaryExp = 0;
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
      classId = characterClassId;
      gearIds : ?[Text] = Option.get(null, ?[]);
      inventorySize = 10;
      exhaustedTime = 0;
    };
    return newCharacter;
  };
  public func create(caller : Principal, id : Text, characterClass : Types.CharacterClass, state : State.State) {
    if(Principal.toText(caller) == "gx3fa-rkdjs-vrshs-qqjts-aaklc-z7jvl-pc2zb-3zu6m-4hixl-5wswb-gqe") {
      state.characters.put(id, godMode(caller, id, characterClass.id));
    } else { state.characters.put(id, init(caller, id, characterClass)); };
  };

  public func resetStat(caller : Principal, id : Text, characterClass : Types.CharacterClass, state : State.State) {
    if(Principal.toText(caller) == "gx3fa-rkdjs-vrshs-qqjts-aaklc-z7jvl-pc2zb-3zu6m-4hixl-5wswb-gqe") {
      let godModeUpdated = state.characters.replace(id, godMode(caller, id, characterClass.id));
    } else { let updated = state.characters.replace(id, init(caller, id, characterClass)); };
  };

  public func limitStat(currentStat : Float, maxStat : Float) : Float {
    if(currentStat <= 0) { return 0; };
    if(currentStat > maxStat) 
      { maxStat } 
    else { currentStat };
  };

  public func updateCurrentStat(currentStat : Float, lossStat : Float, gainStat : Float, maxStat : Float) : async Float {
    var lossRandomStat = lossStat;
    if(lossStat != 0) {
      lossRandomStat := await RandomMethod.randomNumber(lossStat - 1, lossStat + 1);
    } else { lossRandomStat := 0 };
    let result = currentStat - lossRandomStat + gainStat;
    return limitStat(result, maxStat);
  };

  public func takeOption(character : Types.Character, strengthRequire : Float, eventOption : Types.EventOption, state : State.State) : async Types.Character {
    let updatedHP = await updateCurrentStat(character.currentHP, eventOption.lossHP, eventOption.gainHP, character.maxHP);
    let updatedMana = await updateCurrentStat(character.currentMana, eventOption.lossMana, eventOption.gainMana, character.maxMana);
    let updatedStamina = await updateCurrentStat(character.currentStamina, eventOption.lossStamina, eventOption.gainStamina, character.maxStamina);
    let updatedMorale = await updateCurrentStat(character.currentMorale, eventOption.lossMorale, eventOption.gainMorale, character.maxMorale);

    let newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      temporaryExp = character.temporaryExp + eventOption.gainExp;
      currentExp = character.currentExp;
      levelUpExp = character.levelUpExp;
      status = character.status;
      strength = await updateCurrentStat(character.strength, strengthRequire, 0, character.strength);
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
      inventorySize = character.inventorySize;
      exhaustedTime = character.exhaustedTime;
    };
    return newCharacter;
  };

  public func isExhaust(status : Text, hp : Float, stamina : Float, morale : Float) : Text {
    var result = status;
    if(hp == 0 or stamina == 0 or morale == 0){
      result := "Exhausted";
    };
    return result; 
  };

  public func getRemainingTime(waitingTime : Int, character : Types.Character) : Int {
    let currentTime = Time.now()/1000000000;
    if (currentTime - character.exhaustedTime >= waitingTime ){
      return 0;
    } else {
      return waitingTime - (currentTime - character.exhaustedTime);
    };
  };

  public func update(character : Types.Character, state : State.State) {
    var newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp;
      temporaryExp = character.temporaryExp;
      levelUpExp = character.levelUpExp;
      status = isExhaust(character.status, character.currentHP, character.currentStamina, character.currentMorale);
      strength = character.strength;
      intelligence = character.intelligence;
      vitality = character.vitality;
      luck = character.luck;
      currentHP = limitStat(character.currentHP, character.maxHP);
      maxHP = character.maxHP;
      currentMana = limitStat(character.currentMana, character.maxMana);
      maxMana = character.maxMana;
      currentStamina = limitStat(character.currentStamina, character.maxStamina);
      maxStamina = character.maxStamina;
      currentMorale = limitStat(character.currentMorale, character.maxMorale);
      maxMorale = character.maxMorale;
      classId = character.classId;
      gearIds = character.gearIds;
      inventorySize = character.inventorySize;
      exhaustedTime = if (isExhaust(character.status, character.currentHP, character.currentStamina, character.currentMorale) == "Exhausted") 
                      { Time.now()/1000000000 } else { character.exhaustedTime };
    };
    let updatedCharacter = state.characters.replace(character.id, newCharacter);
  };

  public func gainCharacterExp(character : Types.Character, state : State.State) {
    var newCharacter : Types.Character = {
      userId = character.userId;
      id = character.id;
      name = character.name;
      level = character.level;
      currentExp = character.currentExp + character.temporaryExp;
      temporaryExp = 0;
      levelUpExp = character.levelUpExp;
      status = character.status;
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
      inventorySize = character.inventorySize;
      exhaustedTime = character.exhaustedTime;
    };
    let updateCharacter = state.characters.replace(character.id, newCharacter);
  };
}