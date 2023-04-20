import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { loadTileSlots } from "../../LandApi";
import Hotbar from "./HotBar";
import FarmProduce from "./FarmProduce";
import ButtonZoom from "./Button-zoom";
import { init, sOft, checkTilePosition, getCenterCoordinate, canvasConfig } from "./publicfuntion";
import UIFarm from "./FarmUI";

let tileStyle = {};
let ctx = null;
let canvasEle = null;
const zoomLevel = [];
let startPointX, startPointY, width, height, cvW, cvH;
if (window.innerWidth >= window.innerHeight) {
  startPointX = window.innerWidth / 2 - 120 / 2;
  startPointY = window.innerHeight / 6;
  width = window.innerWidth / 15;
  height = window.innerHeight / 15;
  cvW = window.innerWidth;
  cvH = window.innerHeight;
} else {
  startPointX = window.innerHeight / 2 - 120 / 2;
  startPointY = window.innerWidth / 6;
  width = window.innerHeight / 15;
  height = window.innerWidth / 15;
  cvW = window.innerHeight;
  cvH = window.innerWidth;
}

for (let i = 1; i < 2; i += 0.1) {
  zoomLevel.push(i);
}

const URL_IMAGE = {
  TempBuilding: "metaverse/farm25D/building_webp/tempBuilding.webp",
  Factory: "metaverse/farm25D/building_webp/Factory.webp",
  Windmill: "metaverse/farm25D/building_webp/Windmill.webp",
  Ground: "metaverse/farm25D/Ground.png",
  Ground_Selected: "metaverse/farm25D/Ground_Selected.png",
  newlyPlanted: "metaverse/farm25D/plant/newlyPlanted.png",
  Carrot_Seed_growing: "metaverse/farm25D/plant/Carrot_Seed/Carrot_Seed_growing.png",
  Carrot_Seed_fullGrown: "metaverse/farm25D/plant/Carrot_Seed/Carrot_Seed_fullGrown.png",
  Tomato_Seed_growing: "metaverse/farm25D/plant/Tomato_Seed/Tomato_Seed_growing.png",
  Tomato_Seed_fullGrown: "metaverse/farm25D/plant/Tomato_Seed/Tomato_Seed_fullGrown.png",
  Wheat_Seed_growing: "metaverse/farm25D/plant/Wheat_Seed/Wheat_Seed_growing.png",
  Wheat_Seed_fullGrown: "metaverse/farm25D/plant/Wheat_Seed/Wheat_Seed_fullGrown.png",
  Bean_Seed_growing: "metaverse/farm25D/plant/Bean_Seed/Bean_Seed_growing.png",
  Bean_Seed_fullGrown: "metaverse/farm25D/plant/Bean_Seed/Bean_Seed_fullGrown.png",
  Sugarcane_Seed_growing: "metaverse/farm25D/plant/SugarCane_Seed/SugarCane_Seed_growing.png",
  Sugarcane_Seed_fullGrown: "metaverse/farm25D/plant/SugarCane_Seed/SugarCane_Seed_fullGrown.png",
  Goathouse: "metaverse/farm25D/building_webp/Goathouse.webp",
  Henhouse: "metaverse/farm25D/building_webp/Henhouse.webp",
};

function Farm(props) {
  const user = useSelector(selectUser);
  const [tileplant, setTileplant] = useState(props.mapFeatures);
  const [inventory, setInventory] = useState([]);
  const [characterId, setChacterId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [popup, setPopup] = useState(false);
  const [object, setObject] = useState({});
  const [listTile, setListTile] = useState([]);
  const [objectId, setObjectId] = useState("");
  const [scroll, setScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [newStartPoint, setNewStartPoint] = useState({ x: startPointX, y: startPointY });
  const [offCoord, setOffCoord] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [listImg, setListImg] = useState({});
  const [selected, setSelected] = useState({ row: -1, col: -1 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const canvas = useRef();
  const loadImage = (url, obj) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setListImg(prevState => ({
        ...prevState,
        [obj]: img
      }));
    };
  };
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setIsMobile(/Mobi|Android/i.test(userAgent));
    (async () => {
      let tile = await loadTileSlots(props.landSlotProperties);
      setTileplant(tile);
      const characterid = await user.actor.readCharacter();
      const inv = user.actor.listInventory(characterid.ok[0]);
      const listProductStorage = user.actor.listProductStorage();
      const stash = user.actor.listStash();
      const result = await Promise.all([inv, listProductStorage, stash]);
      setWarehouses(result[1]?.ok);
      setChacterId(characterid.ok[0]);
      setInventory(result[0].ok);
    })();
    for (let key in URL_IMAGE) {
      loadImage(URL_IMAGE[key], key);
    }
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    const cvConfig = canvasConfig(canvas);
    ctx = cvConfig[0];
    canvasEle = cvConfig[1];
    // ctx.setTransform(zoomLevel[scroll], 0, 0, zoomLevel[scroll],);
    ctx.translate(offCoord.x, offCoord.y);
    ctx.scale(zoomLevel[scroll], zoomLevel[scroll]);
  }, [scroll, offCoord]);

  function checkChangePlantStatus(prevState, curState) {
    const differences = curState.filter((key, idx) => {
      return prevState[idx]?.properties.status !== key?.properties.status;
    });
    if (differences.length > 0) {
      setTileplant(curState);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        // setTime(Date.now());
        checkChangePlantStatus(tileplant, await loadTileSlots(props.landSlotProperties));
      })();
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, [tileplant]);

  // load data
  useEffect(() => {
    const draw = async () => {
      //map init
      startPointX = newStartPoint.x;
      startPointY = newStartPoint.y;
      tileStyle = sOft(startPointX, startPointY, 10, 10, width, height);
      let map = init(
        tileStyle,
        Number(props.landSlotProperties.j) * 10,
        Number(props.landSlotProperties.i) * 10
      );

      const plantedTile = tileplant.filter(tile => {
        return tile.properties.name !== "None";
      });

      var arr = { Factory: [], Windmill: [], Goathouse: [], Henhouse: [] };
      map.forEach((tile, idx) => {
        return ctx.drawImage(
          selected?.row === tile.row && selected?.col === tile.col
            ? listImg.Ground_Selected
            : listImg.Ground,
          tile.x,
          tile.y,
          tile.w,
          tile.h
        );
      });

      map.forEach((tile, idx) => {
        let t = plantedTile.filter(object => {
          return object.properties.i === tile.row && object.properties.j === tile.col;
        });
        if (t.length > 0) {
          if (t[0].properties.name === "Factory") {
            // if object name is  Factory
            arr.Factory.push({
              tile: tile,
              idx: idx,
              objectId: t[0].properties.objectId,
              tileId: t[0].properties.tileId
            });
          } else if (t[0].properties.name === "Windmill") {
            arr.Windmill.push({
              tile: tile,
              idx: idx,
              objectId: t[0].properties.objectId,
              tileId: t[0].properties.tileId
            });
          } else if (t[0].properties.name === "Goathouse") {
            arr.Goathouse.push({
              tile: tile,
              idx: idx,
              objectId: t[0].properties.objectId,
              tileId: t[0].properties.tileId
            });
          } else if (t[0].properties.name === "Henhouse") {
            arr.Henhouse.push({
              tile: tile,
              idx: idx,
              objectId: t[0].properties.objectId,
              tileId: t[0].properties.tileId
            });
          }

          let cc = getCenterCoordinate(tile);

          if (t[0].properties.status === "newlyPlanted") {
            tile.object = t[0].properties.name;
            tile.tileId = t[0].properties.tileId;
            tile.status = t[0].properties.status;
            tile.objectId = t[0].properties.objectId;
            let startPointNewlyPlanted = {
              x: cc.x - cvW / 35,
              y: cc.y - cvH / 16,
              width: cvW / 20,
              height: cvH / 11
            };
            ctx.drawImage(
              listImg.newlyPlanted,
              startPointNewlyPlanted.x,
              startPointNewlyPlanted.y,
              startPointNewlyPlanted.width,
              startPointNewlyPlanted.height
            );
          } else if (t[0].properties.name === "Factory") {
            tile["object"] = "Factory";
            tile["tileId"] = t[0].properties.tileId;
            tile["objectId"] = t[0].properties.objectId;

            ctx.drawImage(
              selected?.row === tile.row && selected?.col === tile.col
                ? listImg.Ground_Selected
                : listImg.Ground,
              cc.x - cvW / 10,
              cc.y - cvH / 15 / 2,
              cvW / 5,
              cvH / 5
            );
            ctx.drawImage(listImg.Factory, cc.x - cvW / 22, cc.y - cvH / 15, cvW / 10, cvH / 5);
          } else if (t[0].properties.name === "Windmill") {

            tile["object"] = "Windmill";
            tile["tileId"] = t[0].properties.tileId;
            tile["objectId"] = t[0].properties.objectId;

            ctx.drawImage(
              selected?.row === tile.row && selected?.col === tile.col
                ? listImg.Ground_Selected
                : listImg.Ground,
              cc.x - cvW / 10,
              cc.y - cvH / 15 / 2,
              cvW / 5,
              cvH / 5
            );
            ctx.drawImage(listImg.Windmill, cc.x - cvW / 10, cc.y - cvH / 8, cvW / 5, cvH / 4);
          } else if (t[0].properties.name === "Goathouse") {
            tile["object"] = "Goathouse";
            tile["tileId"] = t[0].properties.tileId;
            tile["objectId"] = t[0].properties.objectId;

            ctx.drawImage(
              selected?.row === tile.row && selected?.col === tile.col
                ? listImg.Ground_Selected
                : listImg.Ground,
              cc.x - cvW / 10,
              cc.y - cvH / 15 / 2,
              cvW / 5,
              cvH / 5
            );
            ctx.drawImage(listImg.Goathouse, cc.x - cvW / 16, cc.y - cvH / 20, cvW / 7, cvH / 5);
          } else if (t[0].properties.name === "Henhouse") {
            tile["object"] = "Henhouse";
            tile["tileId"] = t[0].properties.tileId;
            tile["objectId"] = t[0].properties.objectId;

            ctx.drawImage(
              selected?.row === tile.row && selected?.col === tile.col
                ? listImg.Ground_Selected
                : listImg.Ground,
              cc.x - cvW / 10,
              cc.y - cvH / 15 / 2,
              cvW / 5,
              cvH / 5
            );
            ctx.drawImage(listImg.Henhouse, cc.x - cvW / 22, cc.y - cvH / 15, cvW / 10, cvH / 5);
          }
          else if (t[0].properties.name !== "p6_seed") {
            console.log(t[0].properties.name)
            tile.object = t[0].properties.name;
            tile.tileId = t[0].properties.tileId;
            tile.status = t[0].properties.status;
            tile.objectId = t[0].properties.objectId;
            let key = t[0].properties.name + "_" + t[0].properties.status;
            console.log(key)
            ctx.drawImage(listImg[key], cc.x - cvW / 35, cc.y - cvH / 16, cvW / 20, cvH / 11);
          }
        }
      });

      arr.Factory.map(e => {
        map.forEach((tile, idx) => {
          if (
            (idx >= e.idx + 10 && idx <= e.idx + 12) ||
            (idx >= e.idx + 20 && idx <= e.idx + 22) ||
            (idx > e.idx && idx <= e.idx + 2)
          ) {
            tile.object = "Factory";
            tile.tileId = e.tileId;
            tile.objectId = e.objectId;
          }
        });
      });

      arr.Goathouse.map(e => {
        map.forEach((tile, idx) => {
          if (
            (idx >= e.idx + 10 && idx <= e.idx + 12) ||
            (idx >= e.idx + 20 && idx <= e.idx + 22) ||
            (idx > e.idx && idx <= e.idx + 2)
          ) {
            tile.object = "Goathouse";
            tile.tileId = e.tileId;
            tile.objectId = e.objectId;
          }
        });
      });
      arr.Henhouse.map(e => {
        map.forEach((tile, idx) => {
          if (
            (idx >= e.idx + 10 && idx <= e.idx + 12) ||
            (idx >= e.idx + 20 && idx <= e.idx + 22) ||
            (idx > e.idx && idx <= e.idx + 2)
          ) {
            tile.object = "Henhouse";
            tile.tileId = e.tileId;
            tile.objectId = e.objectId;
          }
        });
      });
      arr.Windmill.map(e => {
        map.forEach((tile, idx) => {
          if (
            (idx >= e.idx + 10 && idx <= e.idx + 12) ||
            (idx >= e.idx + 20 && idx <= e.idx + 22) ||
            (idx > e.idx && idx <= e.idx + 2)
          ) {
            tile.object = "Windmill";
            tile.tileId = e.tileId;
            tile.objectId = e.objectId;
          }
        });
      });
      setListTile(map);
    };
    Object.keys(listImg).length !== 0 ? draw() : console.log("do nothing");
  }, [tileplant, scroll, offCoord, selected, imageLoaded]);

  const checkAvailablePosition = (i, j, x) => {
    let result = [];
    if (x === 9) {
      result = tileplant.filter(tile => {
        return (
          tile.properties.i >= i &&
          tile.properties.i <= i + 2 &&
          tile.properties.j >= j &&
          tile.properties.j <= j + 2
        );
      });
    } else {
      result = tileplant.filter(tile => {
        return tile.properties.j == j && tile.properties.i == i;
      });
    }
    const arr = result.filter(idx => {
      return idx?.properties.name !== "None";
    });

    if (arr.length === 0 && result.length === x) {
      return true;
    }
    return false;
  };

  const handleChoose = newObj => {
    setObject(newObj);
  };
  const handlepopup = opt => {
    setPopup(opt);
  };

  function handleWheel(e) {
    if (e.deltaY > 0 && scroll != zoomLevel.length) {
      setScroll(prevScroll => (prevScroll == zoomLevel.length - 1 ? prevScroll : prevScroll + 1));
    }
    if (e.deltaY < 0 && scroll != 0) {
      setScroll(prevScroll => (prevScroll == 0 ? prevScroll : prevScroll - 1));
    }
  }

  function handleWheelIncrease(e) {
    setScroll(prevScroll => (prevScroll == zoomLevel.length - 1 ? prevScroll : prevScroll + 1));
  }
  function handleWheelDecrease(e) {
    setScroll(prevScroll => (prevScroll == 0 ? prevScroll : prevScroll - 1));
  }
  const [coordStart, setCoordStart] = useState({ x: 0, y: 0 });
  const [date, setDate] = useState();
  function handleMouseDown(e) {
    setDate(Date.now());
    setIsDragging(true);
    if (e.type !== "mousedown") setCoordStart({ x: e.touches[0].pageX, y: e.touches[0].pageY });
    else {
      setCoordStart({ x: e.pageX, y: e.pageY });
    }
  }
  function handleMouseMove(e) {
    if (!isDragging) {
      return;
    }
    if (isMobile) {
      setOffCoord({
        x: e.touches[0].pageX - coordStart.x,
        y: e.touches[0].pageY - coordStart.y
      });
    } else {
      setOffCoord({
        x: e.pageX - coordStart.x,
        y: e.pageY - coordStart.y
      });
    }
  }

  function handleMouseUp(e) {
    setIsDragging(false);
    if (Date.now() - date < 300) {
      const pos = checkTilePosition(e, listTile, tileStyle, zoomLevel[scroll], offCoord);
      setSelected(pos);
      if (pos !== null && object.objectId === "dig" && pos?.object) {
        (async () => {
          console.log("Remove: ", await user.actor.removeObject(pos?.tileId));
          setTileplant(await loadTileSlots(props.landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);
        })();
      } else if (
        object.objectId === "factory" &&
        pos &&
        checkAvailablePosition(pos?.row, pos?.col, 9)
      ) {
        (async () => {
          console.log(
            "Build Factory: ",
            await user.actor.constructBuilding(
              props.landSlotProperties.id,
              pos?.row,
              pos?.col,
              "c1"
            )
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
        })();
      } else if (
        object.objectId === "Windmill" &&
        pos &&
        checkAvailablePosition(pos?.row, pos?.col, 9)
      ) {
        (async () => {
          console.log(
            "Build Windmill: ",
            await user.actor.constructBuilding(
              props.landSlotProperties.id,
              pos?.row,
              pos?.col,
              "c2"
            )
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
        })();
      } else if (
        object.objectId === "Henhouse" &&
        pos &&
        checkAvailablePosition(pos?.row, pos?.col, 9)
      ) {
        (async () => {
          console.log(
            "Build Henhouse: ",
            await user.actor.constructBuilding(
              props.landSlotProperties.id,
              pos?.row,
              pos?.col,
              "c3"
            )
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
        })();
      } else if (
        object.objectId === "Goathouse" &&
        pos &&
        checkAvailablePosition(pos?.row, pos?.col, 9)
      ) {
        (async () => {
          console.log(
            "Build Goathouse: ",
            await user.actor.constructBuilding(
              props.landSlotProperties.id,
              pos?.row,
              pos?.col,
              "c4"
            )
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
        })();
      } else if (
        pos &&
        checkAvailablePosition(pos?.row, pos?.col, 1) &&
        object.objectId != undefined &&
        object.amount > 0 &&
        object.objectId !== "factory" &&
        object.objectId !== "Goathouse" &&
        object.objectId !== "Windmill" &&
        object.objectId !== "Henhouse" &&
        object.objectId !== "m6pine_seed"
      ) {
        (async () => {
          await user.actor.subtractInventory(object.id);
          console.log(
            "Plant tree status: ",
            await user.actor.sowSeed(
              props.landSlotProperties.id,
              pos?.row,
              pos?.col,
              object.objectId
            )
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);
        })();
      } else if (pos) {
        if (pos?.object === "Factory" || pos?.object === "Windmill" || pos?.object === "Goathouse" || pos?.object === "Henhouse") {
          setObjectId(pos?.objectId);
          setPopup(true);
        } else if (pos?.object !== "None" && pos?.status === "fullGrown") {
          (async () => {
            console.log("Harvest", await user.actor.harvestPlant(pos?.tileId));
            setWarehouses((await user.actor.listProductStorage())?.ok);
            setTileplant(await loadTileSlots(props.landSlotProperties));
          })();
        }
      }
    } else {
      setNewStartPoint({ x: newStartPoint.x + offCoord.x, y: newStartPoint.y + offCoord.y });
      setOffCoord({ x: 0, y: 0 });
    }
  }

  return (
    <div>
      {popup ? <FarmProduce handlepopup={handlepopup} objectId={objectId} objectName={selected} /> : <></>}
      {/* <div className="w-full h-screen flex justify-center items-center"> */}
      <canvas
        // id="canvas"
        // className="mx-auto"
        ref={canvas}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}></canvas>
      {/* </div> */}

      <ButtonZoom
        handleWheelIncrease={handleWheelIncrease}
        handleWheelDecrease={handleWheelDecrease}
      />
      <Hotbar inventory={inventory} onUpdate={handleChoose} />
      <UIFarm warehouses={warehouses}></UIFarm>
    </div>
  );
}

export default Farm;
