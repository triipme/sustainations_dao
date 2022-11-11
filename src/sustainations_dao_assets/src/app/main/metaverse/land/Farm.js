import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { GeoJSON, useMap, useMapEvents, ImageOverlay } from "react-leaflet";
import "./styles.css";
import UIFarm from "./FarmUI"
import Map from "./Map"
import {
  subtractInventory,
  loadTileSlots,
  listInventory,
  plantTree
} from '../LandApi'

var inventoryStatus = { dig: false }
var positionTree = -1
const Farm = ({ mapFeatures, landSlotProperties }) => {
  const user = useSelector(selectUser)
  const [tileplant, setTileplant] = useState(mapFeatures)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('farm')
  const [characterId, setChacterId] = useState("")

  useEffect(() => {
    const load = async () => {
      const characterid = await user.actor.readCharacter()
      setChacterId(characterid.ok[0])
      const inv = await listInventory(characterid.ok[0])
      setInventory(inv.ok)
    }
    load(); // run it, run it
  }, []);
  useEffect(() => {
    const loadinventoryStatus = async () => {
      for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].materialName !== "wood" && inventory[i].materialName !== "seed") {
          inventoryStatus[inventory[i].materialName] = false
        }
      }
    }
    loadinventoryStatus();
  }, [inventory]);

  const [time, setTime] = useState(Date.now());

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     setTime(Date.now());
  //     let tile = await loadTileSlots(landSlotProperties)
  //     setTileplant(tile)
  //   }, 10000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);


  var posLand = []
  let cnt = -1
  for (let i = 0; i < 100; i++) {
    posLand.push(i)
  }
  const onEachLandSlot = (country, layer) => {
    layer.setStyle({
      color: "#FFFFFF",
      fillColor: "#FFFFFF",
      fillOpacity: "0.1"
    })
    layer.on({
      click: async (e) => {
        for (let i = 0; i < inventory.length; i++) {
          if (inventoryStatus[inventory[i].materialName] === true && country.properties.name === "None" && inventory[i].amount > 0 && loading === false) {
            setLoading(true)
            positionTree = country.properties.i * 10 + country.properties.j
            console.log("Plant tree status: ", await plantTree(country.properties.landId, country.properties.i, country.properties.j, inventory[i].materialId))
            await subtractInventory(inventory[i].id)
            let tile = await loadTileSlots(landSlotProperties)
            let inv = await listInventory(characterId)
            setTileplant(tile)
            setInventory(inv.ok)
            setLoading(false)
            positionTree = -1
          }
        }
      }
    });
  }
  console.log(positionTree)
  return (
    <>
      {mode === 'farm' ? <>
        <GeoJSON key={Math.floor(Math.random() * 9999)} data={tileplant} onEachFeature={onEachLandSlot} />
        <CreateBound {...{ tileplant, loading }}></CreateBound>
        <UIFarm></UIFarm>
        <Inventory inventory={inventory}></Inventory>
        {/* <ShowPlant inventory={inventory}></ShowPlant> */}
        <button className="button-85" style={{ top: "250px" }} onClick={() => {
          setMode('land'); location.reload();
        }}>Go to map mode</button>
      </> : <Map></Map>}

    </>
  )
}

const Inventory = ({ inventory }) => {
  function initialInventory(item) {
    for (const property in inventoryStatus) {
      if (property !== item)
        inventoryStatus[property] = false
    }
  }
  const [color, setColor] = useState(-1)

  let path = "/metaverse/farm/Sustaination_farm/farm-object/PNG/"
  return (
    <div className="farmItem">
      <div className="imgItem" key={101}>
        <img
          onClick={() => {
            inventoryStatus["dig"] = !inventoryStatus["dig"]
            initialInventory("dig")
          }}
          src={"/metaverse/farm/Sustaination_farm/farm-object/PNG/shovel.png"}
          alt=""
        />
      </div>
      {inventory.length > 0 ?
        <>
          {inventory.map((value, i) => {
            if (value.materialName !== "wood" && value.materialName !== "seed") {
              let bgColor
              
              let pathItem = path + value.materialName + '-icon.png'
              return (
                <div className="imgItem" key={i} >
                  <img
                    style={{ backgroundColor: i == color && inventoryStatus[value.materialName] == true ? "#000" : "#FFF"}}
                    onClick={() => {
                      inventoryStatus[value.materialName] = !inventoryStatus[value.materialName]
                      initialInventory(value.materialName)
                      setColor(i)
                    }}
                    src={pathItem}
                    alt=""
                  />
                  <div className="top-right">{value.amount.toString()}</div>
                </div>
              )
            } else {
              <></>
            }
          })}
        </> : null}
    </div>
  )
}

const CreateBound = ({ tileplant, loading }) => {
  let path = "metaverse/farm/Sustaination_farm/farm-object/PNG/"
  return (
    <>
      {tileplant.map((tag, value) => {
        let pathItem = path + tag.properties.status + "-" + tag.properties.name + ".png"
        if (loading === true && positionTree == tag.properties.i * 10 + tag.properties.j) {
          return (
            <>
              <ImageOverlay key={value * 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              <ImageOverlay key={value} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
            </>
          )
        }
        else if (tag.properties.name === "None") {
          return <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
        }
        else if (tag.properties.status === "newlyPlanted") {
          return <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-object/PNG/newlyPlanted.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
        }
        else {
          return <ImageOverlay key={value} url={pathItem} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
        }
      })}
    </>
  )
}

export default Farm;
