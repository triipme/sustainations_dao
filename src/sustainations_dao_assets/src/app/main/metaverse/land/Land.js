import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, MapContainer, useMap, useMapEvents, TileLayer, Rectangle, ImageOverlay } from "react-leaflet";
import "./styles.css";
// import BigMap from "./bigmap"
import Map from "./Map"
import mapZoom from "./Map"

let zoom = 3
var center = [0.0, -67.488694797721564]
// import { GeoJSON } from "react-leaflet";

function Land() {
  const [map, setMap] = useState(null)
  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: "100%" }}
        center={center}
        minZoom={2}
        zoom={zoom}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        zoomControl={false}
        dragging={mapZoom == 2 ? false : true}
        // bounds={}
        ref={setMap}>
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