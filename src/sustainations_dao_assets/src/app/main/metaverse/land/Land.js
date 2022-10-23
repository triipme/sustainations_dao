import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, MapContainer, useMap, useMapEvents, TileLayer, Rectangle, ImageOverlay } from "react-leaflet";
import Back from "./Back";
import Footer from "./footer";
import mapData from "./data/land_size_100_400X400_zone_20.json";
import "./styles.css";
import Farm from "./Farm"
import BigMap from "./map"

import {
  buyLandSlot,
  randomLandSlot,
  completePurchaseSystemLandSlot,
  loadLandTransferHistories,
  updateLandBuyingStatus,
  loadLandBuyingStatus,
  loadLandSlotsfromCenter,
  getUserInfo,
  getLandIndex,
  loadTileSlots
} from '../LandApi'


const zoom = 16

let ownerId = 3
let cr_land = 0
var numRandom = 3
let availableLand = false
let offBtn1 = false
let offBtn2 = true

const lenghtRow = Math.sqrt(mapData.features.length)
const arr1 = [lenghtRow, 1, -lenghtRow, -1]
const arr2 = [lenghtRow, 1, -1]
const arr3 = [1, -lenghtRow, -1]
const arr4 = [lenghtRow, -lenghtRow, 1]
const arr5 = [lenghtRow, -1, -lenghtRow]
const arr6 = [lenghtRow, 1]
const arr7 = [lenghtRow, -1]
const arr8 = [-lenghtRow, +1]
const arr9 = [-lenghtRow, -1]

var center = [0.0, -67.488694797721564]
var landData = []
var init = 0

const loadLands = async (i,j) => {
  landData = await loadLandSlotsfromCenter(i, j, mapData);
}


const Map = () => {
  if (init==0) loadLands(0,0)
  init=1
  const [showFirstBtn, setShowFirstBtn] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [land, setLand] = useState(-1)
  const [purchased, setPurchased] = useState(false)
  const [render, setRender] = useState(true)
  const [mode, setMode] = useState('land')

  let listLand = []
  mapData.features.map(feature => {
    if (feature.properties.ownerId === ownerId) {
      availableLand = true
    }
  })

  if (availableLand) {
    var prch = true
    offBtn1 = true
    if (land === -1)
      offBtn2 = false
  }
  const [purchasedF, setPurchasedF] = useState(prch)


  const map = useMap()
  const [position, setPosition] = useState(() => map.getCenter())

  let index = getLandIndex(position, landData)
  if (index != undefined) {
    loadLands(index[0],index[1]);
  }
  map.on('click', function (e) {
    if (mode === "farm") {
      setRender(!render)
    }
  });
  let cnt = 0
  let flag = true

  const mapEvents = useMapEvents({
    zoomend: e => {
      if (mapEvents.getZoom() > 16) {
        setMode('farm')
      } else if (mapEvents.getZoom() <= 16)
        setMode('land')
    }
  });

  const getIndexLandFromIJ = (country) => {
    return country.properties.i * 400 + country.properties.j
  }
  const getRandomRange = (land) => {
    if (land < lenghtRow - 1 && land != 0) {
      return land + arr2[Math.floor(Math.random() * 3)];
    } else if (land < lenghtRow ** 2 - 1 && land > lenghtRow ** 2 - lenghtRow) {
      return land + arr3[Math.floor(Math.random() * 3)];
    } else if (land % 400 === 0 && land !== 0) {
      return land + arr4[Math.floor(Math.random() * 3)];
    } else if ((land + 1) % 400 === 0 && land !== lenghtRow - 1) {
      return land + arr5[Math.floor(Math.random() * 3)];
    } else if (land === 0) {
      return land + arr6[Math.floor(Math.random() * 2)];
    } else if (land === lenghtRow - 1) {
      return land + arr7[Math.floor(Math.random() * 2)];
    } else if (land === lenghtRow ** 2 - 1) {
      return land + arr9[Math.floor(Math.random() * 2)];
    } else if (land === lenghtRow ** 2 - lenghtRow) {
      return land + arr8[Math.floor(Math.random() * 2)];
    } else {
      return land + arr1[Math.floor(Math.random() * 4)];
    }
  }
  const onEachLandSlot = (country, layer) => {
    cnt = getIndexLandFromIJ(country)

    if (mode === 'land') {
      layer.setStyle({
        color: "#002E5E",
        fillColor: "#002E5E",
        fillOpacity: ".75"
      })
      if (land === cnt) {
        if (country.properties.ownerId) {
          layer.options.fillColor = "#FFFFFF";
          if (!purchasedF && !purchased) {
            do {
              var temp = Math.floor(Math.random() * (mapData.features.length - 1)) //99
              if (!mapData.features[temp].properties.ownerId && temp !== land) {
                mapData.features[temp].properties.ownerId = ownerId
                cr_land = temp
                flag = false
              }
            }
            while (flag)
          } else if (purchased && purchasedF) {
            do {
              let temp = getRandomRange(land)
              if (!mapData.features[temp].properties.ownerId && temp !== land) {
                if (purchased) {
                  mapData.features[temp].properties.ownerId = ownerId
                  cr_land = temp
                }
                flag = false
              }
            }
            while (flag)
          }

        } else if (!country.properties.ownerId) {
          if (purchased) {
            country.properties.ownerId = ownerId
            cr_land = land
            layer.options.fillColor = "#48C3C8"
          }
          else if (purchasedF) {
            country.properties.ownerId = ownerId
            layer.options.fillColor = "#48C3C8"
            cr_land = land
          }
          if (showFirstBtn || showBtn)
            layer.options.fillColor = "#48C3C8"
        }
      } else if (country.properties.ownerId) {
        layer.options.fillColor = "#FFFFFF"
      } else {
        layer.options.fillColor = "#002E5E";
      }
    }
  }


  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])



  const btnPurchaseRand = async () => {
    console.log(await randomLandSlot());
    setShowFirstBtn(true)
    numRandom -= 1
    let landIdRand
    do {
      landIdRand = Math.floor(Math.random() * (mapData.features.length - 1));
    } while (mapData.features[landIdRand].properties.ownerId && land !== landIdRand)
    if (landIdRand !== land) {
      setLand(landIdRand)
    }
    // else setRender(!render)
    loadLands(mapData.features[landIdRand].properties.i,mapData.features[landIdRand].properties.j)
    let centerLand = mapData.features[landIdRand].geometry.coordinates[0][0]
    map.setView({ "lat": centerLand[1], "lng": centerLand[0], }, zoom)
    await updateLandBuyingStatus(
      mapData.features[landIdRand].properties.zone,
      landIdRand,
      numRandom
    )
  }


  const btnRand = async () => {
    setShowBtn(true)
    setPurchasedF(false)
    setPurchased(false)
    let dem = 0
    mapData.features.map(feature => {
      if (feature.properties.ownerId === ownerId) {
        listLand.push(dem)
      }
      dem++
    })
    let temp = -1
    numRandom -= 1

    let fl = true
    do {
      cr_land = listLand[Math.floor(Math.random() * listLand.length)]

      temp = getRandomRange(cr_land)
      if (!mapData.features[temp].properties.ownerId && land !== temp) {
        fl = false
      }
    }
    while (fl)
    setLand(temp)
    let centerLand = mapData.features[temp].geometry.coordinates[0][0]
    map.setView({ "lat": centerLand[1], "lng": centerLand[0], }, zoom)

    await updateLandBuyingStatus(
      mapData.features[temp].properties.zone,
      temp,
      numRandom
    )

  }


  const handleFirstPurchase = async () => {
    offBtn1 = true;
    let landBuyingStatus = await loadLandBuyingStatus()
    if (landBuyingStatus != undefined) {
      numRandom = parseInt(landBuyingStatus.randomTimes)
      setLand(parseInt(landBuyingStatus.currentLandIndex))
      setShowFirstBtn(true)
      setRender(!render)
    }
    else {
      btnPurchaseRand()
      await buyLandSlot()
    }

    console.log("USER INFO:")
    console.log(await getUserInfo())

  }

  const handlePurchase = async () => {
    offBtn2 = true;
    btnRand()
    await buyLandSlot()
    console.log("USER INFO:")
    console.log(await getUserInfo())
  }

  const handleFirstAccept = async () => {
    setPurchasedF(true)
    setShowFirstBtn(false)
    offBtn1 = true
    offBtn2 = false
    await completePurchaseSystemLandSlot(
      mapData.features[land].properties.zone,
      mapData.features[land].properties.i, mapData.features[land].properties.j
    )
    console.log("UPDATED TRANSFER HISOTY:")
    console.log(await loadLandTransferHistories())
  }

  const completePurchaseSystemLandSlot = async () => {
    setPurchased(true)
    setShowBtn(false)
    offBtn2 = false
    await updateLandSlot(
      mapData.features[land].properties.zone,
      mapData.features[land].properties.i, mapData.features[land].properties.j
    )
    console.log("UPDATED TRANSFER HISOTY:")
    console.log(await loadLandTransferHistories())

  }


  return (
    <>
      {mode !== 'farm' && <Back />}
      {mode !== 'farm' && <Footer />}
      <GeoJSON key={Math.floor(Math.random() * 9999)} data={landData} onEachFeature={onEachLandSlot} />
      {mode !== 'farm' && <div>
        <button className="button-85" onClick={handleFirstPurchase} style={{
          display: offBtn1 ? "none" : "block"
        }}>Buy your first LandSlot</button>
        <button className="button-85" style={{
          display: offBtn2 ? "none" : "block"
        }} onClick={handlePurchase}>Buy a new LandSlot</button>

        <div className="containPopup">
          {/* Buy First */}
          <div className="popupBoder" style={{
            display: showFirstBtn ? "block" : "none"
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
              display: showFirstBtn ? "block" : "none"
            }}
            onClick={() => {
              handleFirstAccept()
    setRender(!render)

              numRandom = 3
            }}>ACCEPT</h2>

          <h2 className="popupTryAgain"
            style={{
              display: showFirstBtn ? "block" : "none",
            }}
            onClick={() =>
              numRandom > 0 ? btnPurchaseRand() : null
            }
          >Try Again</h2>

          {/* Buy more */}
          <div className="popupBoder" style={{
            display: showBtn ? "block" : "none"
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
              display: showBtn ? "block" : "none"
            }}
            onClick={() => {
              handleAccept()
              numRandom = 3
            }}>ACCEPT</h2>
          <h2 className="popupTryAgain"
            style={{
              display: showBtn ? "block" : "none",
            }}
            onClick={() =>
              numRandom > 0 ? btnRand() : null
            }
          >Try Again</h2>

          <span style={{
            position: "absolute",
            top: "82%",
            left: "30%",
            display: (!offBtn2 && offBtn1) || (!offBtn1 && offBtn2) ? "none" : "block"
          }}>Number of Retry:
            {numRandom}</span>
        </div>


      </div>}
      {mode === 'farm' && <Farm />}
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


function Land() {
  const [map, setMap] = useState(null)
  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: "100%" }}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        zoomControl={false}
        ref={setMap}>
        <BigMap></BigMap>
        <Map />
      </MapContainer>
    ),
    [],
  )

  return (
    <div style={{ height: "100%" }}>
      {/* {map ? < DisplayPosition map={map} />: null} */}
      {displayMap}
    </div>

  );
}

export default Land;