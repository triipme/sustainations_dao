module {
  public type Slug = {
    game : Text;
    slug : Text; //unique
    description : Text;
    status : Bool;
  };
  public type Stage = {
    slugId : Text;
    name : Text;
    order : Nat;
  };
  public type Card = {
    stageId : Text;
    cardType : Text; //"text" or "image"
    data : Text;
  };
  public type Player = {
    uid : Principal;
    slugId : Text;
    history : [
      {
        stageId : Text;
        turn : Nat;
        timing : Float;
      }
    ];
    createdAt : Int;
    updatedAt : Int;
  };
  public type Reward = {
    reward : Nat64;
    playerId : Text;
    createdAt : Int;
  };
}