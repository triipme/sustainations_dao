import Types "../types";
import State "../state";

module Event {
  public func getData(questId : Text, event : Types.EventUpdate) : Types.Event {
    let newEvent : Types.Event = {
      questId = questId;
      description = event.description;
      locationName = event.locationName;
      destinationName = event.destinationName;
    };
    return newEvent;
  };

  public func create(uuid : Text, questId : Text, event : Types.EventUpdate, state : State.State) {
    state.events.put(uuid, getData(questId, event));
  };

  public func update(uuid : Text, event : Types.Event, state : State.State) {
    let newEvent : Types.Event = {
      questId = event.questId;
      description = event.description;
      locationName = event.locationName;
      destinationName = event.destinationName;
    };
    let updated = state.events.replace(uuid, newEvent);
  };
}