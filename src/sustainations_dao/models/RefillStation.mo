import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";

module {
  public type Currency = {
    name : Text;
    code : Text;
    symbol : Text;
    exchangeRate : Nat64; // exchange rate of ICP to this currency
  };

  public type Brand = {
    name : Text;
    phone : ?Text;
    email : ?Text;
    address : ?Text;
    story : ?Text;
  };

  public type ManagerRole = {
    #owner;
    #staff;
  };

  public type Manager = {
    brandId : Text;
    role : ManagerRole;
  };

  public type Category = {
    brandId : Text;
    name : Text;
  };

  public type Tag = {
    brandId : Text;
    name : Text;
  };

  public type ProductUnit = {
    brandId : Text;
    name : Text;
  };

  public type Product = {
    brandId : Text;
    name : Text;
    description : ?Text;
    categories : [Text];
    tags : ?[Text];
    sku : Text;
    images : ?[Text];
    price : Float;
    salePrice : ?Float;
    currency : Currency;
    unit : Text;
  };

  public type Station = {
    brandId : Text;
    uid : ?Text;
    name : Text;
    phone : Text;
    address : Text;
    latitude : Float;
    longitude : Float;
    activate : Bool;
  };

  public type Order = {
    brandId : Text;
    station : Station;
    products : List.List<OrderProduct>;
    history : [OrderStatusHistory];
  };

  public type OrderProduct = {
    productId : Text;
    price : Float;
    currency : Currency;
    quantity : Nat;
  };

  public type OrderStatus = {
    brandId : Text;
    name : Text;
  };

  public type OrderStatusHistory = {
    status : Text;
    timestamp : Time.Time;
  };
};