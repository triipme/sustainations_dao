import Types "../types";
import State "../state";

module CharacterClass {
  public func getData(uuid : Text, characterClass : Types.CharacterClass) : Types.CharacterClass {
    let newCharacterClass : Types.CharacterClass = {
      uuid = ?uuid;
      name = characterClass.name;
      specialAbility = characterClass.specialAbility;
      description = characterClass.description;
      baseStrength = characterClass.baseStrength;
      baseIntelligence = characterClass.baseIntelligence;
      baseVitality = characterClass.baseVitality;
      baseLuck = characterClass.baseLuck;
      baseHP = characterClass.baseHP;
      baseMana = characterClass.baseMana;
      baseStamina = characterClass.baseStamina;
      baseMorale = characterClass.baseMorale;
    };
    return newCharacterClass;
  };

  public func create(uuid : Text, characterClass : Types.CharacterClass, state : State.State) {
    state.characterClasses.put(uuid, getData(uuid, characterClass));
  };

  public func update(uuid : Text, characterClass : Types.CharacterClass, state : State.State) {
    let updated = state.characterClasses.replace(uuid, getData(uuid, characterClass));
  };
}