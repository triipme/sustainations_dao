module {
  public type Game = {
    slug : Text;  //unique
    name : Text;
    image : Text;
    description : Text;
    status : Bool;
  };
  public type Stage = {
    gameId : Text;
    name : Text;
    order : Nat;
  };
  public type Card = {
    stageId : Text;
    cardType : Text; //"text" or "image"
    data : Text;
  };
  public type Player = {
    aId : Text;
    gameId : Text;
    gameSlug : Text;
    history : [GameProgress];
    createdAt : Int;
    updatedAt : Int;
  };

  public type GameProgress = {
    stageId : Text;
    selected : [?(Text, Text, Float)]; //cardId1, cardId2, time_select
    turn : Nat; // default 0
    timing : Float; // default 0
  };
  
  public type Reward = {
    reward : Nat64;
    playerId : Text;
    createdAt : Int;
  };
}