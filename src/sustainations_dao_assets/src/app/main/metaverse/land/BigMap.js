import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { GeoJSON } from "react-leaflet";

import mapData from "./data/pangea-1.json";

const BigMap = () => {
  const location = useLocation();
  const onEachLand = useMemo(
    () => (country, layer) => {
      layer.setStyle({
        color: "#002E5E",
        fillColor: "#9ed6ad",
        fillOpacity: location.pathname.includes("farm") ? "0" : "1"
      });
    },
    [location.pathname]
  );
  return (
    <div>
      <GeoJSON data={mapData.features} onEachFeature={onEachLand} />
    </div>
  );
};

export default BigMap;
