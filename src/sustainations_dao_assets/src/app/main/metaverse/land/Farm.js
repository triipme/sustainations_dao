import { useState } from "react";
import { GeoJSON, useMap, useMapEvents, ImageOverlay } from "react-leaflet";
import mapData from "./data/land_zone_20.json";
import "./styles.css";
import UIFarm from "./FarmUI"
const inventory = { tomato: false, dig: false }
const latlng = mapData.features.map(feature => {
    return feature.geometry.coordinates[0].map(item => {
        return [item[1], item[0]]
    })
});
mapData.features.map(feature => {
    return feature.properties.hasLand = false
});

const Farm = () => {
    var pos = []
    const [render, setRender] = useState(true)
    let idCrop = -1
    const map = useMap()
    map.on('click', function (e) {
        setRender(!render)
    });

    mapData.features.map(feature => {
        idCrop++
        if (feature.properties.hasLand === true && !pos.includes(idCrop)) {
            pos.push(idCrop)
        }
    })
    const checkTile = (mapData, latlng, a, b) => {
        let id = -1
        latlng.map(coord => {
            ++id
            if (coord[1][0] < a && coord[1][1] > b && coord[3][0] > a && coord[3][1] < b && inventory.tomato === true) {
                mapData.features[id].properties.hasLand = true
            } else if (coord[1][0] < a && coord[1][1] > b && coord[3][0] > a && coord[3][1] < b && inventory.dig === true) {
                mapData.features[id].properties.hasLand = false
            }
        })
    }

    const onEachLandSlot = (country, layer) => {
        layer.setStyle({
            fillOpacity: 1,
            color: "#44cf64"
        })
        if (country.properties.hasLand) {
            layer.setStyle({
                fillOpacity: 0,
                fillColor: "#FFFFFF"
            })
        } else {
            console.log("green")
            layer.setStyle({
                fillOpacity: 1,
                fillColor: "#44cf64",
            })
        }
        layer.on({
            click: function (e) {
                checkTile(mapData, latlng, e.latlng.lat, e.latlng.lng)
            },
        });
    }
    return (
        <>
            <GeoJSON key={Math.floor(Math.random() * 9999)} data={mapData.features} onEachFeature={onEachLandSlot} />
            <Create {...{ latlng, pos }}></Create>
            <Navigation></Navigation>
        </>
    )
}

const Create = ({ latlng, pos }) => {
    return (
        pos.map(tag => {
            return (
                <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/Farm object/PNG/farm object_4 ca chua 1.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
            )
        })
    )
}

function Navigation() {
    return (
        <>
            <UIFarm></UIFarm>

            {/* <div
                style={{
                    position: "fixed",
                    right: 0,
                    zIndex: 10000,
                    height: "100%",
                    backgroundColor: "white",
                }}
            >
                <img
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        inventory.tomato = !inventory.tomato
                        inventory.dig = false
                    }
                    }
                    width={70}
                    height={40}
                    src="/metaverse/farm/Sustaination_farm/Farm object/PNG/farm object_icon ca chua.png"
                    alt=""
                />

                <img
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        inventory.tomato = false
                        inventory.dig = !inventory.dig
                    }
                    }
                    width={70}
                    height={40}
                    src="/metaverse/farm/Sustaination_farm/Farm object/PNG/shovel.png"
                    alt=""
                />
            </div> */}
        </>
    )
}

export default Farm;
