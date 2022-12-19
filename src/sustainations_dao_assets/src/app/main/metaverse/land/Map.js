import { useSelector } from "react-redux";
import { useState, useCallback, useEffect, useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import Back from "./Back";
import Footer from "./footer";
import "./styles.css";
import Farm from "./Farm"
import Loading from "./loading"
import { selectUser } from "app/store/userSlice";


import {
  // buyLandSlot,
  randomLandSlot,
  // createLandSlot,
  loadLandBuyingStatus,
  loadNationsfromCenter,
  //loadLandSlotsfromCenter,
  // loadTileSlots,
  getLandIndex,
  // getUserInfo,
  // loadNation,
  unionLandSlots,
} from '../LandApi'
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import BigMap from "./BigMap";
import Land from "./Land";
import { useNavigate } from "react-router-dom";

var country = null
var numRandom = 3
var nationData = []
var landSlotRand = null
export var mapZoom = 0

const Map = () => {

  const user = useSelector(selectUser)
  const { principal } = user;
  const loadNations = async (i, j) => {
    nationData = await loadNationsfromCenter(i, j);
  }
  const map = useMap()
  const [purchaseBtn, setPurchaseBtn] = useState(true)
  const [modeBtn, setModeBtn] = useState(false)
  const [alert, setAlert] = useState(false)
  const [render, setRender] = useState(true)
  const [farmProperties, setFarmProperties] = useState(null)
  const [mode, setMode] = useState('land')
  const [loading, setLoading] = useState("loadingmap")
  const navigate = useNavigate()
  // get lnglat center
  const [position, setPosition] = useState(() => map.getCenter())
  const [hasEffect, setHasEffect] = useState(false)
  mapZoom = map.getZoom()
  // position is value coord center screen
  useEffect(() => {
    const initial = async () => {
      if (loading === "loadingmap") {
        country = (await user.actor.readNation())?.ok;
        if (country === undefined) {
          await loadNations(0, 0)
          setLoading("none")
        } else {
          await loadNations(Number(country.indexRow), Number(country.indexColumn));
          map.setView([Number(nationData[0].geometry.coordinates[0][0][1]), Number(nationData[0].geometry.coordinates[0][0][0])], 13)
          setLoading("none")
        }
        if ((await user.actor.readUserHasLandEffect())?.ok) {
          setHasEffect(true)
        }
      }
    }
    initial()
  }, [])

  let index = getLandIndex(position)

  const onMove = useCallback(async () => {
    setPosition(map.getCenter())

  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    // if (index != undefined) {
    //   loadNations(index[0], index[1])
    // }
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
    if (country.properties.id === principal) {
      if (!hasEffect) {
        layer.setStyle({
          color: "#002E5E",
          fillColor: "#002E5E",
          fillOpacity: ".75"
        })
      } else {
        layer.setStyle({
          color: "yellow",
          fillColor: "#002E5E",
          fillOpacity: ".75"
        })
      }
    } else {
      layer.setStyle({
        color: "#48c3c8",
        fillColor: "#48c3c8",
        fillOpacity: ".75"
      })
    }


    layer.on({
      click: async (e) => {
        // console.log(country.properties);
        if (country.properties.id === principal) {
          setModeBtn(true)
          setPurchaseBtn(false)
          setFarmProperties(country.properties)
          console.log("country: ", user.profile.username)
        }
      },

      mouseover: async (e) => {
        if (country.properties.id === principal) {
          layer.bindPopup(`<p><b>${"Your LandSlot"}</b><p/>`).openPopup();
        } else {
          let userName = (await user.actor.getProfileByPrincipal(country.properties.id)).ok.username[0]
          layer.bindPopup(`<p> USER : <b>${userName || "Unknow Username"}</b><p/>`).openPopup();
        }
      },

      mouseout: (e) => {
        layer.closePopup();
      },
    });
    // handle click on poligon
  }

  const handleChangeMode = () => {
    console.log(farmProperties);
    navigate('/metaverse/farm', {
      state: farmProperties
    })
  }

  const handlePurchase = async () => {
    setLoading("purchased")
    let landBuyingStatus = await loadLandBuyingStatus()
    if (landBuyingStatus != undefined) {
      numRandom = Number(landBuyingStatus.properties.randomTimes)
      map.setView([Number(landBuyingStatus.geometry.coordinates[0][0][1]), Number(landBuyingStatus.geometry.coordinates[0][0][0])], 13)
      landSlotRand = landBuyingStatus
    }
    else {
      // if having enough ICP
      // let isBuy = (await user.actor.buyLandSlot())?.ok;
      // if (isBuy !== undefined) {
        numRandom -= 1
        landSlotRand = await randomLandSlot()
        // await user.actor.updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom)
        map.setView([landSlotRand.geometry.coordinates[0][0][1], landSlotRand.geometry.coordinates[0][0][0]], 13)
      // } else {
      //   // if not having enough ICP
      //   setAlert(true)
      // }
    }
    setPurchaseBtn(false)
    setLoading("none")
  }

  const handleAccept = async () => {
    setLoading("accept")
    let landBuyingStatus = await loadLandBuyingStatus()
    let country = (await user.actor.readNation())?.ok

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
    await user.actor.createLandSlot(landBuyingStatus.properties.i, landBuyingStatus.properties.j, nationUTMS[0][0], 20, "N", 1000)
    numRandom = 3
    landSlotRand = []
    await loadNations(Number(landBuyingStatus.properties.i), Number(landBuyingStatus.properties.j))
    let checkEffect = (await user.actor.readUserHasLandEffect())?.ok
    console.log("checkEffect", checkEffect)
    if (checkEffect) {
      setHasEffect(true)
    }
    map.setView([Number(landBuyingStatus.geometry.coordinates[0][0][1]), Number(landBuyingStatus.geometry.coordinates[0][0][0])], 13)
    setLoading("none")
    setPurchaseBtn(true)
  }

  const handleTryAgain = async () => {
    setLoading("try")
    landSlotRand = await randomLandSlot()
    map.setView([landSlotRand.geometry.coordinates[0][0][1], landSlotRand.geometry.coordinates[0][0][0]], 13)
    numRandom -= 1
    // await user.actor.updateLandBuyingStatus(landSlotRand.properties.i, landSlotRand.properties.j, numRandom)
    setLoading("none")
  }
  return (
    <>
      {loading !== "loadingmap" ?
        <div>
          <BigMap />
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
                  >{!alert ? "Do you want to receive this land slot with 0.0004 icp ?" : "You do not have enough ICP to make this transaction !"}</h1>
                </div>
                {!alert ? <>
                  {loading === "accept" ? <h2 className="popupAccept"
                    style={{
                      display: purchaseBtn ? "none" : "block"
                    }}><i className="fa fa-spinner fa-spin"></i> LOADING</h2> : <h2 className="popupAccept"
                      style={{
                        display: purchaseBtn || loading === "try" ? "none" : "block"
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
                      display: purchaseBtn || numRandom <= 0 || loading === "accept" ? "none" : "block",
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
          </div>
        </div> : <Loading />}
    </>
  )
}

const MapContainer = () => {
  return <Land>
    <Map />
  </Land>
}

export default MapContainer;