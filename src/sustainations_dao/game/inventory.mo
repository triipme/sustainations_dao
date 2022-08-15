import AsyncSource "mo:uuid/async/SourceV4";
import UUID "mo:uuid/UUID";
import Int "mo:base/Int";

import State "../state";
import Types "../types";

module Inventory {
  public func storeMaterials(characterCollectMaterial: Types.CharacterCollectsMaterials, state: State.State) : async Types.Inventory {
    var ae = AsyncSource.Source();
    let id = await ae.new();
    let uuid : Text = UUID.toText(id);

    // check if there is already a same data in database, if yes => update, if no => create 
    for ((K,inventory) in state.inventories.entries()) {
      if (characterCollectMaterial.characterId == inventory.characterId and characterCollectMaterial.materialId == inventory.materialId) {
        let updatedInventory : Types.Inventory = {
          id = inventory.id;
          characterId = inventory.characterId;
          materialId = inventory.materialId;
          amount = Int.max(0,inventory.amount + characterCollectMaterial.amount);
        };
        return updatedInventory;
      };
    };

    let createdInventory : Types.Inventory = {
      id = uuid;
      characterId = characterCollectMaterial.characterId;
      materialId = characterCollectMaterial.materialId;
      amount = Int.max(characterCollectMaterial.amount,0);
    };
    return createdInventory;
  };
  
  public func create(inventory : Types.Inventory, state : State.State) {
    state.inventories.put(inventory.id, inventory);
  };

  public func update(inventory : Types.Inventory, state : State.State) {
    let updatedInventory = state.inventories.replace(inventory.id, inventory);
  };
}