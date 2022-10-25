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
  loadLandSlotsfromCenter,
  loadTileSlots,
  getLandIndex,
  getUserInfo,
  updateLandBuyingStatus
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
  const [purchaseBtn, setPurchaseBtn] = useState(true)
  const [modeBtn, setModeBtn] = useState(false)
  const [alert, setAlert] = useState(false)
  const [render, setRender] = useState(true)
  const [farmLocation, setFarmLocation] = useState(null)
  const [mode, setMode] = useState('land')
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

  // position is value coord center screen
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
    // set style for each poligon
    layer.setStyle({
      color: "#002E5E",
      fillColor: "#002E5E",
      fillOpacity: ".75"
    })

    // handle click on poligon
    layer.on({
      click: async (e) => {
        mapFeature = await loadTileSlots(country.properties)
        setModeBtn(true)
        setPurchaseBtn(false)
        setFarmLocation(e.latlng)
        e.target.setStyle({ fillColor: "red" })
      }
    });
  }


  const handleChangeMode = () => {
    map.setView(farmLocation, 18)
    setMode("farm")
  }

  const handlePurchase = async () => {
    let landBuyingStatus = await loadLandBuyingStatus()
    if (landBuyingStatus != undefined) {
      numRandom = Number(landBuyingStatus.randomTimes)
      // set current random landslot in landBuyingStatus
    }
    else {
      // if having enough ICP
      if (await buyLandSlot() !== undefined) {
        numRandom -= 1
        let landSlot = await randomLandSlot()
        console.log("BUY LAND")
        console.log(await updateLandBuyingStatus(landSlot.properties.i, landSlot.properties.j, numRandom))
      } else {
        // if not having enough ICP
        setAlert(true)
        console.log("OUT OF MONEY")
      }
    }
    console.log("USER INFO:")
    console.log(await getUserInfo())
    setPurchaseBtn(false)
  }

  const handleAccept = async () => {
    let landBuyingStatus = await loadLandBuyingStatus()
    console.log(await createLandSlot(landBuyingStatus.currentIndexRow, landBuyingStatus.currentIndexColumn))
    numRandom = 3
    setPurchaseBtn(true)
  }

  const handleTryAgain = async () => {
    numRandom -= 1
    let landSlot = await randomLandSlot()
    console.log(landSlot)
    console.log(await updateLandBuyingStatus(landSlot.properties.i, landSlot.properties.j, numRandom))
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
            }} onClick={() => handlePurchase()}>Buy a new Land Slot</button>

            <button className="button-85" style={{
              display: modeBtn ? "block" : "none"
            }} onClick={handleChangeMode}>Go to farm mode { }</button>

            {!modeBtn && <div className="containPopup" style={{ left: !alert ? "2%" : "32%" }}>
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
                    transform: "translate(-100%, -80%)",
                    fontSize: "152%"
                  }}
                >{!alert ? "Do you want to receive this land slot with 0.0002 icp ?" : "You do not have enough ICP to make this transaction !"}</h1>
              </div>
              {!alert ? <>
                <h2 className="popupAccept"
                  style={{
                    display: purchaseBtn ? "none" : "block"
                  }}
                  onClick={() => {
                    handleAccept()
                    setRender(!render)
                  }}>ACCEPT</h2>
                <h2 className="popupTryAgain"
                  style={{
                    // if numRandom = 0 then, turn off try again button
                    display: purchaseBtn || numRandom <= 0 ? "none" : "block",
                  }}
                  onClick={() => {
                    handleTryAgain()
                    setRender(!render)
                  }}
                >Try Again</h2>

                <span style={{
                  position: "absolute",
                  top: "82%",
                  left: "30%",
                  display: purchaseBtn ? "none" : "block"
                }}>Number of Retry:
                  {numRandom}</span>
              </> :
                <>
                  <h2 className="popupAccept"
                    style={{
                      display: alert ? "block" : "none",
                      left: "16%"
                    }}
                    onClick={() => {
                      setAlert(false)
                      setPurchaseBtn(true)
                    }}>EXIT</h2>
                </>
              }
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