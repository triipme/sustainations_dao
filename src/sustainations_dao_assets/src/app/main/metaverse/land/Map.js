import mapData from "./data/pangea-1.json";
import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import Back from "./Back";
import Footer from "./footer";
import "./styles.css";
import Farm from "./Farm"
import Loading from "./loading"

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
  loadNation,
  unionLandSlots,
  plantTree
} from '../LandApi'

var country = null
var numRandom = 3
var landData = []
var nationData = []
var init = 0
var mapFeature = null
var landSlotRand = null
var isFarmMode = false
export var mapZoom = 0

const Map = () => {


  const loadNations = async (i, j) => {
    landData = await loadLandSlotsfromCenter(i, j);
    nationData = await loadNationsfromCenter(i, j);
    console.log(await plantTree("97-1249", 97, 1249, "m3tomato_seed"));
  }
  const map = useMap()
  const [purchaseBtn, setPurchaseBtn] = useState(true)
  const [modeBtn, setModeBtn] = useState(false)
  const [alert, setAlert] = useState(false)
  const [render, setRender] = useState(true)
  const [farmLocation, setFarmLocation] = useState(null)
  const [mode, setMode] = useState('land')
  const [loading, setLoading] = useState("loadingmap")
  console.log(loading)
  if (mode === 'farm')
    isFarmMode = true
  else isFarmMode = false
  // get lnglat center
  const [position, setPosition] = useState(() => map.getCenter())

  mapZoom = map.getZoom()
  // position is value coord center screen
  const initial = async () => {
    if (loading === "loadingmap") {
      country = await loadNation();
      if (country === undefined) {
        await loadNations(0, 0)
        setLoading("none")
      } else {
        await loadNations(Number(country.indexRow), Number(country.indexColumn));
        map.setView([Number(nationData[0].geometry.coordinates[0][0][1]), Number(nationData[0].geometry.coordinates[0][0][0])], 13)
        setLoading("none")
      }
    }
  }
  initial()

  let index = getLandIndex(position, landData)


  const onMove = useCallback(async () => {
    setPosition(map.getCenter())
    if (index != undefined) {
      loadNations(index[0], index[1])
    }
  }, [map])
  // console.log(index)

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  map.on('click', function (e) {
    if (mode === "farm") {
      setRender(!render)
    }
  });
  const onEachRandomLandSlot = (country, layer) => {
    layer.setStyle({
      color: "#FFFFFF",
      fillColor: "#9ed6ad",
      fillOpacity: "1"
    })
  }
  const onEachLandSlot = (country, layer) => {
    // set style for each poligon
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
      }
    });
    // handle click on poligon
  }


  const handleChangeMode = () => {
    map.setView(farmLocation, 18)
    isFarmMode = true
    setMode("farm")
  }

  const handlePurchase = async () => {
    setLoading("purchased")
    let landBuyingStatus = await loadLandBuyingStatus()
    if (landBuyingStatus != undefined) {
      // let landBuyingStatus = await loadLandBuyingStatus()
      numRandom = Number(landBuyingStatus.properties.randomTimes)
      map.setView([Number(landBuyingStatus.geometry.coordinates[0][0][1]), Number(landBuyingStatus.geometry.coordinates[0][0][0])], 13)
      landSlotRand = landBuyingStatus
    }
    else {
      // if having enough ICP
      let isBuy = await buyLandSlot()
      if (isBuy !== undefined) {
        numRandom -= 1
        landSlotRand = await randomLandSlot()
        await updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom)
        map.setView([landSlotRand.geometry.coordinates[0][0][1], landSlotRand.geometry.coordinates[0][0][0]], 13)
      } else {
        // if not having enough ICP
        setAlert(true)
      }
    }
    setPurchaseBtn(false)
    setLoading("none")
  }

  const handleAccept = async () => {
    setLoading("accept")
    let landBuyingStatus = await loadLandBuyingStatus()
    let country = await loadNation()

    //convert Bigint utms to Number utms
    let utms = undefined
    if (country !== undefined) {
      utms = country.utms.map(e => {
        return e.map(i => {
          return Number(i)
        })
      });
    }

    // update Nation UTMS
    let nationUTMS = unionLandSlots(
      utms === undefined ? [] : [utms],
      [[
        [Number(landBuyingStatus.properties.i) * 1000, Number(landBuyingStatus.properties.j) * 1000],
        [Number(landBuyingStatus.properties.i) * 1000, (Number(landBuyingStatus.properties.j) + 1) * 1000],
        [(Number(landBuyingStatus.properties.i) + 1) * 1000, (Number(landBuyingStatus.properties.j) + 1) * 1000],
        [(Number(landBuyingStatus.properties.i) + 1) * 1000, Number(landBuyingStatus.properties.j) * 1000],
      ]]
    )
    await createLandSlot(landBuyingStatus.properties.i, landBuyingStatus.properties.j, nationUTMS[0][0])
    numRandom = 3
    landSlotRand = []
    await loadNations(Number(landBuyingStatus.properties.i), Number(landBuyingStatus.properties.j))
    map.setView([Number(landBuyingStatus.geometry.coordinates[0][0][1]), Number(landBuyingStatus.geometry.coordinates[0][0][0])], 13)
    setLoading("none")
    setPurchaseBtn(true)
  }

  const handleTryAgain = async () => {
    setLoading("try")
    landSlotRand = await randomLandSlot()
    await updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom)
    map.setView([landSlotRand.geometry.coordinates[0][0][1], landSlotRand.geometry.coordinates[0][0][0]], 13)
    numRandom -= 1
    console.log(await updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom))
    setLoading("none")
  }

  const BigMap = () => {
    const onEachLand = (country, layer) => {
      layer.setStyle({
        color: "#002E5E",
        fillColor: "#9ed6ad",
        fillOpacity: isFarmMode ? "0" : "1"
      })

    }
    return (
      <div>

        <GeoJSON data={mapData.features} onEachFeature={onEachLand} />

      </div>
    )
  }
  return (
    <>
      {loading !== "loadingmap" ? <div style={{ height: "100%", backgroundColor: isFarmMode ? "gray" : "#8ab4f8" }}>
        <BigMap></BigMap>
        <div>
          {mode === 'land' ?
            <div>
              <Back />
              <Footer />
              <GeoJSON key={Math.floor(Math.random() * 99999)} data={nationData} onEachFeature={onEachLandSlot} />
              <GeoJSON key={Math.floor(Math.random() * 99999)} data={landSlotRand} onEachFeature={onEachRandomLandSlot} />
              <div>
                <div>
                  {loading == "purchased" ? <button className="buttonload" style={{
                    display: purchaseBtn && loading !== "loadingmap" ? "block" : "none"
                  }}
                  ><i className="fa fa-spinner fa-spin"></i> LOADING</button> :
                    <button className="buttonload" style={{
                      display: purchaseBtn ? "block" : "none"
                    }}
                      onClick={() => handlePurchase()}>Buy a new Land Slot</button>}
                </div>

                <button className="button-85" style={{
                  display: modeBtn ? "block" : "none"
                }} onClick={handleChangeMode}>Go to farm mode { }</button>

                {!modeBtn ? <div className="containPopup" style={{
                  display: purchaseBtn ? "none" : "block"
                }}>
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
                        transform: "translate(-108%, -80%)",
                        fontSize: "136%",
                        margin: "2%"
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
                </div> : null}
              </div>
            </div> : null}
        </div>
        {mode === 'farm' && <Farm mapFeatures={mapFeature} />}
      </div> : <Loading/>}

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