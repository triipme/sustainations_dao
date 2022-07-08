import Types "../types";
import State "../state";

module CharacterClass {
  public func create(uuid : Text, characterClass : Types.CharacterClass, state : State.State) {
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
    let createdCharacterClass = state.characterClasses.put(uuid, newCharacterClass);
  };

  public func update(uuid : Text, characterClass : Types.CharacterClass, state : State.State) {
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
    let updatedCharacterClass = state.characterClasses.replace(uuid, newCharacterClass);
  };
}

