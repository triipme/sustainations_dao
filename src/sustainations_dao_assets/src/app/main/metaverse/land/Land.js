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
  createLandSlot,
  loadLandTransferHistories,
  updateLandBuyingStatus,
  loadLandBuyingStatus,
  loadLandSlotsfromCenter,
  getUserInfo,
  getLandIndex
} from '../LandApi'


const zoom = 16

let ownerId = 3
let cr_land = 0
var numRandom = 3
let availableLand = false
let offBtn1 = false
let offBtn2 = true

var center = [0.180442714404941,-67.309516258333005]
var landData = loadLandSlotsfromCenter(200,200,mapData);


const latlng = mapData.features.map(feature => {
  return feature.geometry.coordinates[0].map(item => {
    return [item[1], item[0]]
  })
});

const Map = () => {
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

  let cnt = 0
  let flag = true
  const map = useMap()
  map.on('click', function (e) {
    if (mode === "farm") {
      setRender(!render)
    }
  });


  const mapEvents = useMapEvents({
    zoomend: e => {
      if (mapEvents.getZoom() > 16) {
        setMode('farm')
      } else if (mapEvents.getZoom() <= 16)
        setMode('land')
    }
  });

  const onEachLandSlot = (country, layer) => {
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
            console.log('run');

            do {
              var temp = Math.floor(Math.random() * (mapData.features.length-1)) //99
              if (!mapData.features[temp].properties.ownerId && temp !== land) {
                mapData.features[temp].properties.ownerId = ownerId
                cr_land = temp
                flag = false
              }
            }
            while (flag)
          } else if (purchased && purchasedF) {
            do {
              const arr1 = [10, 1, -10, -1]
              const arr2 = [10, 1, -1]
              const arr3 = [1, -10, -1]
              const arr4 = [10, -10, 1]
              const arr5 = [10, -1, -10]
              const arr6 = [10, 1]
              const arr7 = [10, -1]
              const arr8 = [-10, +1]
              const arr9 = [-10, -1]
              let temp
              if (land < 9 && land != 0) {
                temp = land + arr2[Math.floor(Math.random() * 3)];
              } else if (land < 100 && land > 90) {
                temp = land + arr3[Math.floor(Math.random() * 3)];
              } else if (land % 10 === 0 && land !== 0) {
                temp = land + arr4[Math.floor(Math.random() * 3)];
              } else if ((land + 1) % 10 === 0 && land !== 9) {
                temp = land + arr5[Math.floor(Math.random() * 3)];
              } else if (land === 0) {
                temp = land + arr6[Math.floor(Math.random() * 2)];
              } else if (land === 9) {
                temp = land + arr7[Math.floor(Math.random() * 2)];
              } else if (land === 99) {
                temp = land + arr9[Math.floor(Math.random() * 2)];
              } else if (land === 90) {
                temp = land + arr8[Math.floor(Math.random() * 2)];
              } else {
                temp = land + arr1[Math.floor(Math.random() * 4)];
              }
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
      cnt++
    }
  }

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



  const btnPurchaseRand = async () => {
    setShowFirstBtn(true)
    numRandom -= 1
    let landIdRand
    do {
      landIdRand = Math.floor(Math.random() * (mapData.features.length-1));
    } while (mapData.features[landIdRand].properties.ownerId && land !== landIdRand)
    if (landIdRand !== land)
    {
      setLand(landIdRand)
    }
    else setRender(!render)

    landData = loadLandSlotsfromCenter(
      mapData.features[landIdRand].properties.i,
      mapData.features[landIdRand].properties.j,
      mapData
    );
    let centerLand = mapData.features[landIdRand].geometry.coordinates[0][0]
    map.setView({"lat":centerLand[1],"lng":centerLand[0],}, zoom)
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
    let cs
    numRandom -= 1
    const arr1 = [10, 1, -10, -1]
    const arr2 = [10, 1, -1]
    const arr3 = [1, -10, -1]
    const arr4 = [10, -10, 1]
    const arr5 = [10, -1, -10]
    const arr6 = [10, 1]
    const arr7 = [10, -1]
    const arr8 = [-10, +1]
    const arr9 = [-10, -1]
    let fl = true
    do {

      cr_land = listLand[Math.floor(Math.random() * listLand.length)]

      if (cr_land < 9 && cr_land != 0) {
        temp = cr_land + arr2[Math.floor(Math.random() * 3)];

      } else if (cr_land < 100 && cr_land > 90) {
        temp = cr_land + arr3[Math.floor(Math.random() * 3)];

      } else if (cr_land % 10 === 0 && cr_land !== 0) {
        temp = cr_land + arr4[Math.floor(Math.random() * 3)];

      } else if ((cr_land + 1) % 10 === 0 && cr_land !== 9) {
        temp = cr_land + arr5[Math.floor(Math.random() * 3)];

      } else if (cr_land === 0) {
        temp = cr_land + arr6[Math.floor(Math.random() * 2)];

      } else if (cr_land === 9) {
        temp = cr_land + arr7[Math.floor(Math.random() * 2)];

      } else if (cr_land === 99) {
        temp = cr_land + arr9[Math.floor(Math.random() * 2)];

      } else if (cr_land === 90) {
        temp = cr_land + arr8[Math.floor(Math.random() * 2)];

      } else {
        temp = cr_land + arr1[Math.floor(Math.random() * 4)];

      }
      if (!mapData.features[temp].properties.ownerId && land !== temp) {
        fl = false
      }
    }
    while (fl)
    setLand(temp)
    await updateLandBuyingStatus(
      mapData.features[temp].properties.zone,
      temp,
      numRandom
    )
  }


  const handleFirstPurchase = async () => {
    offBtn1 = true;
    console.log(land)
    let landBuyingStatus = await loadLandBuyingStatus()
    if (landBuyingStatus != undefined)
    {
      numRandom = parseInt(landBuyingStatus.randomTimes)
      setLand(parseInt(landBuyingStatus.currentLandIndex))
      setShowFirstBtn(true)
      setRender(!render)
    }
    else
    {
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
    await createLandSlot(
      mapData.features[land].properties.zone,
      [mapData.features[land].properties.i,mapData.features[land].properties.j]
    )
    console.log("UPDATED TRANSFER HISOTY:")
    console.log(await loadLandTransferHistories())
  }

  const handleAccept = async () => {
    setPurchased(true)
    setShowBtn(false)
    offBtn2 = false
    await createLandSlot(
      mapData.features[land].properties.zone,
      [mapData.features[land].properties.i,mapData.features[land].properties.j]
    )
    console.log("UPDATED TRANSFER HISOTY:")
    console.log(await loadLandTransferHistories())
    
  }

  let index = getLandIndex(position,landData)
  if (index != undefined)
  {
    landData = loadLandSlotsfromCenter(index[0],index[1],mapData)
  }


  return (
    <>
      {mode !== 'farm' && <Back />}
      {mode !== 'farm' && <Footer />}
      <GeoJSON key={Math.floor(Math.random() * 9999)} data={landData} onEachFeature={onEachLandSlot} />
      {mode !== 'farm' && <div>
        <button className="button-85" onClick={handleFirstPurchase} style={{
          display: offBtn1 ? "none" : "block"
        }}>Purchase</button>
        <button className="button-85" style={{
          display: offBtn2 ? "none" : "block"
        }} onClick={handlePurchase}>UserId random</button>

        <div className="containPopup">
          {/* Buy First */}
          <img className="popupBoder"
            style={{
              display: showFirstBtn ? "block" : "none"
            }}
            src="metaverse/windownPopup/UI_ingame_popup_custom.png" />

          <img className="popupAccept"
            style={{
              display: showFirstBtn ? "block" : "none"
            }}
            onClick={() => {
              handleFirstAccept()
              numRandom = 3
            }}
            src="metaverse/windownPopup/UI_ingame_popup_accept.png"></img>

          <img className="popupClose"
            style={{
              display: showFirstBtn && numRandom > 0 ? "block" : "none"
            }}
            onClick={
              btnPurchaseRand
            }
            src="metaverse/windownPopup/UI_ingame_close.png"></img>

          {/* Buy more */}
          <img className="popupBoder"
            style={{
              display: showBtn ? "block" : "none"
            }}
            src="metaverse/windownPopup/UI_ingame_popup_custom.png"
          />
          <img className="popupAccept"
            style={{
              display: showBtn ? "block" : "none"
            }}
            onClick={() => {
              handleAccept()
              numRandom = 3
            }}
            src="metaverse/windownPopup/UI_ingame_popup_accept.png"></img>
          <img className="popupClose"
            style={{
              display: showBtn && numRandom > 0 ? "block" : "none"
            }}
            onClick={btnRand}
            src="metaverse/windownPopup/UI_ingame_close.png"></img>

          <span style={{
            position: "absolute",
            top: "7.5%",
            left: "3%",
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
