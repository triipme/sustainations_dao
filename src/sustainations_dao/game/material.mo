import Types "../types";
import State "../state";

module Material {
  public func getData(material : Types.Material) : Types.Material {
    let newMaterial : Types.Material = {
      id = material.id;
      name = material.name;
      description = material.description;
    };
    return newMaterial;
  };

  public func create(material : Types.Material, state : State.State) {
    state.materials.put(material.id, getData(material));
  };

  public func update(material : Types.Material, state : State.State) {
    let updated = state.materials.replace(material.id, getData(material));
  };
}