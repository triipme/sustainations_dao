import { useMemo } from "react";
import { MapContainer } from "react-leaflet";

import "./styles.css";
import mapZoom from "./Map";
import { Outlet, useLocation } from "react-router-dom";

let zoom = 3;
var center = [0.0, -67.488694797721564];

function Land({ children }) {
  const location = useLocation();
  const isFarmMode = useMemo(() => location.pathname.includes("farm"), []);
  return (
    <div style={{ height: "100%" }}>
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
      >
        <div
          style={{
            height: "100%",
            backgroundColor: isFarmMode ? "gray" : "#8ab4f8"
          }}>
          {children}
        </div>
        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossOrigin=""
        />
      </MapContainer>
    </div>
  );
}

export default Land;
