import Option "mo:base/Option";

import Types "../types";
import State "../state";

module EventOption {
  public func getData(eventOption : Types.EventOption) : Types.EventOption {
    let newEventOption : Types.EventOption = {
      id = eventOption.id;
      eventId = eventOption.eventId;
      description = eventOption.description;
      requireItemId = eventOption.requireItemId;
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
  public func create(eventOption : Types.EventOption, state : State.State) {
    state.eventOptions.put(eventOption.id, getData(eventOption));
  };

  public func update(eventOption : Types.EventOption, state : State.State) {
    let updated = state.eventOptions.replace(eventOption.id, getData(eventOption));
  };
}