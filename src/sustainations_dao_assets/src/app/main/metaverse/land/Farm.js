import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { GeoJSON, useMap, useMapEvents, ImageOverlay, MapContainer } from "react-leaflet";
import "./styles.css";
import UIFarm from "./FarmUI";
import {
  loadTileSlots,
  listStash
} from "../LandApi";
import Land from "./Land";
import BigMap from "./BigMap";
import Loading from "./loading";
import Back from "./Back"
import { useLocation, useNavigate } from "react-router-dom";

var inventoryStatus = {};
var positionTree = -1
const Farm = ({ mapFeatures, landSlotProperties }) => {
  const user = useSelector(selectUser);
  const [tileplant, setTileplant] = useState(mapFeatures);
  const [inventory, setInventory] = useState([]);
  const [characterId, setChacterId] = useState("");
  const [loading, setLoading] = useState(false)
  const [carrot, setCarrot] = useState(0)
  const [wheat, setWheat] = useState(0)
  const [tomato, setTomato] = useState(0)
  const map = useMap();
  const navigate = useNavigate();

  // const numPlantHarvest = (arr) => {
  //   return arr.reduce((previousValue, currentValue) => previousValue + Number(currentValue.amount), 0)
  // }
  useEffect(() => {
    const load = async () => {
      const characterid = await user.actor.readCharacter();
      setChacterId(characterid.ok[0]);
      const inv = await user.actor.listInventory(characterid.ok[0]);
      const listStash = (await user.actor.listStash()).ok
      console.log(listStash)

      const defineAmount = (item, usableItemName) => {
        if (usableItemName === "Carrot") {
          setCarrot(Number(item.amount))
        } else if (usableItemName === "Wheat") {
          setWheat(Number(item.amount))
        } else {
          setTomato(Number(item.amount))
        }
      }
      listStash.forEach(item => defineAmount(item, item.usableItemName))
      setInventory(inv.ok);
    };
    load();
    map.setView(
      [
        Number(tileplant[0].geometry.coordinates[0][0][1]),
        Number(tileplant[0].geometry.coordinates[0][0][0])
      ],
      17
    );
  }, []);
  useEffect(() => {
    const loadinventoryStatus = () => {
      inventoryStatus["dig"] = false;
      for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].materialName !== "wood" && inventory[i].materialName !== "seed") {
          inventoryStatus[inventory[i].materialName] = false;
        }
      }
    };
    loadinventoryStatus();
  }, [inventory]);

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(async () => {
      setTime(Date.now());
      let tile = await loadTileSlots(landSlotProperties);
      setTileplant(tile);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const latlng = useMemo(
    () =>
      tileplant?.map(feature => {
        return feature.geometry.coordinates[0].map(item => {
          return [item[1], item[0]];
        });
      }),
    []
  );

  const onEachLandSlot = (country, layer) => {
    layer.setStyle({
      color: "#FFFFFF",
      fillColor: "#FFFFFF",
      fillOpacity: "0.1"
    });
    layer.on({

      click: async e => {
        let currentSeed = inventory.filter((item) => inventoryStatus[item.materialName] === true)
        // Harvest
        if (country.properties.status === "fullGrown" && inventoryStatus["dig"] === false && loading === false) {
          setLoading(true)
          positionTree = country.properties.i * 10 + country.properties.j

          console.log("Harvest", await user.actor.harvestTree(country.properties.tileId))
          setTileplant(await loadTileSlots(landSlotProperties));
          const listStash = (await user.actor.listStash()).ok
          const defineAmount = (item, usableItemName) => {
            if (usableItemName === "Carrot") {
              setCarrot(Number(item.amount))
            } else if (usableItemName === "Wheat") {
              setWheat(Number(item.amount))
            } else {
              setTomato(Number(item.amount))
            }
          }
          listStash.forEach(item => defineAmount(item, item.usableItemName))
          setLoading(false)
          positionTree = -1
        }
        // Planting
        else if (
          inventoryStatus[currentSeed[0].materialName] === true &&
          country.properties.name === "None" &&
          currentSeed[0].amount > 0 && loading === false
        ) {
          setLoading(true)
          positionTree = country.properties.i * 10 + country.properties.j

          console.log(
            "Plant tree status: ",
            await user.actor.plantTree(
              country.properties.landId,
              country.properties.i,
              country.properties.j,
              currentSeed[0].materialId
            )
          );
          await user.actor.subtractInventory(currentSeed[0].id);
          setTileplant(await loadTileSlots(landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);
          setLoading(false)
          positionTree = -1
        } else if (inventoryStatus["dig"] === true && loading === false) { // Remove
          setLoading(true)
          positionTree = country.properties.i * 10 + country.properties.j
          console.log("Remove: ", await user.actor.removeTree(country.properties.tileId))
          setTileplant(await loadTileSlots(landSlotProperties));
          setLoading(false)
          positionTree = -1
        }
      }
    });
  };
  return (
    <>
      <GeoJSON
        key={Math.floor(Math.random() * 9999)}
        data={tileplant}
        onEachFeature={onEachLandSlot}
      />
      <CreateBound {...{ latlng, tileplant, loading }}></CreateBound>
      <UIFarm Carrot={carrot} Wheat={wheat} Tomato={tomato}></UIFarm>
      <Inventory inventory={inventory}></Inventory>
      {/* <ShowPlant inventory={inventory}></ShowPlant> */}


    </>
  );
};

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

              let pathItem = path + value.materialName + '-icon.png'
              return (
                <div className="imgItem" key={i} >
                  <img
                    style={{ backgroundColor: i == color && inventoryStatus[value.materialName] == true ? "#FFF" : "#FFF" }}
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

const CreateBound = ({ latlng, tileplant, loading }) => {
  let path = "metaverse/farm/Sustaination_farm/farm-object/PNG/";
  return (
    <>
      {tileplant.map((tag, value) => {
        let pathItem = path + tag.properties.status + "-" + tag.properties.name + ".png"
        if (tag.properties.name === "None") {
          return (
            <>
              <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree == tag.properties.i * 10 + tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
            </>
          )
        }
        else if (tag.properties.status === "newlyPlanted") {
          return (
            <>
              <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-object/PNG/newlyPlanted.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree == tag.properties.i * 10 + tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}

            </>
          )
        }
        else {
          return (
            <>
              <ImageOverlay key={value} url={pathItem} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree == tag.properties.i * 10 + tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
            </>
          )
        }
      })}
    </>
  );
};

function FarmContainer() {
  const user = useSelector(selectUser);
  const { state: properties } = useLocation();
  const [farmFeatures, setFarmFeatures] = useState();
  const [farmProperties, setFarmProperties] = useState(properties);
  const [indexFarm, setIndexFarm] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [listFarm, setListFarm] = useState(0)
  useEffect(() => {
    (async () => {
      let myFarmProperties = (await user.actor.listUserLandSlots())?.ok
      if (myFarmProperties) {
        let myFarm = {
          id: myFarmProperties[indexFarm].id,
          zoneNumber: myFarmProperties[indexFarm].zoneNumber,
          zoneLetter: myFarmProperties[indexFarm].zoneLetter,
          i: myFarmProperties[indexFarm].indexRow,
          j: myFarmProperties[indexFarm].indexColumn,
        };
        setFarmProperties(myFarm);
        setFarmFeatures(await loadTileSlots(myFarm));
        setListFarm(Object.keys(myFarmProperties).length)
      }
      setIsDone(true)
      // }
    })();
  }, [indexFarm]);

  return (
    <Land>
      {isDone === true ? (
        <>
          {farmFeatures ? <>
            <BigMap />
            <Back />

            {indexFarm > 0 ? <button
              className="btn-farm"
              style={{ top: "250px", left: "50px" }}
              onClick={() => {
                setIsDone(false)
                setIndexFarm(indexFarm - 1)
              }}>
              Previous Farm
            </button> : <></>}
            {indexFarm < listFarm - 1 ? <button
              className="btn-farm"
              style={{ top: "250px", right: "50px" }}
              onClick={() => {
                setIsDone(false)
                setIndexFarm(indexFarm + 1)
              }}>
              Next Farm
            </button> : <></>}
            <Farm mapFeatures={farmFeatures} landSlotProperties={farmProperties} />
          </> : (
            <div style={{
              backgroundColor: "#111827", width: "100%", height: "100%", display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}>
              <div>
                <Back />

                <img style={{

                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "50%"
                }} src="metaverse/sustainations-logo.png" />
                <h1 style={{ display: "block", textAlign: "center" }}>YOU DON'T HAVE ANY LAND SLOT !!!</h1><br></br>
                <h1 style={{ textAlign: "center", color: "white", cursor: "pointer", backgroundColor: "orange", margin: "0 200px" }} onClick={() => {
                  window.location.replace("/metaverse/land");
                }}>Click here to go to buy land slot</h1>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </Land>
  );
}

export default FarmContainer;