import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { GeoJSON, useMap, useMapEvents, ImageOverlay, MapContainer } from "react-leaflet";
import "./farmproduce.css";
import "./styles.css";
import UIFarm from "./FarmUI";
import {
  loadTileSlots,
  listProductStorage,
  constructBuilding
} from "../LandApi";
import Land from "./Land";
import BigMap from "./BigMap";
import Loading from "./loading";
import Back from "./Back";
// import FarmProduce from "./FarmProduce.js";
// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useLocation, useNavigate } from "react-router-dom";

var inventoryStatus = {};
var positionTree = { i: -1, j: -1 }
const Farm = ({ mapFeatures, landSlotProperties }) => {
  const user = useSelector(selectUser);
  const [tileplant, setTileplant] = useState(mapFeatures);
  const [inventory, setInventory] = useState([]);
  const [characterId, setChacterId] = useState("");
  const [loading, setLoading] = useState(false)
  const [carrot, setCarrot] = useState(0)
  const [wheat, setWheat] = useState(0)
  const [tomato, setTomato] = useState(0)
  const [cantBuild, setCantBuild] = useState("")
  const [popupFactory, setPopupFactory] = useState(false)
  const [objectId, setObjectId] = useState("None")
  const map = useMap();
  useEffect(() => {
    const load = async () => {
      const characterid = await user.actor.readCharacter();
      setChacterId(characterid.ok[0]);
      const inv = await user.actor.listInventory(characterid.ok[0]);
      const listProductStorage = (await user.actor.listProductStorage()).ok
      const stash = (await user.actor.listStash()).ok;
      console.log("STASSHHHH", stash)
      const defineAmount = (item, productName) => {
        if (productName === "Carrot") {
          setCarrot(Number(item.amount))
        } else if (productName === "Wheat") {
          setWheat(Number(item.amount))
        } else {
          setTomato(Number(item.amount))
        }
      }
      listProductStorage.forEach(item => defineAmount(item, item.productName))
      setInventory(inv.ok);
    };
    load();
    map.setView(
      [
        Number(tileplant[55].geometry.coordinates[0][0][1]),
        Number(tileplant[55].geometry.coordinates[0][0][0])
      ],
      17
    );
  }, []);
  useEffect(() => {
    const loadinventoryStatus = () => {
      inventoryStatus["dig"] = false;
      inventoryStatus["factory"] = false;
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
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  // const latlng = useMemo(
  //   () =>
  //     tileplant?.map(feature => {
  //       return feature.geometry.coordinates[0].map(item => {
  //         return [item[1], item[0]];
  //       });
  //     }),
  //   []
  // );
  const checkAvailablePosition = (i, j, x) => {
    let result = []
    if (x === 9) {
      result = tileplant.filter(tile => {
        return tile.properties.i >= i && tile.properties.i <= i + 2 && tile.properties.j >= j && tile.properties.j <= j + 2
      }
      )
    } else {
      result = tileplant.filter(tile => {
        return tile.properties.j == j && tile.properties.i >= i && tile.properties.i <= i + 1
      }
      )
    }
    const arr = result.filter(idx => {
      return idx.properties.name !== "None"
    })

    if (arr.length === 0 && result.length === x) {
      return true
    }
    return false
  }
  const onEachLandSlot = (country, layer) => {
    layer.setStyle({
      color: "#FFFFFF",
      fillColor: (country.properties.hasEffectId === "None" || country.properties.hasEffectId === "") ? "#FFFFFF" : "#f6cb1c",
      fillOpacity: (country.properties.hasEffectId === "None" || country.properties.hasEffectId === "") ? "0.1" : "0.4",
    });

    var q = []
    var que = []
    const load = async () => {
      q = (await user.actor.listProductionQueueNodesInfo(country.properties.objectId))?.ok
      que = (q.filter(i => {
        return i.status == "Completed"
      }))
      layer.bindPopup(`<h1>${que.length}/${q.length}</h1>`).openPopup();
    }
    layer.on({
      mouseover: e => {
        if (country.properties.name == "Factory") {
          load()
        }
      },
      click: async e => {
        let currentSeed = inventory.filter((item) => inventoryStatus[item.materialName] === true)

        if (country.properties.name === "Factory" && country.properties.status === "completed" && inventoryStatus["dig"] === false
          && que.length <= q.length && que.length != 0) {
          load()
          setLoading(true)
          positionTree.i = country.properties.i
          positionTree.j = country.properties.j
          console.log(await user.actor.collectUsableItems(country.properties.objectId))
          setTileplant(await loadTileSlots(landSlotProperties));
          setLoading(false)
          positionTree.i = -1
          positionTree.j = -1
        }
        else if (country.properties.name === "Factory" && country.properties.status === "completed" && inventoryStatus["dig"] === false) {
          setObjectId(country.properties.objectId)
          console.log(country.properties.objectId)

          setPopupFactory(true)
        }
        else if (country.properties.status === "fullGrown" && inventoryStatus["dig"] === false && loading === false && country.properties.name !== "Pine_Seed") {
          setLoading(true)
          positionTree.i = country.properties.i
          positionTree.j = country.properties.j

          console.log("Harvest", await user.actor.harvestPlant(country.properties.tileId))
          setTileplant(await loadTileSlots(landSlotProperties));

          const listProductStorage = (await user.actor.listProductStorage()).ok
          const defineAmount = (item, productName) => {
            if (productName === "Carrot") {
              setCarrot(Number(item.amount))
            } else if (productName === "Wheat") {
              setWheat(Number(item.amount))
            } else {
              setTomato(Number(item.amount))
            }
          }
          listProductStorage.forEach(item => defineAmount(item, item.productName))
          setLoading(false)
          positionTree.i = -1
          positionTree.j = -1
        }
        else if (inventoryStatus["dig"] === true && loading === false && country.properties.name !== "None") { // Remove
          setLoading(true)
          positionTree.i = country.properties.i
          positionTree.j = country.properties.j
          console.log("Remove: ", await user.actor.removeObject(country.properties.tileId))
          setTileplant(await loadTileSlots(landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);

          setLoading(false)
          positionTree.i = -1
          positionTree.j = -1
        }
        else if (inventoryStatus["factory"] === true && loading === false && country.properties.name === "None") { // build factory
          setLoading(true)
          positionTree.i = country.properties.i
          positionTree.j = country.properties.j
          if (checkAvailablePosition(positionTree.i, positionTree.j, 9))
            console.log("Build Factory: ", (await user.actor.constructBuilding(country.properties.landId, country.properties.i, country.properties.j, "c1")))
          else {
            setCantBuild("factory")
          }
          setTileplant(await loadTileSlots(landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);
          setLoading(false)
          positionTree.i = -1
          positionTree.j = -1
        }
        else if (currentSeed.length === 0) {
          console.log("Do nothing")
        }
        // Planting
        else if (
          inventoryStatus[currentSeed[0].materialName] === true &&
          country.properties.name === "None" &&
          currentSeed[0].amount > 0 && loading === false
        ) {
          setLoading(true)
          positionTree.i = country.properties.i
          positionTree.j = country.properties.j
          console.log("checkAvailablePosition: ", checkAvailablePosition(positionTree.i, positionTree.j, 2), currentSeed[0].materialName)
          if ((currentSeed[0].materialName === "pine_seed" && checkAvailablePosition(positionTree.i, positionTree.j, 2)) || currentSeed[0].materialName !== "pine_seed") {
            console.log(
              "Plant tree status: ",
              await user.actor.sowSeed(
                country.properties.landId,
                country.properties.i,
                country.properties.j,
                currentSeed[0].materialId
              )
            );
            await user.actor.subtractInventory(currentSeed[0].id);
            setTileplant(await loadTileSlots(landSlotProperties));
            setInventory((await user.actor.listInventory(characterId)).ok);
          } else {
            setCantBuild("pine")
          }

          setLoading(false)
          positionTree.i = -1
          positionTree.j = -1
        }
      }
    });
  };

  const FarmProduce = () => {
    let path = "/metaverse/farm/Sustaination_farm/farm-object/PNG/"
    const [recipes, setRecipes] = useState([])
    const [rcp, setRcp] = useState({})
    const [num, setNum] = useState(-1)
    const [queue, setQueue] = useState([])

    const style = {
      position: 'absolute',
      top: '42%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      borderRadius: "10px",
      width: "30%",
      minWidth: "700px"
    };

    useEffect(() => {
      const load = async () => {
        setRecipes((await user.actor.listAlchemyRecipesInfo())?.ok);
        setQueue((await user.actor.listProductionQueueNodesInfo(objectId))?.ok)
      }
      load();
    }, [])

    if (queue.length != 0) {
      let t = (queue.filter(item => {
        return item.status !== "Completed"
      }))
      if (t.length != 0) {
        let tTime = (recipes.filter(item => {
          return t[0].recipeId == item.id
        }))
        var time = Number(t[0].remainingTime)
        var totalTime = Number(tTime[0].craftingTime)
      }
    }

    return (
      <div
        key={Math.floor(Math.random() * 9999999)}
      >
        {/* <Button sx={{ zIndex: 999999 }} onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={true}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="modal-header">
              <div className="close" onClick={() => { setPopupFactory(false); }}><img src={"/metaverse/" + "close.png"} /></div>
              <h1 style={{
                position: "relative",
                top: "-32px",
                fontSize: "224.5%",
              }}>FACTORY</h1>

            </div>
            <div id="myProgress" style={{ textAlign: "center", alignItems: "center", border: "solid 1px", lineHeight: "28px" }}>
              {time ? <span style={{ position: "absolute", left: "48%" }}>{Math.round(time / 60, 0)} min</span> : <></>}
              <div id="myBar" style={{ width: String(time * 100 / totalTime) + "%" }}></div>
            </div>
            <div className="modal-body" style={{ background: "radial-gradient(circle, rgba(111,149,236,1) 0%, rgba(40,109,232,1) 100%)" }}>
              <div className="scrollmenu">
                {queue.map((item, idx) => {
                  if (item.status == "Completed") {
                    return (
                      <a key={idx}
                        style={{
                          backgroundColor: "#9DC40E",
                          borderRadius: "10px",
                          marginRight: "14px",
                          marginTop: "14px",
                          boxShadow: "1px 1px 1px 1px rgb(0 0 0 / 28%)",
                        }}
                      ><img src={path + "potion/" + item.usableItemName + ".png"} style={{ height: "100px" }} /> </a>
                    )
                  } else {
                    return (
                      <a key={idx} style={{
                        backgroundColor: "#80cbc4",
                        borderRadius: "10px",
                        marginRight: "14px",
                        marginTop: "14px",
                        boxShadow: "1px 1px 1px 1px rgb(0 0 0 / 28%)",
                      }}><img src={path + "potion/" + item.usableItemName + ".png"} style={{ height: "100px" }} /> </a>
                    )
                  }
                })}
              </div>

            </div>
            <div className="modal-body" style={{
              height: "155px",
              background: "radial-gradient(circle, rgba(111,149,236,1) 0%, rgba(40,109,232,1) 100%)"
            }}>
              <div className="scrollmenu-chooser">
                {recipes.map((recipe, idx) => {
                  return (
                    <a
                      key={Math.floor(Math.random() * 9999999)}
                      style={{
                        backgroundColor: idx == num ? "yellow" : "rgba(255, 255, 255, 0.3)",
                        borderRadius: "10px",
                        marginRight: "14px",
                        marginTop: "14px",
                        boxShadow: "1px 1px 1px 1px rgb(0 0 0 / 28%)",

                      }} onClick={() => {
                        setNum(idx)
                        setRcp(recipes[idx])
                      }}>

                      <img src={path + "potion/" + recipe.usableItemName + ".png"} style={{ height: "100px" }} /><div className="text">
                        {recipe.alchemyRecipeDetails.map(item => {
                          return (
                            <div key={Math.floor(Math.random() * 9999999)} className="cal">
                              <img src={path + item.productName + "-icon.png"} style={{ height: "100px" }} />
                              {item.currentAmount.toString()}/{item.requiredAmount.toString()}
                            </div>
                          )
                        })}
                      </div>
                    </a>)
                })}
              </div>
            </div>
            <div className="modal-footer" style={{ display: "flex" }}>
              <h3 style={{ backgroundColor: rcp.canCraft == true ? "#ffa200" : "#cccccc", }} onClick={async () => {
                console.log(objectId)
                if (rcp.canCraft === true && objectId !== "None") {
                  setLoading(true)
                  console.log(await user.actor.craftUsableItem(objectId, rcp.id))
                  setQueue((await user.actor.listProductionQueueNodesInfo(objectId))?.ok)
                  const listProductStorage = (await user.actor.listProductStorage()).ok
                  const defineAmount = (item, productName) => {
                    if (productName === "Carrot") {
                      setCarrot(Number(item.amount))
                    } else if (productName === "Wheat") {
                      setWheat(Number(item.amount))
                    } else {
                      setTomato(Number(item.amount))
                    }
                  }
                  listProductStorage.forEach(item => defineAmount(item, item.productName))
                  setLoading(false)
                }
              }}>{loading ? <i className="fa fa-spinner fa-spin" /> : <span>CRAFT</span>}</h3>
              <h3 style={{
                backgroundColor: queue.filter(item => {
                  return item.status == "Completed"
                }).length > 0 ? "#ffa200" : "#cccccc",
              }}
                onClick={async () => {
                  if (objectId !== "None" && queue.filter(item => {
                    return item.status == "Completed"
                  }).length > 0) {
                    setLoading(true)
                    await user.actor.collectUsableItems(objectId)
                    setLoading(false)
                  }
                }}

              >{loading ? <i className="fa fa-spinner fa-spin" /> : <span>Collect</span>}</h3>
            </div>
          </Box>
        </Modal>
      </div >
    );
  }

  return (
    <>
      {cantBuild !== "" ? <div className="containPopup">
        <div className="popupBoder">
          <img
            src="metaverse/windownPopup/UI_ingame_popup_panel.png" />
          <h1
            style={{
              position: "absolute",
              top: "46%",
              left: "42%",
              transform: "translate(-108%, -80%)",
              fontSize: "136%",
              margin: "2%",
              fontWeight: "bold"
            }}
          >You can not build on this place !</h1>
        </div>
        <h2 className="popupAccept"
          style={{
            left: "16%",
          }}
          onClick={() => {
            setCantBuild("")
          }}>ACCEPT</h2>
      </div> : null}
      <GeoJSON
        key={Math.floor(Math.random() * 9999999)}
        data={tileplant}
        onEachFeature={onEachLandSlot}
      />
      <CreateBound
        key={Math.floor(Math.random() * 9999999)}
        tileplant={tileplant} loading={loading}></CreateBound>
      <UIFarm Carrot={carrot} Wheat={wheat} Tomato={tomato}></UIFarm>
      <Inventory
        key={Math.floor(Math.random() * 9999999)}
        inventory={inventory}></Inventory>
      {popupFactory ? <FarmProduce
        key={Math.floor(Math.random() * 9999999)}
      ></FarmProduce> : <></>}
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
  const [render, setRender] = useState(false)
  let path = "/metaverse/farm/Sustaination_farm/farm-object/PNG/"
  return (
    <div key={Math.floor(Math.random() * 9999999)} className="farmItem" style={{ overflow: "auto" }}>
      <div className="imgItem" style={{
        border: inventoryStatus["dig"] == true ? "2px" : "0px",
        borderStyle: inventoryStatus["dig"] == true ? "dashed dashed dashed dashed" : "none"
      }}>
        <img
          onClick={() => {
            inventoryStatus["dig"] = !inventoryStatus["dig"]
            initialInventory("dig")
            setRender(!render)
          }}
          src={"/metaverse/farm/Sustaination_farm/farm-object/PNG/shovel.png"}
          alt=""
        />
      </div>
      <div className="imgItem" style={{
        border: inventoryStatus["factory"] == true ? "2px" : "0px",
        borderStyle: inventoryStatus["factory"] == true ? "dashed dashed dashed dashed" : "none",
        width: "65px",
        height: "65px"
      }}>
        <img
          onClick={() => {
            inventoryStatus["factory"] = !inventoryStatus["factory"]
            initialInventory("factory")
            setRender(!render)
          }}
          src={"/metaverse/farm/Sustaination_farm/farm-object/PNG/factory-icon.png"}
          alt=""
        />
      </div>

      {inventory.length > 0 ?
        <>
          {inventory.map((value, i) => {
            if (value.materialName !== "wood" && value.materialName !== "seed") {

              let pathItem = path + value.materialName + '-icon.png'
              return (
                <div className="imgItem" key={i} style={{
                  border: i == color && inventoryStatus[value.materialName] == true ? "2px" : "0px",
                  borderStyle: i == color && inventoryStatus[value.materialName] == true ? "dashed dashed dashed dashed" : "none"
                }}>
                  <img

                    onClick={() => {
                      inventoryStatus[value.materialName] = !inventoryStatus[value.materialName]
                      initialInventory(value.materialName)
                      setRender(!render)
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
  let path = "metaverse/farm/Sustaination_farm/farm-object/PNG/";
  return (
    <>
      {tileplant.map((tag, value) => {
        let pathItem = path + tag.properties.status + "-" + tag.properties.name + ".png"
        if (tag.properties.name === "None") {
          return (
            <>
              <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
            </>
          )
        }
        else if (tag.properties.status === "newlyPlanted" && tag.properties.name === "Pine_Seed") {
          return (
            <>
              <ImageOverlay key={value + 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-object/PNG/newlyPlanted-Pine_Seed.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
            </>
          )
        }
        else if (tag.properties.status === "newlyPlanted") {
          return (
            <>
              <ImageOverlay key={value + 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              <ImageOverlay key={value} url={'metaverse/farm/Sustaination_farm/farm-object/PNG/newlyPlanted.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
            </>
          )
        }
        else if (tag.properties.name === "Factory") {
          return (
            <>
              <ImageOverlay key={value + 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-51.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {/* <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/farm-object/building/chemist.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> */}
              {/* <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-50.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> */}

              {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
            </>
          )
        }
        // else if (tag.properties.name === "Market") {
        //   return (
        //     <>
        //       <ImageOverlay key={value + 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
        //       {/* <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-51.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> */}
        //       {/* <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> */}
        //       <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-50.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />

        //       {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
        //     </>
        //   )
        // }
        // else if (tag.properties.name === "Chemistry") {
        //   return (
        //     <>
        //       <ImageOverlay key={value + 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
        //       <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-51.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
        //       {/* <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> */}
        //       {/* <ImageOverlay key={value} url={'/metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-50.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> */}

        //       {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
        //     </>
        //   )
        // }
        else {
          return (
            <>
              <ImageOverlay key={value + 100} url={'metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              <ImageOverlay key={value} url={pathItem} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} />
              {loading === true && positionTree.i == tag.properties.i && positionTree.j == tag.properties.j ? <ImageOverlay key={value + 200} url={'metaverse/Ripple-loading.gif'} bounds={[[tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]], [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]]} /> : <></>}
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
        console.log("loadTileSlots", await loadTileSlots(myFarm))
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