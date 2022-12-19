import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "../types";
import State "../state";

module LandConfig {
  public func getData(landConfig : Types.LandConfig) : Types.LandConfig {
    let newLandConfig : Types.LandConfig = {
      id = landConfig.id;
      mapWidth = landConfig.mapWidth;
      mapHeight = landConfig.mapHeight;
    };
    return newLandConfig;
  };

  public func create(landConfig : Types.LandConfig, state : State.State) {
    state.landConfigs.put(landConfig.id, getData(landConfig));
  };

  public func update(landConfig : Types.LandConfig, state : State.State) {
    let updated = state.landConfigs.replace(landConfig.id, getData(landConfig));
  };  
}