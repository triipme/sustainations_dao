import Option "mo:base/Option";
import Time "mo:base/Time";

import Types "../types";
import State "../state";

module Scene {
  
  public func getData(scene : Types.Scene) : Types.Scene {
    let newScene : Types.Scene = {
      id = scene.id;
      idQuest = scene.idQuest;
      idEvent = scene.idEvent;
      front = scene.front;
      mid = scene.mid;
      back = scene.back;
      obstacle = scene.obstacle;
    };
    return newScene;
  };

  public func create(scene : Types.Scene, state : State.State) {
    state.questEngine.scenes.put(scene.id, getData(scene));
  };

  public func update(scene : Types.Scene, state : State.State) {
    let updated = state.questEngine.scenes.replace(scene.id, getData(scene));
  };
};
