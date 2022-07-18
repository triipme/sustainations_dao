import Option "mo:base/Option";

import Types "../types";
import State "../state";

module EventOption {
  public func getData(uuid : Text, eventId : Text, eventOption : Types.EventOption) : Types.EventOption {
    let newEventOption : Types.EventOption = {
      uuid = ?uuid;
      eventId = eventId;
      description = eventOption.description;
      requireItemIds = eventOption.requireItemIds;
      lossHP = eventOption.lossHP;
      lossMana = eventOption.lossMana;
      lossStamina = eventOption.lossStamina;
      lossMorale = eventOption.lossMorale;
      riskChance = eventOption.riskChance;
      riskLost = eventOption.riskLost;
      lossOther = eventOption.lossOther;
      gainExp = eventOption.gainExp;
      gainHP = eventOption.gainHP;
      gainStamina = eventOption.gainStamina;
      gainMorale = eventOption.gainMorale;
      gainMana = eventOption.gainMana;
      luckyChance = eventOption.luckyChance;
      gainByLuck = eventOption.gainByLuck;
      gainOther = eventOption.gainOther;
    };
    return newEventOption;
  };
  public func create(uuid : Text, eventId : Text, eventOption : Types.EventOption, state : State.State) {
    state.eventOptions.put(uuid, getData(uuid, eventId, eventOption));
  };

  public func update(uuid : Text, eventId : Text, eventOption : Types.EventOption, state : State.State) {
    let updated = state.eventOptions.replace(uuid, getData(uuid, eventId, eventOption));
  };
}