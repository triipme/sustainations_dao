import Option "mo:base/Option";

import Types "../types";
import State "../state";

module Choice {
  public func create(uuid : Text, choice : Types.Choice, state : State.State) {
    let newChoice : Types.Choice = {
      uuid = ?uuid;
      eventId = choice.eventId;
      description = choice.description;
      requireItem = Option.get(null, ?choice.requireItem);
      lossHP = Option.get(null, ?choice.lossHP);
      lossMana = Option.get(null, ?choice.lossMana);
      lossStamina = Option.get(null, ?choice.lossStamina);
      lossMorale = Option.get(null, ?choice.lossMorale);
      riskChance = Option.get(null, ?choice.riskChance);
      riskLost = Option.get(null, ?choice.riskLost);
      lossOther = Option.get(null, ?choice.lossOther);
      gainExp = Option.get(?choice.gainExp, 0);
      gainHP = Option.get(?choice.gainHP, 0.0);
      gainStamina = Option.get(?choice.gainStamina, 0.0);
      gainMorale = Option.get(?choice.gainMorale, 0.0);
      gainMana = Option.get(?choice.gainMana, 0.0);
      luckyChance = Option.get(?choice.luckyChance, 0.0);
      gainByLuck = Option.get(?choice.gainByLuck, 0.0);
      gainOther = Option.get(?choice.gainOther, 0.0);
    };
    let createdChoice = state.choices.put(uuid, newChoice);
  };

  public func update(uuid : Text, choice : Types.Choice, state : State.State) {
    let newChoice : Types.Choice = {
      uuid = ?uuid;
      eventId = choice.eventId;
      description = choice.description;
      requireItem = Option.get(?choice.requireItem, "");
      lossHP = Option.get(?choice.lossHP, 0.0);
      lossMana = Option.get(?choice.lossMana, 0.0);
      lossStamina = Option.get(?choice.lossStamina, 0.0);
      lossMorale = Option.get(?choice.lossMorale, 0.0);
      riskChance = Option.get(?choice.riskChance, 0.0);
      riskLost = Option.get(?choice.riskLost, "");
      lossOther = Option.get(?choice.lossOther, "");
      gainExp = Option.get(?choice.gainExp, 0);
      gainHP = Option.get(?choice.gainHP, 0.0);
      gainStamina = Option.get(?choice.gainStamina, 0.0);
      gainMorale = Option.get(?choice.gainMorale, 0.0);
      gainMana = Option.get(?choice.gainMana, 0.0);
      luckyChance = Option.get(?choice.luckyChance, 0.0);
      gainByLuck = Option.get(?choice.gainByLuck, 0.0);
      gainOther = Option.get(?choice.gainOther, 0.0);
    };
    let updatedChoice = state.choices.replace(uuid, newChoice);
  };
}