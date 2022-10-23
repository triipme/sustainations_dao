import { useState } from "react";
import { GeoJSON, useMap, useMapEvents, ImageOverlay } from "react-leaflet";
import "./styles.css";
import UIFarm from "./FarmUI"
import Map from "./Map"
const inventory = { tomato: false, dig: false }
const Farm = ({ mapFeatures }) => {
    const [mode, setMode] = useState('farm')
    console.log("Mode:", mode)
    const latlng = mapFeatures.map(feature => {
        return feature.geometry.coordinates[0].map(item => {
            return [item[1], item[0]]
        })
    });

    var posD = [1, 2, 3, 4, 5, 6, 7, 8]
    var posU = [91, 92, 93, 94, 95, 96, 97, 98]
    var posL = [10, 20, 30, 40, 50, 60, 70, 80]
    var posR = [19, 29, 39, 49, 59, 69, 79, 89]
    var posC = [0, 9, 90, 99]
    const onEachLandSlot = (country, layer) => {
        layer.setStyle({
            color: "#000000",
            fillColor: "#FFFFFF",
            fillOpacity: "0.1"
        })
    }
    console.log(posD, posU, posL, posR, posC)
    return (
        <>
            {mode === 'farm' && <>

                <GeoJSON key={Math.floor(Math.random() * 9999)} data={mapFeatures} onEachFeature={onEachLandSlot} />
                <CreateBound {...{ latlng, posD, posU, posL, posR, posC }}></CreateBound>
                <UIFarm></UIFarm>
                <button className="button-85" style={{top: "250px"}} onClick={()=>setMode('land')}>Go to map mode</button>
            </>}
            {
                mode === 'land' && <>
                    <Map></Map>
                </>
            }
        </>
    )
}

const CreateBound = ({ latlng, posD, posU, posL, posR, posC }) => {
    return (
        <>
            {posD.map(tag => {
                return (
                    <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-08.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                )
            })}
            {posU.map(tag => {
                return (
                    <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-02.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                )
            })}
            {posL.map(tag => {
                return (
                    <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-04.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                )
            })}
            {posR.map(tag => {
                return (
                    <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-06.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                )
            })}
            {posC.map((tag, i) => {
                switch (i) {
                    case 0:
                        return (
                            <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-07.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                        )
                    case 1:
                        return (
                            <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-09.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                        )
                    case 2:
                        return (
                            <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-01.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                        )
                    case 3:
                        return (
                            <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm Tiles-03.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
                        )
                    default:
                        console.log("error")
                }
            })}
        </>
    )
}

const Create = ({ latlng, pos }) => {
    return (
        pos.map(tag => {
            return (
                <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/farm-object/PNG/farm object_4 ca chua 1.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
            )
        })
    )
}
export default Farm;
