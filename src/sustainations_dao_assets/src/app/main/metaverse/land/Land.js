import * as React from "react";
import { createRoot } from "react-dom/client";
import { GeoJSON, MapContainer } from "react-leaflet";
import { CRS } from "leaflet";
import mapData from "./data/data-new.json";
import RenderLayer from "./RenderLayer.js";

const countryStyle = {
  fillColor: "red",
  fillOpacity: 1,
  color: "black",
  weight: 2
};

function Land() {
  const onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;

    layer.bindPopup(countryName);

    layer.options.fillColor = "red";
    // API => uid abc123 + geoId = 2009+ status => 1,2,3
    //

    if (country.properties.id === 2009) layer.options.fillColor = "blue";

    layer.on({
      click: changeCountryColor
    });
    function changeCountryColor() {}
  };
  return (
    <div>
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        zoom={2}
        center={[1, 1]}
        crs={CRS.EPSG3857}>
        {/* <RenderLayer /> */}
        <GeoJSON style={countryStyle} data={mapData.features} onEachFeature={onEachCountry} />
        {/* <ReactLeafletGoogleLayer />/ */}
      </MapContainer>
    </div>
  );
}

export default Land;
