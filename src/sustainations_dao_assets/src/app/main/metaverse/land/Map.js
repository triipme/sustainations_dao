import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import LoadingButton from '@mui/lab/LoadingButton';
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
var landSlotRand = null
export var mapZoom = 0

const Map = () => {

  const loadLands = async (i, j) => {
    landData = await loadLandSlotsfromCenter(i, j);
  }
  const loadNations = async (i, j) => {
    nationData = await loadNationsfromCenter(i, j);
    // console.log("NATION DATA BEFORE: ", nationData[0].geometry)
    // let c = findCenter(nationData[0].geometry.coordinates[0])
    // findAngles(c, nationData[0].geometry.coordinates[0])
    // nationData[0].geometry.coordinates[0].sort(function (a, b) {
    //   if (a.angle > b.angle && (a[0] === b[0]) || (a[1] === b[1])) return 1;
    //   else if (a.angle < b.angle) return -1;
    //   return 0;
    // });

    // console.log("NATION DATA AFTER: ", nationData)
  }
  const map = useMap()
  const [purchaseBtn, setPurchaseBtn] = useState(true)
  const [modeBtn, setModeBtn] = useState(false)
  const [alert, setAlert] = useState(false)
  const [render, setRender] = useState(true)
  const [farmLocation, setFarmLocation] = useState(null)
  const [mode, setMode] = useState('land')
  const [loading, setLoading] = useState("none")
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
  mapZoom = map.getZoom()
  // position is value coord center screen
  // console.log(position)
  if (init == 0) { loadLands(0, 0), loadNations(0, 0) }
  init = 1

  let index = getLandIndex(position, landData)
  if (index != undefined) {
    loadLands(index[0], index[1]);
    loadNations(index[0], index[1])
  }
  // console.log(index)
  map.on('click', function (e) {
    if (mode === "farm") {
      setRender(!render)
    }
  });
  const onEachRandomLandSlot = (country, layer) => {
    // console.log(country)
    layer.setStyle({
      color: "#FFFFFF",
      fillColor: "#48c3c8",
      fillOpacity: ".75"
    })
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
  const onEachLandSlot = (country, layer) => {
    // set style for each poligon
    layer.setStyle({
      color: "#002E5E",
      fillColor: "#002E5E",
      fillOpacity: ".75"
    })

    // handle click on poligon

  }


  const handleChangeMode = () => {
    map.setView(farmLocation, 18)
    setMode("farm")
  }

  const handlePurchase = async () => {
    setLoading("purchased")
    let landBuyingStatus = await loadLandBuyingStatus()
    // console.log(landBuyingStatus)
    if (landBuyingStatus != undefined) {
      numRandom = Number(landBuyingStatus.randomTimes)
      // set current random landslot in landBuyingStatus
    }
    else {
      // if having enough ICP
      let isBuy = await buyLandSlot()
      if (isBuy !== undefined) {
        numRandom -= 1
        landSlotRand = await randomLandSlot()
        // console.log("BUY LAND")
        // console.log("Random: ", landSlotRand)
        console.log(await updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom))
        map.setView([landSlotRand.geometry.coordinates[0][0][1], landSlotRand.geometry.coordinates[0][0][0]], 13)
      } else {
        // if not having enough ICP
        setAlert(true)
        console.log("OUT OF MONEY")
      }
    }
    setPurchaseBtn(false)
    setLoading("none")
  }

  const handleAccept = async () => {
    setLoading("accept")
    let landBuyingStatus = await loadLandBuyingStatus()
    console.log(await createLandSlot(landBuyingStatus.currentIndexRow, landBuyingStatus.currentIndexColumn))
    numRandom = 3
    setLoading("none")
    setPurchaseBtn(true)

  }

  const handleTryAgain = async () => {
    setLoading("try")
    landSlotRand = await randomLandSlot()
    console.log(await updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom))
    map.setView([landSlotRand.geometry.coordinates[0][0][1], landSlotRand.geometry.coordinates[0][0][0]], 13)
    setLoading("none")
    numRandom -= 1
  }

  return (
    <>
      {mode === 'land' &&
        <>
          <Back />
          <Footer />
          <GeoJSON key={Math.floor(Math.random() * 9999)} data={nationData} onEachFeature={onEachLandSlot} />
          <GeoJSON key={Math.floor(Math.random() * 9999)} data={landSlotRand} onEachFeature={onEachRandomLandSlot} />
          <div>

            {/* <button className="button-85" style={{
              display: purchaseBtn ? "block" : "none"
            }} onClick={() => handlePurchase()
            }>Buy a new Land Slot</button> */}
            <div>
              {loading == "purchased" ? <button className="buttonload">
                <i className="fa fa-spinner fa-spin"></i> Loading
              </button> :
                <button className="buttonload" style={{
                  display: purchaseBtn ? "block" : "none"
                }}
                  onClick={() => handlePurchase()}>Buy a new Land Slot</button>}
            </div>

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
                {loading === "accept" ? <h2 className="popupAccept"
                  style={{
                    display: purchaseBtn ? "none" : "block"
                  }}><i className="fa fa-spinner fa-spin"></i> LOADING</h2> : <h2 className="popupAccept"
                    style={{
                      display: purchaseBtn ? "none" : "block"
                    }}
                    onClick={() => {
                      handleAccept()
                      setRender(!render)
                    }}>ACCEPT</h2>}
                {loading === "try" ? <h2 className="popupTryAgain"
                  style={{
                    // if numRandom = 0 then, turn off try again button
                    display: purchaseBtn || numRandom <= 0 ? "none" : "block",
                  }}
                ><i className="fa fa-spinner fa-spin"></i> LOADING</h2> : <h2 className="popupTryAgain"
                  style={{
                    // if numRandom = 0 then, turn off try again button
                    display: purchaseBtn || numRandom <= 0 ? "none" : "block",
                  }}
                  onClick={() => {
                    handleTryAgain()
                    setRender(!render)
                  }}
                >Try Again</h2>}

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
                      display: alert && !purchaseBtn ? "block" : "none",
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
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