import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import RS "models/RefillStation";

import MemoryCardEngineModel "models/MemoryCardEngine";

module {
  // User Profile
  public type Role = {
    #user;
    #admin;
  };
  public type Profile = {
    username : ?Text;
    avatar : ?Text;
    phone : ?Text;
    role : Role;
  };
  // User Agreement
  public type UserAgreement = {
    timestamp : Time.Time;
  };
  // Proposal
  public type Proposal = {
    uuid : Text;
    status : ProposalState;
    timestamp : Time.Time;
    proposer : Principal;
    voters : List.List<Voter>;
    votesYes : Nat64;
    payload : ProposalPayload;
    proposalType : ?ProposalType;
  };
  public type ProposalPayload = {
    name : Text;
    description : ?Text;
    story : ?Text;
    location : Text;
    categories : [Text];
    document : ?Text;
    fundingType : Text;
    fundingAmount : Nat;
    discussionLink : ?Text;
    images : ?[Text];
    video : ?Text;
    dueDate : Time.Time;
  };
  public type ProposalState = {
    #failed : Text;
    #open;
    #approved;
    #rejected;
    #executing;
    #succeeded;
  };
  public type Vote = { #no; #yes };
  public type VoteArgs = { vote : Vote; proposalId : Text };
  public type Voter = {
    uid : Principal;
    vote : Vote;
    timestamp : Time.Time;
  };
  public type ProposalType = {
    #project;
    #product;
  };

  // Transaction
  public type Operation = {
    #withdraw;
    #createProposal;
    #returnProposalFee;
    #vote;
    #returnVoteFee;
    #executeApprovedProposal;
    #awardUserAgreement;
    #rewardTop;
    #collectTreasuryContribution;
    #payQuest;
    #buyLandSlot;
  };
  public type TxRecord = {
    uuid : Text;
    caller : Principal;
    refType : Operation; // operation type
    refId : ?Text;
    blockIndex : Nat64; // transaction index
    fromPrincipal : Principal;
    toPrincipal : Principal;
    amount : Nat64;
    fee : Nat64;
    timestamp : Time.Time;
  };

  // Quest
  //--------------------- Character ---------------------//
  public type Character = {
    userId : Principal;
    id : Text;
    name : Text;
    level : Int;
    temporaryExp : Int;
    currentExp : Int;
    levelUpExp : Int;
    status : Text;
    strength : Float;
    intelligence : Int;
    vitality : Int;
    luck : Int;
    currentHP : Float;
    maxHP : Float;
    currentMana : Float;
    maxMana : Float;
    currentStamina : Float;
    maxStamina : Float;
    currentMorale : Float;
    maxMorale : Float;
    classId : Text;
    gearIds : ?[Text];
    inventorySize : Int;
    exhaustedTime : Int;
  };

  public type CharacterClass = {
    id : Text;
    name : Text;
    specialAbility : Text;
    description : Text;
    baseStrength : Float;
    baseIntelligence : Int;
    baseVitality : Int;
    baseLuck : Int;
    baseHP : Float;
    baseMana : Float;
    baseStamina : Float;
    baseMorale : Float;
  };

  public type CharacterTakesOption = {
    characterId : Text;
    eventOptionId : Text;
    takeable : Bool;
    pickUpTime : Time.Time;
    currentHP : Float;
    maxHP : Float;
    currentMana : Float;
    maxMana : Float;
    currentStamina : Float;
    maxStamina : Float;
    currentMorale : Float;
    maxMorale : Float;
  };

  public type CharacterSelectsItems = {
    characterId : Text;
    itemIds : [Text];
  };

  public type CharacterCollectsMaterials = {
    id : Text;
    characterId : Text;
    materialId : Text;
    amount : Int;
  };

  //--------------------- Quest ---------------------//
  public type Quest = {
    id : Text;
    name : Text;
    price : Nat64;
    description : Text;
    images : Text;
  };

  //--------------------- Quest Engine---------------------//
  public type QuestEngine = {
    id : Text;
    userId: Principal;
    name : Text;
    price : Nat64;
    description : Text;
    images : Text;
    isActive : Bool;
    dateCreate : Time.Time;
    listScene : [Text];
  };

  public type QuestGame = {
    id: Text;
    questId: Text;
    characterId: Text;
    timestamp: Int;
    hp: Float;
    stamina: Float;
    morale: Float;
    mana: Float;
  };

  //--------------------- Scene ---------------------//
  public type Scene = {
    id : Text;
    idQuest : Text;
    idEvent : Text;
    front : Text;
    mid : Text;
    back : Text;
    obstacle : Text;
  };

  //--------------------- Item ---------------------//
  public type Item = {
    id : Text;
    name : Text;
    strengthRequire : Float;
    images : Text;
  };

  public type QuestItem = {
    id : Text;
    itemId : Text;
    questId : Text;
  };

public type UsableItem = {
    id : Text;
    name : Text;
    image : Text;
    increaseStamina : Float;
    increaseHP : Float;
    increaseMorale : Float;
    increaseMana : Float;
    effect : Text;
  };

  public type EventItem = {
    userId : Principal;
    itemId : Text;
  };

  public type ARItem = {
    userId : Principal;
    itemId : Text;
  };

  //--------------------- Event ---------------------//
  public type Event = {
    id : Text;
    questId : Text;
    description : Text;
    locationName : Text;
    destinationName : Text;
  };

  //--------------------- Event Option ---------------------//
  public type EventOption = {
    id : Text;
    eventId : Text;
    description : Text;
    requireItemId : Text;
    lossHP : Float;
    lossMana : Float;
    lossStamina : Float;
    lossMorale : Float;
    riskChance : Float;
    riskLost : Text;
    lossOther : Text;
    gainExp : Int;
    gainHP : Float;
    gainStamina : Float;
    gainMorale : Float;
    gainMana : Float;
    luckyChance : Float;
    gainByLuck : Text;
    gainOther : Float;
  };

  //--------------------- Gear ---------------------//
  public type Gear = {
    id : Text;
    name : Text;
    description : Text;
    images : Text;
    gearClassId : Text;
    gearRarity : Text;
    substatIds : [Text];
  };

  public type GearClass = {
    id : Text;
    name : Text;
    description : Text;
    mainStat : Int;
  };

  public type GearRarity = {
    id : Text;
    name : Text;
    description : Text;
    boxColor : Text;
  };

  public type GearSubstat = {
    id : Text;
    substat : Int;
    description : Text;
  };

  //--------------------- Material ---------------------//
  public type Material = {
    id : Text;
    name : Text;
    description : Text;
  };

  //--------------------- Inventory ---------------------//
  public type Inventory = {
    id : Text;
    characterId : Text;
    materialId : Text;
    amount : Int;
  };

  // Land
  //--------------------- Land Config -------------------//
  public type LandConfig = {
    id : Text;
    mapWidth : Int;
    mapHeight : Int;
  };

  //--------------------- Land Slot ---------------------//
  public type LandSlot = {
    id : Text;
    ownerId : Principal;
    isPremium : Bool;
    isSelling : Bool;
    indexRow : Nat;
    indexColumn : Nat;
    zoneNumber : Nat;
    zoneLetter : Text;
    easting : Nat;
    northing : Nat;
    price : Float;
  };

  public type Geometry = {
    zoneNumber : Nat;
    zoneLetter : Text;
    i : Nat;
    j : Nat;
  };

  //--------------------- Land Transfer History ---------------------//
  public type LandTransferHistory = {
    id : Text;
    buyerId : Principal;
    ownerId : Principal;
    landId : Text;
    transferTime : Int;
    price : Float;
  };

  //--------------------- Land Buying Status ---------------------//
  public type LandBuyingStatus = {
    id : Principal;
    geometry : Geometry;
    randomTimes : Nat;
  };

  //--------------------------Nation--------------------------//
  public type Nation = {
    id : Principal;
    landSlotIds : [Text];
    indexRow : Nat;
    indexColumn : Nat;
    utms : [[Nat]];
  };

  public type NationGeometry = {
    id : Text;
    zoneNumber : Nat;
    zoneLetter : Text;
    i : Nat;
    j : Nat;
    coordinates: [[[Nat]]]; // Float
  };
//--------------------------Land Effect-------------//
  public type LandEffect = {
    id : Text;
    symbol : Text;
    value : Float;
    effect : Text;
    description : Text;
  };

  public type UserHasLandEffect = {
    id : Principal;
    landEffectId : Text;
  };
// Farm

//--------------------- Product ---------------------//
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
  };

//--------------------- ProductStorage ---------------------//
  public type ProductStorage = {
    id : Text;
    userId : Text;
    productId : Text;
    quality : Text;
    amount : Int; 
  };

//--------------------- Stash ---------------------//
  public type Stash = {
    id : Text;
    userId : Text;
    usableItemId : Text;
    quality : Text;
    amount : Int; 
  };

  //-------------------------Tile------------------------------//
  public type Tile = {
    id : Text;
    landSlotId : Text;
    indexRow : Nat;
    indexColumn : Nat;
    objectId : Text;
  };

  //--------------------- Farm Object ---------------------//
  public type FarmObject = {
    id : Text;
    landSlotId : Text;
    indexRow : Nat;
    indexColumn : Nat;
    rowSize : Nat;
    columnSize : Nat;
    objectId : Text;
    name : Text;
    hasEffectId : Text;
    status : Text;
    remainingTime : Int;
  };

  //--------------------- Seed ---------------------//
  public type Seed = {
    id : Text;
    harvestedProductId : Text;
    materialId : Text;
    rowSize : Nat;
    columnSize : Nat;
    name : Text;
    description : Text;
    waitTime : Int;
    expiryTime : Int;
    grownCondition : Text;
    minAmount : Int;
    maxAmount : Int;
  };

  //--------------------- Plant ---------------------//
  public type Plant = {
    id : Text;
    seedId : Text;
    hasEffectId : Text;
    status : Text;
    plantTime : Int;
  };
//------------------ Plant Penalty Time-------------------//
  public type PlantPenaltyTime = {
    id : Text;
    penaltyTime : Int;
  };
//--------------------- Plant Harvesting History ---------------------//
  public type PlantHarvestingHistory = {
    id : Text;
    harvesterId : Principal;
    plantId : Text;
    harvestTime : Int;
  };

//--------------------- Farm Effect -------------//
  public type FarmEffect = {
    id : Text;
    symbol : Text;
    value : Float;
    effect : Text;
    description : Text;
  };

  public type UserHasFarmEffect = {
    id : Text;
    farmEffectId : Text;
    userId : Principal;
  };

//--------------------- Alchemy Recipe -------------//
  public type AlchemyRecipe = {
    id : Text;
    usableItemId : Text;
    description : Text;
    craftingTime : Int;
  };

  public type AlchemyRecipeDetail = {
    id : Text;
    recipeId : Text;
    productId : Text;
    amount : Int;
  };

//--------------------- BuildingType -------------//
  public type BuildingType = {
    id : Text;
    name : Text;
    price : Float;    
    rowSize : Nat;
    columnSize : Nat;
    buildWaitTime : Int;
    // usableItemId : Text;
    // resultUsableItemId: Text;
    description : Text;
    // produceWaitTime : Int;
    // minAmount : Int;
    // maxAmount : Int;
  };

//--------------------BuildingBuyingHistory----------//
  public type BuildingBuyingHistory = {
    id : Text;
    buyerId : Principal;
    constructionId : Text;
    buyTime : Int;
    price : Float;
  };

//--------------------- Building -------------//
  public type Building = {
    id : Text;
    buildingTypeId : Text;
    resultUsableItemId : Text;
    status : Text;
    buildTime : Int;
    startProducingTime : Int;
  };

//--------------------- Production Queue -------------//
  public type ProductionQueue = {
    id : Text;
    nodeAmount : Int;
    queueMaxSize : Int;
  };

//--------------- Production Queue Node -------------//
  public type ProductionQueueNode = {
    id : Text;
    recipeId : Text;
    status : Text;
    startCraftingTime : Int;
  };

  // Error codes
  public type Error = {
    #BalanceLow;
    #TransferFailure;
    #NotFound;
    #AlreadyExisting;
    #NotAuthorized;
    #SomethingWrong;
    #ProposalIsNotOpened;
    #AlreadyVoted;
    #AdminRoleRequired;
    #OwnerRoleRequired;
    #StationNotFound;
    #InvalidData;
  };

  public let proposalCategories = [
    "GOAL 1: No Poverty",
    "GOAL 2: Zero Hunger",
    "GOAL 3: Good Health and Well-being",
    "GOAL 4: Quality Education",
    "GOAL 5: Gender Equality",
    "GOAL 6: Clean Water and Sanitation",
    "GOAL 7: Affordable and Clean Energy",
    "GOAL 8: Decent Work and Economic Growth",
    "GOAL 9: Industry, Innovation and Infrastructure",
    "GOAL 10: Reduced Inequality",
    "GOAL 11: Sustainable Cities and Communities",
    "GOAL 12: Responsible Consumption and Production",
    "GOAL 13: Climate Action",
    "GOAL 14: Life Below Water",
    "GOAL 15: Life on Land",
    "GOAL 16: Peace and Justice Strong Institutions",
    "GOAL 17: Partnerships to achieve the Goal"
  ];

  public let refillProductCategories = [
    "Food",
    "Spices",
    "Body Care",
    "Household Goods"
  ];

  public let proposalFundingTypes = [
    "100% Funded",
    "Partially Funded"
  ];

  // Refill Stations
  public type Currency = RS.Currency;
  public type RefillBrand = RS.Brand;
  public type RBManager = RS.Manager;
  public type RBStation = RS.Station;
  public type RBCategory = RS.Category;
  public type RBTag = RS.Tag;
  public type RBProductUnit = RS.ProductUnit;
  public type RBProduct = RS.Product;
  public type RBOrder = RS.Order;

  // Memory Card Engine
  public type MemoryCardEngineGame = MemoryCardEngineModel.Game;
  public type MemoryCardEngineStage = MemoryCardEngineModel.Stage;
  public type MemoryCardEngineCard = MemoryCardEngineModel.Card;
  public type MemoryCardEngineGameProgress = MemoryCardEngineModel.GameProgress; // thay doi
  public type MemoryCardEnginePlayer = MemoryCardEngineModel.Player;
  public type MemoryCardEngineReward = MemoryCardEngineModel.Reward;
  public type MemoryCardEnginePatternItemGames = {
    gameId : Text;
    gameSlug : Text;
    gameImage : Text;
    gameName : Text;
    gameDescription : Text;
    gameStatus : Bool;
  };
  public type MemoryCardEnginePatternItemStages = {
    gameId : Text;
    stageId : Text;
    stageName : Text;
    stageOrder : Nat;
  };
  public type MemoryCardEnginePatternItemCards = {
    stageId : Text;
    cardId : Text;
    cardType : Text;
    cardData : Text;
  };
  public type GamePlayAnalytics = {
    miniGamePlayCount : Nat;
    miniGameCompletedCount : Nat;
    questPlayCount : Nat;
    questCompletedCount : Nat;
    // purchasedLandSlotsCount : ?Nat;
  };
};
