import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, MapContainer, useMap, useMapEvents, TileLayer, Rectangle, ImageOverlay } from "react-leaflet";
import Back from "./Back";
import mapData from "./data/land_size_100_10x10_zone_20.json";
import Footer from "./footer";
import L, { CRS, LatLngBounds, Icon } from 'leaflet';
import "./styles.css";
import BigMap from "./map.js";
import {
  buyLandSlot,
  createLandSlot,
  getUserInfo,
  loadLandSlots,
  updateLandBuyingStatus
} from '../GameApi';

let ownerId = 3
let cr_land = 0
var numRandom = 3
let availableLand = false
let offBtn1 = false
let offBtn2 = true
let inventory = { tomato: false, dig: false }
const latlng = mapData.features.map(feature => {
  return feature.geometry.coordinates[0].map(item => {
    return [item[1], item[0]]
  })
});

// console.log(latlng)
mapData.features.map(feature => {
  return feature.properties.hasLand = false
});

const Map = () => {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [land, setLand] = useState(-1)
  const [purchased2, setPurchased2] = useState(false)
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
  // console.log(mapData)
  const [purchased1, setPurchased1] = useState(prch)

  let cnt = 0
  let flag = true
  let idCrop = -1
  const map = useMap()
  map.on('click', function (e) {
    if (mode === "farm") {
      setRender(!render)
    }
  });

  var pos = []
  mapData.features.map(feature => {
    idCrop++
    if (feature.properties.hasLand === true) {
      pos.push(idCrop)
    }
  })

  console.log(pos)

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

  const mapEvents = useMapEvents({
    zoomend: e => {
      if (mapEvents.getZoom() > 15) {
        setMode('farm')
      } else if (mapEvents.getZoom() <= 15)
        setMode('land')
    }
  });
  let zoom = mapEvents.getZoom()
  console.log(zoom, mapEvents.getCenter())

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
          if (purchased1 && !purchased2) {
            do {
              var temp = Math.floor(Math.random() * 99)
              if (!mapData.features[temp].properties.ownerId && temp !== land) {
                //To mau
                mapData.features[temp].properties.ownerId = ownerId
                cr_land = temp
                flag = false
              }
            }
            while (flag)
          } else if (purchased2) {
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
                if (purchased2) {
                  console.log('run')
                  mapData.features[temp].properties.ownerId = ownerId
                  cr_land = temp
                }
                flag = false
              }
            }
            while (flag)
          }

        } else if (!country.properties.ownerId) {

          if (purchased2) {
            country.properties.ownerId = ownerId
            cr_land = land
            console.log('run p2', purchased2)
            layer.options.fillColor = "#48C3C8"
          }
          else if (purchased1) {
            country.properties.ownerId = ownerId
            layer.options.fillColor = "#48C3C8"
            console.log('run p1')
            cr_land = land
          }
          if (show1 || show2)
            layer.options.fillColor = "#48C3C8"
          console.log(purchased2, land, mapData.features[land].properties)
        }
      } else if (country.properties.ownerId) {
        layer.options.fillColor = "#FFFFFF"
      } else {
        layer.options.fillColor = "#002E5E";
      }
      cnt++


    } else if (mode === 'farm') {
      setPurchased2(false)
      setPurchased1(false)
      layer.setStyle({
        color: "#002E5E",
        // fillColor: "#002E5E",
        // fillOpacity: ".75"
      })
      layer.on({
        click: function (e) {
          checkTile(mapData, latlng, e.latlng.lat, e.latlng.lng)
          layer.setStyle({
            fillColor: "#FAA61A"
          })
        },
        mouseout: function (e) {
          if (!country.properties.ownerId)
            this.setStyle({
              fillColor: "#002E5E"
            })
        },

      });

    }
  }

  const btnPurchaseRand = () => {
    
    setShow1(true)
    numRandom -= 1
    let landIdRand
    do {
      landIdRand = Math.floor(Math.random() * 99);
      console.log('show1', landIdRand)
    } while (mapData.features[landIdRand].properties.ownerId && land !== landIdRand)
    if (landIdRand !== land)
    {
      setLand(landIdRand)
    }
    else setRender(!render)
    updateLandBuyingStatus(
      mapData.features[landIdRand].properties.zone,
      [mapData.features[landIdRand].properties.i,mapData.features[landIdRand].properties.j],
      numRandom
    )
  }
  console.log(purchased2)


  const btnRand = () => {
    setShow2(true)
    setPurchased1(false)
    setPurchased2(false)
    let dem = 0
    mapData.features.map(feature => {
      if (feature.properties.ownerId === ownerId) {
        listLand.push(dem)
        console.log(dem)
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
      console.log(land)
      if (!mapData.features[temp].properties.ownerId && land !== temp) {
        fl = false
      }
    }
    while (fl)
    setLand(temp)
    updateLandBuyingStatus(
      mapData.features[temp].properties.zone,
      [mapData.features[temp].properties.i,mapData.features[temp].properties.j],
      numRandom
    )
  }

  return (
    <>
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      {mode !== 'farm' && <Back />}
      {mode !== 'farm' && <Footer />}
      <GeoJSON key={Math.floor(Math.random() * 9999)} data={mapData.features} onEachFeature={onEachLandSlot} />
      {mode !== 'farm' && <div>
        <button className="button-85" onClick={async () => { offBtn1 = true; btnPurchaseRand(); await buyLandSlot(); console.log("USER INFO"); console.log(await getUserInfo()); }} style={{
          left: 50,
          top: 100,
          zIndex: 10000,
          display: offBtn1 ? "none" : "block"
        }}>Purchase</button>
        <button className="button-85" style={{
          left: 50,
          top: 100,
          zIndex: 10000,
          display: offBtn2 ? "none" : "block"
        }} onClick={() => { offBtn2 = true; btnRand() }}>UserId random</button>

        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "20%",
            zIndex: 1000,
          }}
        >
          <img className="popup"
            style={{
              width: "50%",
              height: "50%",
              opacity: 0.5,
              display: show1 ? "block" : "none"
            }}
            src="metaverse/windownPopup/UI_ingame_popup_custom.png"
            alt=""
          />

          <img
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "62%",
              left: "15%",
              width: "20%",
              height: "20%",
              display: show1 ? "block" : "none"
            }}
            onClick={async () => {     
              createLandSlot (
                mapData.features[land].properties.zone,
                [mapData.features[land].properties.i,mapData.features[land].properties.j]
              )
              console.log("USER LANDSLOTS:")
              console.log(await loadLandSlots())
              setPurchased1(true)
              setShow1(false)
              numRandom = 3
              offBtn1 = true
              offBtn2 = false
            }}
            src="metaverse/windownPopup/UI_ingame_popup_accept.png"></img>
          <img
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "8%",
              right: "48%",
              width: "8%",
              height: "16%",
              display: show1 && numRandom > 0 ? "block" : "none"
            }}
            onClick={
              btnPurchaseRand
            }
            src="metaverse/windownPopup/UI_ingame_close.png"></img>
        </div>


        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "20%",
            zIndex: 1000,
          }}
        >
          <img className="popup"
            style={{
              width: "50%",
              height: "50%",
              opacity: 0.5,
              display: show2 ? "block" : "none"
            }}
            src="metaverse/windownPopup/UI_ingame_popup_custom.png"
          />
          <img
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "62%",
              left: "15%",
              width: "20%",
              height: "20%",
              display: show2 ? "block" : "none"
            }}
            onClick={async () => {
              console.log(mapData.features[land].properties.i,mapData.features[land].geometry.coordinates)
              createLandSlot (
                mapData.features[land].properties.zone,
                [mapData.features[land].properties.i,mapData.features[land].properties.j],
                mapData.features[land].geometry.coordinates[0]
              )
              console.log("USER LANDSLOTS:")
              console.log(await loadLandSlots())
              setPurchased2(true)
              setShow2(false)
              numRandom = 3
              offBtn2 = false
            }}
            src="metaverse/windownPopup/UI_ingame_popup_accept.png"></img>
          <img
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "8%",
              right: "48%",
              width: "8%",
              height: "16%",
              display: show2 && numRandom > 0 ? "block" : "none"
            }}
            onClick={() => btnRand()}
            src="metaverse/windownPopup/UI_ingame_close.png"></img>


        </div>
        <span style={{
          position: "absolute",
          top: "8%",
          left: "48%",
          display: (!offBtn2 && offBtn1) || (!offBtn1 && offBtn2) ? "none" : "block"
        }}>Num random: {numRandom}</span>

      </div>}
      {/* <CreateMap></CreateMap> */}
      {mode === 'farm' && <Create {...{ latlng, pos }}></Create>}
      {mode === 'farm' && <Navigation></Navigation>
      }
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

const Create = ({ latlng, pos }) => {
  console.log(pos)
  return (
    pos.map(tag => {
      return (
        <ImageOverlay key={tag} url={'metaverse/farm/Sustaination_farm/Farm object/SVG/farm object_4 ca chua 2 .svg'} bounds={[latlng[tag][1], latlng[tag][3]]} />
      )
    })
  )
}
function Navigation() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 35,
          top: 100,
          zIndex: 10000,
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
          src="/metaverse/farm/Sustaination_farm/Farm object/PNG/farm object_phan bon 1.png"
          alt=""
        />
      </div>


    </>

  )
}

const center = [0, -67.485111238625905]
const zoom = 16

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter())

  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
      <button onClick={onClick}>reset</button>
    </p>
  )
}






function Land() {
  const [map, setMap] = useState(null)

  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{height: "100%"}}
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
    <div style={{height: "100%"}}>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  );
}

export default Land;
