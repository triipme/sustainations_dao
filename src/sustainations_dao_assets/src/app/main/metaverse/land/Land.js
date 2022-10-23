import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, MapContainer, useMap, useMapEvents, TileLayer, Rectangle, ImageOverlay } from "react-leaflet";
// import mapData from "./data/land_size_100_400X400_zone_20.json";
import "./styles.css";
import BigMap from "./bigmap"
import Map from "./Map"

const zoom = 4
var center = [0.0, -67.488694797721564]

function Land() {
  const [map, setMap] = useState(null)
  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: "100%" }}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        zoomControl={false}
        ref={setMap}>
        <BigMap></BigMap>
        <Map />
      </MapContainer>
    ),
    [],
  )

  return (
    <div style={{ height: "100%" }}>
      {displayMap}
    </div>

  );
}

export default Land;