import Option "mo:base/Option";
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
    state.tiles.put(tile.id, getData(tile));
  };
}