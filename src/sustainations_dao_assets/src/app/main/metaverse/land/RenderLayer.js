import { useLeafletContext } from "react-leaflet/core";
import { useEffect } from "react";
import * as L from "leaflet";

const RenderLayer = () => {
  const context = useLeafletContext();
  const container = context.map;

  var tiles = new L.GridLayer();
  tiles.setZIndex(10000);
  tiles.setOpacity(1);
  tiles.createTile = function (coords) {
    var tile = L.DomUtil.create("canvas", "leaflet-tile");
    var ctx = tile.getContext("2d");
    var size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size.x - 1, 0);
    ctx.lineTo(size.x - 1, size.y - 1);
    ctx.lineTo(0, size.y - 1);
    ctx.closePath();
    ctx.stroke();
    return tile;
  };
  console.log("CRS: ", L.CRS);

  tiles.addTo(container);

  return <></>;
};

export default RenderLayer;
