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

const Farm = ({ mapFeatures, landSlotProperties }) => {
  const user = useSelector(selectUser)
  console.log("user: ", user)
  const { principal } = user;
  const [tileplant, setTileplant] = useState(mapFeatures)
  const [inventory, setInventory] = useState([])
  const [mode, setMode] = useState('farm')
  useEffect(() => {
    const load = async () => {
      const inv = await listInventory(principal)
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

  useEffect(() => {
    const interval = setInterval(async () => {
      setTime(Date.now());
      let tile = await loadTileSlots(landSlotProperties)
      setTileplant(tile)
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const latlng = tileplant.map(feature => {
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
        for (let i = 0; i < inventory.length; i++) {
          if (inventoryStatus[inventory[i].materialName] === true && country.properties.name === "None" && inventory[i].amount > 0) {
            console.log("Plant tree status: ", await plantTree(country.properties.landId, country.properties.i, country.properties.j, inventory[i].materialId))
            await subtractInventory(inventory[i].id)
            let tile = await loadTileSlots(landSlotProperties)
            let inv = await listInventory(principal)
            setTileplant(tile)
            setInventory(inv.ok)
          }
        }
      }
    });
  }
  console.log(inventory)
  return (
    <>
      {mode === 'farm' ? <>
        <GeoJSON key={Math.floor(Math.random() * 9999)} data={tileplant} onEachFeature={onEachLandSlot} />
        <CreateBound {...{ latlng, tileplant }}></CreateBound>
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

const CreateBound = ({ latlng, tileplant }) => {
  let path = "metaverse/farm/Sustaination_farm/farm-object/PNG/"
  return (
    <>
      {tileplant.map((tag, value) => {
        let pathItem = path + tag.properties.status + "-" + tag.properties.name + ".png"

        if (tag.properties.name === "None") {
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

// const ShowPlant = ({ inventory }) => {

//   return (
//     <>
//       {inventory.length > 0 ? <div>
//         {inventory.map(plant => {
//           if (plant.position.length > 0) {
//             console.log("plant: ", plant)
//             
//             return (
//               plant.position.map((item) => {
//                 console.log("item: ", item)
//                 return (
//                   <ImageOverlay key={Math.floor(Math.random() * 9999)} url={pathItem}
//                     bounds={[[item[0][0][1], item[0][0][0]], [item[0][2][1], item[0][2][0]]]} />
//                 )
//               }))
//           }
//           else
//             return null
//         })}
//       </div> : null}
//     </>
//   )
// }
export default Farm;
