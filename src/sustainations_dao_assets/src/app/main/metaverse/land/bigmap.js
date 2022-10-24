import { useState } from "react";
import { GeoJSON, MapContainer, useMap, useMapEvents, TileLayer, Rectangle, ImageOverlay } from "react-leaflet";
import Back from "./Back";
import mapData from "./data/pangea.json";
import Footer from "./footer";
import L, { CRS, LatLngBounds, Icon } from 'leaflet';
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
