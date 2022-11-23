import Option "mo:base/Option";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Types "../types";
import State "../state";

module Tile {
  public func getData(tile : Types.Tile) : Types.Tile {
    let newTile : Types.Tile = {
      id = tile.id;
      landSlotId = tile.landSlotId;
      indexRow = tile.indexRow;
      indexColumn = tile.indexColumn;
      objectId = tile.objectId;
    };
    return newTile;
  };

  public func create(tile : Types.Tile, state : State.State) {
    state.tiles.put(tile.id, getData(tile));
  };

  public func update(tile : Types.Tile, state : State.State) {
    let updated = state.tiles.replace(tile.id, getData(tile));
  };

  public func deleteFarmObjectFromList(farmObject : Types.FarmObject, farmObjects : [Types.FarmObject]) : async [Types.FarmObject] {
    return Array.filter<Types.FarmObject>(farmObjects, 
      func(val: Types.FarmObject) : Bool { farmObject != val }
    );
  };

  public func getFarmObjectsFromFarmObject(indexRow : Nat, indexColumn : Nat, seedId : Text, farmObjects : [Types.FarmObject]) : async [Types.FarmObject] {
    let rsFarmObject = Array.find<Types.FarmObject>(farmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == indexRow and val.indexColumn == indexColumn and val.seedId == seedId});
    switch (rsFarmObject) {
      case null { return [];};
      case (?farmObject) {
        let newFarmObjects : [Types.FarmObject] = await deleteFarmObjectFromList(farmObject, farmObjects);
        return Array.append<Types.FarmObject>(
          [farmObject],
          Array.append<Types.FarmObject>(
            if (Array.find<Types.FarmObject>(newFarmObjects, func (val : Types.FarmObject) : Bool {val.indexRow == Int.max(indexRow - 1, 0) and val.indexColumn == indexColumn and val.seedId == seedId}) != null) {
              await getFarmObjectsFromFarmObject((indexRow-1),indexColumn,seedId,newFarmObjects);
            } else {
              [];
            },
            Array.append<Types.FarmObject>(
              if (Array.find<Types.FarmObject>(newFarmObjects, func (val : Types.FarmObject) : Bool {val.indexRow  == indexRow + 1 and val.indexColumn == indexColumn and val.seedId == seedId}) != null) {
                await getFarmObjectsFromFarmObject((indexRow+1),indexColumn,seedId,newFarmObjects);
              }
              else {
                [];
              },
              Array.append<Types.FarmObject>(
                if (Array.find<Types.FarmObject>(newFarmObjects, func (val : Types.FarmObject) : Bool {val.indexRow  == indexRow and val.indexColumn == Int.max(indexColumn - 1, 0) and val.seedId == seedId}) != null) {
                  await getFarmObjectsFromFarmObject(indexRow,(indexColumn-1),seedId,newFarmObjects);
                }
                else {
                  [];
                },
                if (Array.find<Types.FarmObject>(newFarmObjects, func (val : Types.FarmObject) : Bool {val.indexRow  == indexRow and val.indexColumn == indexColumn + 1 and val.seedId == seedId}) != null) {
                  await getFarmObjectsFromFarmObject(indexRow,(indexColumn+1),seedId,newFarmObjects);
                }
                else {
                  [];
                }
              ), 
            ), 
          ),
        );
      };
    }
  };
  
}