import Float "mo:base/Float";
import Int "mo:base/Int";

import Types "../types";
import State "../state";
import RandomMethod "../utils/random";

module Material {
  public func getData(material : Types.Material) : Types.Material {
    let newMaterial : Types.Material = {
      id = material.id;
      name = material.name;
      description = material.description;
    };
    return newMaterial;
  };

  public func getRandomMaterial(materialList: [Text], state: State.State): Text {
    let randomIndex : Int = Float.toInt(RandomMethod.randomInRange(0,Float.fromInt(materialList.size()-1)));
    for((K,material) in state.materials.entries())
    {
      if (material.name == materialList[Int.abs(randomIndex)])
      {
        return material.id;
      };
    };
    return "";
  };

  public func create(material : Types.Material, state : State.State) {
    state.materials.put(material.id, getData(material));
  };

  public func update(material : Types.Material, state : State.State) {
    let updated = state.materials.replace(material.id, getData(material));
  };
}