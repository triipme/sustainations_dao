import Time "mo:base/Time";
import Int "mo:base/Int";
import Int32 "mo:base/Int32";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

import Date "Date"

module Moment {
  public func beginningOfMonth() : Int {
    let currentDay = Date.unpack(Date.now());
    Date.dateToEpoch(currentDay.year, currentDay.month, #Day 1);
  };
  public func beginningOfDay() : Int {
    Time.now() / (864 * (10 ** 11)) * (864 * (10 ** 11));
  };
  public func endOfDay() : Int {
    beginningOfDay() + (864 * (10 ** 11))
  };
  public func beginningOfYesterday() : Int {
    beginningOfDay() - (864 * (10 ** 11))
  };
  public func now() : Int {
    Time.now()
  };
  public func yesterday(current : Int) : Bool {
    Int.less(beginningOfYesterday(), current) and Int.less(current, beginningOfDay())
  };
  public func diff(day : ?Int) : Int {
    Option.get(day, Time.now()) - beginningOfDay();
  };
}