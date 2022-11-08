import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { GeoJSON, useMap, useMapEvents, ImageOverlay } from "react-leaflet";
import "./styles.css";
import UIFarm from "./FarmUI"
import Map from "./Map"
import {
  listInventory,
  plantTree
} from '../LandApi'

var inventoryStatus = { dig: false }

const Farm = ({ mapFeatures }) => {
  const user = useSelector(selectUser)
  const { principal } = user;

  const [inventory, setInventory] = useState([])
  const [mode, setMode] = useState('farm')

  useEffect(() => {
    const load = async () => {
      const inv = await listInventory(principal)
      setInventory(inv.ok)
    }
    load(); // run it, run it
  }, []);
  console.log("Inventory: ",inventory)
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

  const latlng = mapFeatures.map(feature => {
    return feature.geometry.coordinates[0].map(item => {
      return [item[1], item[0]]
    })
  });

  var posLand = []
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
        console.log("country: ", country)
        for (let i = 0; i < inventory.length; i++) {
          if (inventoryStatus[inventory[i].materialName] === true) {
            console.log("plant", inventory[i].materialName, inventory[i].materialId)
            console.log(await plantTree(mapFeatures[0].properties.landId, country.properties.i, country.properties.j, inventory[i].materialId)
          )}
          // console.log(country.geometry.coordinates, inventory[i].position, country.geometry.coordinates.includes(inventory[i].position))
          // if (inventoryStatus[inventory[i].name] === true) {
          //   if (inventory[i].amount > 0) {
          //     inventory[i].position.push(country.geometry.coordinates)
          //     inventory[i].amount--
          //   }
          // }
          // // console.log(inventoryStatus)
          // else if (inventoryStatus.dig === true) {
          //   for (let j = 0; j < inventory[i].position.length; j++) {
          //     if (JSON.stringify(inventory[i].position[j]) === JSON.stringify(country.geometry.coordinates)) {
          //       inventory[i].position.splice(j, 1)
          //     }
          //   }
          // }
        }
      }
    });
  }

  return (
    <>
      {mode === 'farm' ? <>
        <GeoJSON key={Math.floor(Math.random() * 9999)} data={mapFeatures} onEachFeature={onEachLandSlot} />
        <CreateBound {...{ latlng, posLand }}></CreateBound>
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
          {inventory.map((key, value) => {
            if (key.materialName !== "wood" && key.materialName !== "seed") {
              let pathItem = path + key.materialName + '-icon.png'
              return (
                <div className="imgItem" key={value}>
                  <img
                    onClick={() => {
                      inventoryStatus[key.materialName] = !inventoryStatus[key.materialName]
                      initialInventory(key.materialName)
                    }}
                    src={pathItem}
                    alt=""
                  />
                  <div className="top-right">{key.amount.toString()}</div>
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

const CreateBound = ({ latlng, posLand }) => {
  return (
    <>
      {posLand.map((tag, value) => {
        return (
          <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[latlng[tag][1], latlng[tag][3]]} />
        )
      })}
    </>
  )
}

const ShowPlant = ({ inventory }) => {
  let path = "metaverse/farm/Sustaination_farm/farm-object/PNG/"

  return (
    <>
      {inventory.length > 0 ? <div>
        {inventory.map(plant => {
          if (plant.position.length > 0) {
            console.log("plant: ", plant)
            let pathItem = path + "growing-" + plant.materialName + ".png"
            return (
              plant.position.map((item) => {
                console.log("item: ", item)
                return (
                  <ImageOverlay key={Math.floor(Math.random() * 9999)} url={pathItem}
                    bounds={[[item[0][0][1], item[0][0][0]], [item[0][2][1], item[0][2][0]]]} />
                )
              }))
          }
          else
            return null
        })}
      </div> : null}
    </>
  )
}
export default Farm;
