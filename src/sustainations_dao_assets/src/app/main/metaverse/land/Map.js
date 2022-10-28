import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import Back from "./Back";
import Footer from "./footer";
import "./styles.css";
import Farm from "./Farm"

import {
  buyLandSlot,
  randomLandSlot,
  createLandSlot,
  loadLandBuyingStatus,
  loadNationsfromCenter,
  loadLandSlotsfromCenter,
  loadTileSlots,
  getLandIndex,
  getUserInfo,
  updateLandBuyingStatus,
} from '../LandApi'

var numRandom = 3
var landData = []
var nationData = []
var init = 0
var mapFeature = null


const Map = () => {

  const loadLands = async (i, j) => {
    landData = await loadLandSlotsfromCenter(i, j);
  }
  const loadNations = async (i,j) => {
    nationData = await loadNationsfromCenter(i,j);
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

    layer.on({
      click: async (e) => {
        mapFeature = await loadTileSlots(country.properties)
        setModeBtn(true)
        setPurchaseBtn(false)
        setFarmLocation(e.latlng)
        e.target.setStyle({fillColor: "red"})
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
    let landBuyingStatus = await loadLandBuyingStatus()
    if (landBuyingStatus != undefined) {
        let landBuyingStatus = await loadLandBuyingStatus()
        numRandom=Number(landBuyingStatus.properties.randomTimes)
        // set current random landslot in landBuyingStatus
    }
    else {
      numRandom-=1
      console.log(await buyLandSlot())
      let landSlot = await randomLandSlot()
      console.log(landSlot)
      console.log(await updateLandBuyingStatus(landSlot.properties.i,landSlot.properties.j,numRandom))
    }
    setRender(!render)
    console.log("USER INFO:")
    console.log(await getUserInfo())
  }

  const handleAccept = async () => {
    let landBuyingStatus = await loadLandBuyingStatus()
    console.log(await createLandSlot(landBuyingStatus.properties.i,landBuyingStatus.properties.j))
  }

  const handleTryAgain = async () => {
    numRandom-=1
    setRender(!render)
    let landSlot = await randomLandSlot()
    console.log(landSlot)
    console.log(await updateLandBuyingStatus(landSlot.properties.i,landSlot.properties.j,numRandom))
    // if numRandom = 0 then, turn off try again button
    
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
              display: purchaseBtn ? "block" : "none"
            }} onClick={handlePurchase}>Buy a new Land Slot</button>

            <button className="button-85" style={{
              display: modeBtn ? "block" : "none"
            }} onClick={handleChangeMode}>Go to farm mode { }</button>

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