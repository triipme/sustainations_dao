import Types "../types";
import State "../state";

module Material {
  public func create(uuid : Text, material : Types.Material, state : State.State) {
    let newMaterial : Types.Material = {
      uuid = ?uuid;
      name = material.name;
      description = material.description;
    };
    let createdMaterial = state.materials.put(uuid, newMaterial);
  };

  public func update(uuid : Text, material : Types.Material, state : State.State) {
    let newMaterial : Types.Material = {
      uuid = ?uuid;
      name = material.name;
      description = material.description;
    };
    let updatedMaterial = state.materials.replace(uuid, newMaterial);
  };
}