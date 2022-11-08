import { GeoJSON } from "react-leaflet";
import mapData from "./data/pangea-1.json";
import "./styles.css";

const BigMap = () => {
  const onEachLand = (country, layer) => {
    layer.setStyle({
      color: "#002E5E",
      fillColor: "#9ed6ad",
      fillOpacity: "1"
    })

  }
  return (
    <div style={{ height: "100%", backgroundColor: "#8ab4f8" }}>

      <GeoJSON data={mapData.features} onEachFeature={onEachLand} />

    </div>
  )
}

export default BigMap;
