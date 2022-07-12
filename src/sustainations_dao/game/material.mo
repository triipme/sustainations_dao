import Types "../types";
import State "../state";

module Material {
  public func getData(material : Types.Material) : Types.Material {
    let newMaterial : Types.Material = {
      name = material.name;
      description = material.description;
    };
    return newMaterial;
  };

  public func create(uuid : Text, material : Types.Material, state : State.State) {
    state.materials.put(uuid, getData(material));
  };

  public func update(uuid : Text, material : Types.Material, state : State.State) {
    let updated = state.materials.replace(uuid, getData(material));
  };
}