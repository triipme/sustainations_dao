import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";

module {
  // User Profile
  public type Role = {
    #user;
    #admin;
  };
  public type Profile = {
    username : ?Text;
    avatar : ?Text;
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
    uid : Principal; vote : Vote; timestamp : Time.Time
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

  // Game
  //--------------------- Character ---------------------//
  public type Character = {
    uuid : ?Text;
    name : Text;
    level : Int;
    currentExp : Int;
    levelUpExp : Int;
    status : ?Text;
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
    classId : ?Text;
    gearIds : ?[Text];
    materialIds : ?[Text];
  };

  public type CharacterClass = {
    uuid : ?Text;
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

  public type CharacterTakeOption = {
    characterId : Text;
    optionId : ?Text;
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

  //--------------------- Quest ---------------------//
  public type Quest = {
    uuid : ?Text;
    name : Text;
    price : Int;
    description : Text;
    images : ?[Text];
  };

  public type QuestItem = {
    uuid : ?Text;
    name : Text;
    strengthRequire : Float;
    images : ?[Text];
  };

  public type QuestItemForQuest = {
    uuid : ?Text;
    questItemId : Text;
    questId : Text;
  };

  //--------------------- Event ---------------------//
  public type Event = {
    uuid : ?Text;
    questId : Text;
    description : Text;
    locationName : Text;
    destinationName : Text;
  };

  //--------------------- Event Option ---------------------//
  public type EventOption = {
    uuid : ?Text;
    eventId : Text;
    description : Text;
    requireItemIds : [Text];
    lossHP : ?Float;
    lossMana : ?Float;
    lossStamina : ?Float;
    lossMorale : ?Float;
    riskChance : ?Float;
    riskLost : ?Text;
    lossOther : ?Text;
    gainExp : Int;
    gainHP : ?Float;
    gainStamina : ?Float;
    gainMorale : ?Float;
    gainMana : ?Float;
    luckyChance : ?Float;
    gainByLuck : ?Float;
    gainOther : ?Float;
  };

  //--------------------- Gear ---------------------//
  public type Gear = {
    uuid : ?Text;
    name : Text;
    description : Text;
    images : [Text];
    gearClassId : Text;
    gearRarity : Text;
    substatIds : ?[Text];
  };

  public type GearClass = {
    uuid : ?Text;
    name : Text;
    description : Text;
    mainStat : Int;
  };

  public type GearRarity = {
    uuid : ?Text;
    name : Text;
    description : Text;
    boxColor : Text;
  };

  public type GearSubstat = {
    uuid : ?Text;
    substat : Int;
    description : Text;
  };

  //--------------------- Material ---------------------//
  public type Material = {
    uuid : ?Text;
    name : Text;
    description : Text;
  };

  //--------------------- Inventory ---------------------//
  public type Inventory = {
    uuid : ?Text;
    name : Text;
    size : Int;
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

  public let proposalFundingTypes = [
    "100% Funded", "Partially Funded"
  ];
};