import Option "mo:base/Option";

import Types "../types";
import State "../state";

module EventOption {
  public func create(uuid : Text, eventOption : Types.EventOption, state : State.State) {
    let newEventOption : Types.EventOption = {
      uuid = ?uuid;
      eventId = eventOption.eventId;
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
    let createdEventOption = state.eventOptions.put(uuid, newEventOption);
  };

  public func update(uuid : Text, eventOption : Types.EventOption, state : State.State) {
    let newEventOption : Types.EventOption = {
      uuid = ?uuid;
      eventId = eventOption.eventId;
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
    let updatedEventOption = state.eventOptions.replace(uuid, newEventOption);
  };
}