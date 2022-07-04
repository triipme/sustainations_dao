import Types "../types";
import State "../state";

module Event {
  public func create(uuid : Text, event : Types.Event, state : State.State) {
    let newEvent : Types.Event = {
      uuid = ?uuid;
      questId = event.questId;
      description = event.description;
      locationName = event.locationName;
      destinationName = event.destinationName;
    };
    let createdEvent = state.events.put(uuid, newEvent);
  };

  public func update(uuid : Text, event : Types.Event, state : State.State) {
    let newEvent : Types.Event = {
      uuid = ?uuid;
      questId = event.questId;
      description = event.description;
      locationName = event.locationName;
      destinationName = event.destinationName;
    };
    let updatedEvent = state.events.replace(uuid, newEvent);
  };
}