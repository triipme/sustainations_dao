import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";

module {
  public type Currency = {
    name : Text;
    code : Text;
    symbol : Text;
    exchangeRate : Float; // exchange rate of ICP to this currency
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
    username : Text;
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
    currency : Text; // currency code
    unit : Text;
  };

  public type Station = {
    brandId : Text;
    uid : ?Text;
    name : Text;
    phone : Text;
    address : Text;
    latitude : ?Float;
    longitude : ?Float;
    activate : Bool;
  };

  public type Order = {
    brandId : Text;
    stationId : Text;
    products : [OrderProduct];
    totalAmount : Float;
    note : ?Text;
    history : [OrderStatusHistory];
  };

  public type OrderProduct = {
    productId : Text;
    price : Float;
    currency : Text; // currency code
    quantity : Float;
  };

  public type OrderStatus = {
    #canceled;
    #new;
    #pending;
    #delivering;
    #delivered;
    #rejected;
  };

  public type OrderStatusHistory = {
    status : OrderStatus;
    timestamp : Time.Time;
  };
};