import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Types "../types";
import State "../state";

module LandSlot {
  public func getData(landSlot : Types.LandSlot) : Types.LandSlot {
    let newLandSlot : Types.LandSlot = {
      id = landSlot.id;
      ownerId = landSlot.ownerId;
      isPremium = landSlot.isPremium;
      isSelling = landSlot.isSelling;
      indexRow = landSlot.indexRow;
      indexColumn = landSlot.indexColumn;
      zoneNumber = landSlot.zoneNumber;
      zoneLetter = landSlot.zoneLetter;
      easting = landSlot.easting;
      northing = landSlot.northing;
      price = landSlot.price;
    };
    return newLandSlot;
  };

  public func create(landSlot : Types.LandSlot, state : State.State) {
    state.landSlots.put(landSlot.id, getData(landSlot));
  };

  public func update(landSlot : Types.LandSlot, state : State.State) {
    state.landSlots.put(landSlot.id, getData(landSlot));
  };

  // 
  public func listFarmObjectsFromLandSlot(indexRow : Nat, indexColumn : Nat, state : State.State) : async [Types.FarmObject] {
    var list : [Types.FarmObject] = [];
    for ( i in Iter.range(Int.abs(indexRow*10), Int.abs((indexRow*10)+9))) {
      for (j in Iter.range(Int.abs(indexColumn*10), Int.abs((indexColumn*10)+9))) {
        let id = Nat.toText(i) # "-" #Nat.toText(j);
        let rsTile = state.tiles.get(id);
        switch (rsTile) {
          case null {};
          case (?tile) {
            let rsPlant = state.plants.get(tile.objectId);
            switch (rsPlant) {
              case null {};
              case (?plant) {
                let rsSeed = state.seeds.get(plant.seedId);
                switch (rsSeed) {
                  case null {
                  };
                  case (?seed) {
                    let farmObject : Types.FarmObject = {
                      id = tile.id;
                      landSlotId = tile.landSlotId;
                      indexRow = tile.indexRow;
                      indexColumn = tile.indexColumn;
                      seedId = plant.seedId;
                      name = seed.name;
                      hasEffectId = plant.hasEffectId;
                      status = "";
                      remainingTime = 0;
                    };
                    list := Array.append<Types.FarmObject>(list, [farmObject]);
                  }
                };
              };
            };
          };
        };
      };
    };
    list;
  };
}