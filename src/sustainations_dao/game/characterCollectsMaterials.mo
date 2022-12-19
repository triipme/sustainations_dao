import Int "mo:base/Int";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import AsyncSource "mo:uuid/async/SourceV4";
import UUID "mo:uuid/UUID";

import Types "../types";
import State "../state";
import Material "./material";
import RandomMethod "../utils/random";

module CharacterCollectsMaterials {
  public func collectsMaterials(characterId : Text,eventOption : Types.EventOption, state: State.State) : async Types.CharacterCollectsMaterials {
    var ae = AsyncSource.Source();
    let id = await ae.new();
    let uuid : Text = UUID.toText(id);
    let rsCharacter = state.characters.get(characterId);
    
    let randomPercent = RandomMethod.randomPercent();
    var amount : Int = 0;
    var materialId : Text = "";

    // check to get the lost/gained material id
    if ( randomPercent > 0 and randomPercent <= eventOption.riskChance ) {
      if (Text.contains(eventOption.riskLost,#text "/") == true) {
        let materialList = Iter.toArray(Text.split(eventOption.riskLost,#text "/"));
        materialId := Material.getRandomMaterial(materialList,state);
        amount := -1;
      };
    }
    else if ( randomPercent > eventOption.riskChance and randomPercent <= (eventOption.riskChance + eventOption.luckyChance) ) {
      if (Text.contains(eventOption.gainByLuck,#text "/") == true) {
        materialId := Material.getRandomMaterial(Iter.toArray(Text.split(eventOption.gainByLuck,#text "/")),state);
        amount := +Float.toInt(RandomMethod.randomInRange(1,3));
      };
    };

    // check if there is already a same data in database, if yes => update, if no => create 
    for ((K,characterCollectMaterial) in state.characterCollectsMaterials.entries()) {
      if (characterCollectMaterial.characterId == characterId and characterCollectMaterial.materialId == materialId) {
        amount := characterCollectMaterial.amount + amount;
        let updatedcharacterCollectsMaterials : Types.CharacterCollectsMaterials = {
          id = characterCollectMaterial.id;
          characterId = characterId;
          materialId = materialId;
          amount = amount;
        };
        return updatedcharacterCollectsMaterials;
      };
    };

    let createdcharacterCollectsMaterials : Types.CharacterCollectsMaterials = {
      id = uuid;
      characterId = characterId;
      materialId = materialId;
      amount = amount;
    };
    return createdcharacterCollectsMaterials;

  };
  
  public func create(characterCollectMaterial : Types.CharacterCollectsMaterials, state : State.State) {
    state.characterCollectsMaterials.put(characterCollectMaterial.id, characterCollectMaterial);
  };

  public func update(characterCollectMaterial : Types.CharacterCollectsMaterials, state : State.State) {
    let updatedCharacterTakesOption = state.characterCollectsMaterials.replace(characterCollectMaterial.id, characterCollectMaterial);
  };
}