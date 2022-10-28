import { GeoJSON } from "react-leaflet";
import mapData from "./data/pangea-1.json";
import "./styles.css";

const BigMap = () => {
  const onEachLand = (country, layer) => {
    layer.setStyle({
      color: "#002E5E",
      fillColor: "#FFFFFF",
      fillOpacity: "0"
    })

  }
  return (
    <div style={{ height: "100%" }}>

      <GeoJSON data={mapData.features} onEachFeature={onEachLand} />

    </div>
  )
}

export default BigMap;
