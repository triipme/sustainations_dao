import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import Back from "./Back";
import Footer from "./footer";
import "./styles.css";
import Farm from "./Farm"

import {
    buyLandSlot,
    updateLandSlot,
    loadLandTransferHistories,
    updateLandBuyingStatus,
    loadLandBuyingStatus,
    loadLandSlotsfromCenter,
    getUserInfo,
    loadTileSlots,
    getLandIndex
} from '../LandApi'

var numRandom = 3
var landData = []
var init = 0
var mapFeature = null

const Map = () => {

    const loadLands = async (i, j) => {
        landData = await loadLandSlotsfromCenter(i, j);
    }
    const map = useMap()
    const [mode, setMode] = useState('land')
    const [modeBtn, setModeBtn] = useState(false)
    const [purchaseBtn, setPurchaseBtn] = useState(true)
    const [render, setRender] = useState(true)
    const [farmLocation, setFarmLocation] = useState(null)
    // get lnglat center
    const [position, setPosition] = useState(() => map.getCenter())

    const onMove = useCallback(() => {
        setPosition(map.getCenter())
    }, [map])

    useEffect(() => {
        map.on('move', onMove)
        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove])


    if (init == 0) loadLands(0, 0)
    init = 1

    let index = getLandIndex(position, landData)
    if (index != undefined) {
        loadLands(index[0], index[1]);
    }
    map.on('click', function (e) {
        if (mode === "farm") {
            setRender(!render)
        }
    });

    const onEachLandSlot = (country, layer) => {
        
        layer.setStyle({
            color: "#002E5E",
            fillColor: "#002E5E",
            fillOpacity: ".75"
        })

        // if (country.properties.i === i && country.properties.j === j && country.propertirs.zone === zone) {
        //     layer.setStyle({
        //         color: "#002E5E",
        //         fillColor: "#48c3c8",
        //         fillOpacity: ".75"
        //     })
        // } else {
        //     layer.setStyle({
        //         color: "#002E5E",
        //         fillColor: "#002E5E",
        //         fillOpacity: ".75"
        //     })
        // }

        layer.on({
            click: async (e) => {
                mapFeature = await loadTileSlots(country.properties)
                setModeBtn(true)
                setPurchaseBtn(false)
                setFarmLocation(e.latlng)
            }
        });
        

    }

    console.log("Mode Map:", mode)

    const handleChangeMode = () => {
        map.setView(farmLocation, 20)
        setMode("farm")
    }

    const handlePurchase = async () => {
        setPurchaseBtn(false)
    }


    const handleAccept = async () => {

    }

    const handleTryAgain = () => {

    }


    return (
        <>
            {mode === 'land' &&
                <>
                    <Back />
                    <Footer />
                    <GeoJSON key={Math.floor(Math.random() * 9999)} data={landData} onEachFeature={onEachLandSlot} />
                    <div>

                        <button className="button-85" style={{
                            display: "none"
                        }} onClick={handlePurchase}>Click a LandSLot to go to farmmode</button>

                        <button className="button-85" style={{
                            display: "block"
                        }} onClick={handleChangeMode}>Click a LandSLot to Go to farm mode</button>

                        {!modeBtn && <div className="containPopup">
                            {/* Popup purchase */}
                            <div className="popupBoder" style={{
                                display: purchaseBtn ? "none" : "block"
                            }}>
                                <img
                                    src="metaverse/windownPopup/UI_ingame_popup_panel.png" />
                                <h1
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-166%, -100%)"
                                    }}
                                >DO YOU WANT TO GET <br></br> THIS LANDSLOT?</h1>
                            </div>
                            <h2 className="popupAccept"
                                style={{
                                    display: purchaseBtn ? "none" : "block"
                                }}
                                onClick={() => {
                                    handleAccept()
                                }}>ACCEPT</h2>
                            <h2 className="popupTryAgain"
                                style={{
                                    display: purchaseBtn ? "none" : "block",
                                }}
                                onClick={() =>
                                    handleTryAgain()
                                }
                            >Try Again</h2>

                            <span style={{
                                position: "absolute",
                                top: "82%",
                                left: "30%",
                                display: purchaseBtn ? "none" : "block"
                            }}>Number of Retry:
                                {numRandom}</span>
                        </div>}
                    </div>
                </>}


            {mode === 'farm' && <Farm mapFeatures={mapFeature} />}

            <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                crossOrigin=""
            />
        </>
    )
}

export default Map;