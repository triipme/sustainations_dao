import Types "../types";
import State "../state";

module Event {
  public func getData(event : Types.Event) : Types.Event {
    let newEvent : Types.Event = {
      id = event.id;
      questId = event.questId;
      description = event.description;
      locationName = event.locationName;
      destinationName = event.destinationName;
    };
    return newEvent;
  };

  public func create(event : Types.Event, state : State.State) {
    state.events.put(event.id, getData(event));
  };

  public func update(event : Types.Event, state : State.State) {
    let updated = state.events.replace(event.id, getData(event));
  };
}