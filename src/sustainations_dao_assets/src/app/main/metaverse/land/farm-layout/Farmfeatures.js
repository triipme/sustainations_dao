import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { loadTileSlots } from "../../LandApi";
import Hotbar from "./HotBar";
import FarmProduce from "./FarmProduce";
import {
  init,
  drawImageOnCanvas,
  sOft,
  checkTilePosition,
  getCenterCoordinate,
  canvasConfig,
  loadImage
} from "./publicfuntion";
import UIFarm from "./FarmUI";

let tileStyle = {};
let ctx = null;
let canvasEle = null;
const zoomLevel = [1, 1.2, 1.4, 1.6, 1.8];
function Farm(props) {
  const user = useSelector(selectUser);
  const [tileplant, setTileplant] = useState(props.mapFeatures);
  const [inventory, setInventory] = useState([]);
  const [characterId, setChacterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [popupFactory, setPopupFactory] = useState(false);
  const [object, setObject] = useState({});
  const [listTile, setListTile] = useState([]);
  const [objectId, setObjectId] = useState("");
  const [scroll, setScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [offCoord, setOffCoord] = useState({ x: 0, y: 0 });
  const canvas = useRef();

  // const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const cvConfig = canvasConfig(canvas, zoomLevel[scroll]);
    ctx = cvConfig[0];
    canvasEle = cvConfig[1];
    ctx.setTransform(zoomLevel[scroll], 0, 0, zoomLevel[scroll], offCoord.x, offCoord.y);
    console.log(zoomLevel[scroll], offCoord);
  }, [scroll, offCoord]);

  function checkChangePlantStatus(prevState, curState) {
    const differences = curState.filter((key, idx) => {
      return prevState[idx].properties.status !== key.properties.status;
    });
    if (differences.length > 0) {
      setTileplant(curState);
    }
  }

  console.log("cur, prev:", offCoord);

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

  useEffect(() => {
    tileStyle = sOft(
      canvasEle.width / 2 - 120 / 2,
      canvasEle.height / 6,
      10,
      10,
      canvasEle.width / 15,
      canvasEle.height / 15
    );
    let map = init(
      tileStyle,
      Number(props.landSlotProperties.j) * 10,
      Number(props.landSlotProperties.i) * 10
    );
    map.forEach((tile, idx) => {
      loadImage("metaverse/farm25D/Ground.png").then(ground => {
        ctx.drawImage(ground, tile.x, tile.y, tile.w, tile.h);
      });
    });
    (async () => {
      let tile = await loadTileSlots(props.landSlotProperties);
      setTileplant(tile);
    })();
  }, []);

  // load data
  useEffect(() => {
    (async () => {
      const characterid = await user.actor.readCharacter();
      const inv = user.actor.listInventory(characterid.ok[0]);
      const listProductStorage = user.actor.listProductStorage();

      const stash = user.actor.listStash();
      const result = await Promise.all([inv, listProductStorage, stash]);
      setWarehouses(result[1]?.ok);
      setChacterId(characterid.ok[0]);
      setInventory(result[0].ok);

      //map init

      tileStyle = sOft(
        canvasEle.width / 2 - 120 / 2,
        canvasEle.height / 6,
        10,
        10,
        canvasEle.width / 15,
        canvasEle.height / 15
      );
      let map = init(
        tileStyle,
        Number(props.landSlotProperties.j) * 10,
        Number(props.landSlotProperties.i) * 10
      );
      // ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);

      const plantedTile = tileplant.filter(tile => {
        return tile.properties.name !== "None";
      });

      var arr = [];

      map.forEach((tile, idx) => {
        let t = plantedTile.filter(object => {
          return object.properties.i === tile.row && object.properties.j === tile.col;
        });

        if (t.length > 0) {
          // if amount of tile have object > 0
          if (t[0].properties.name === "Factory") {
            // if object name is not Factory
            arr.push({
              tile: tile,
              idx: idx,
              objectId: t[0].properties.objectId,
              tileId: t[0].properties.tileId
            });
          }
        }

        loadImage("metaverse/farm25D/Ground.png").then(ground => {
          ctx.drawImage(ground, tile.x, tile.y, tile.w, tile.h);
          if (t.length > 0) {
            // if amount of tile have object > 0
            // Loop list tile have object
            let cc = getCenterCoordinate(tile);
            if (t[0].properties.status === "newlyPlanted") {
              tile.object = t[0].properties.name;
              tile.tileId = t[0].properties.tileId;
              tile.status = t[0].properties.status;
              tile.objectId = t[0].properties.objectId;
              drawImageOnCanvas(
                ctx,
                "metaverse/farm25D/plant/newlyPlanted.png",
                cc.x - canvasEle.width / 35,
                cc.y - canvasEle.height / 16,
                canvasEle.width / 20,
                canvasEle.height / 11,
                t[0].properties.rowSize,
                t[0].properties.colSize
              );
            } else if (t[0].properties.name !== "Factory" && t[0].properties.name !== "p6_seed") {
              // if object name is not Factory
              tile.object = t[0].properties.name;
              tile.tileId = t[0].properties.tileId;
              tile.status = t[0].properties.status;
              tile.objectId = t[0].properties.objectId;

              // ctx.clearRect(
              //   cc.x - canvasEle.width / 35,
              //   cc.y - canvasEle.height / 16,
              //   canvasEle.width / 20,
              //   canvasEle.height / 11
              // );
              // ctx.drawImage(ground, tile.x, tile.y, tile.w, tile.h);
              drawImageOnCanvas(
                ctx,
                "metaverse/farm25D/plant_svg/" +
                  t[0].properties.name +
                  "/" +
                  t[0].properties.name +
                  "_" +
                  t[0].properties.status +
                  ".svg",
                cc.x - canvasEle.width / 35,
                cc.y - canvasEle.height / 16,
                canvasEle.width / 20,
                canvasEle.height / 11,
                t[0].properties.rowSize,
                t[0].properties.colSize
              );
            } else {
              tile["object"] = "Factory";
              tile["tileId"] = t[0].properties.tileId;
              tile["objectId"] = t[0].properties.objectId;
              drawImageOnCanvas(
                ctx,
                "metaverse/farm25D/Ground.png",
                cc.x - canvasEle.width / 10,
                cc.y - canvasEle.height / 15 / 2,
                canvasEle.width / 5,
                canvasEle.height / 5,
                t[0].properties.rowSize,
                t[0].properties.colSize
              );
              drawImageOnCanvas(
                ctx,
                "metaverse/farm25D/building/Factory.png",
                cc.x - canvasEle.width / 20,
                cc.y - (57 * canvasEle.height) / 1200,
                canvasEle.width / 8,
                canvasEle.height / 6,
                t[0].properties.rowSize,
                t[0].properties.colSize
              );
            }
          }
        });
      });

      arr.map(e => {
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
      setListTile(map);
    })();
  }, [tileplant, scroll, offCoord]);

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
      return idx.properties.name !== "None";
    });

    if (arr.length === 0 && result.length === x) {
      return true;
    }
    return false;
  };

  const handleChoose = newObj => {
    setObject(newObj);
  };

  const handlePopupFactory = opt => {
    setPopupFactory(opt);
  };

  function handleWheel(e) {
    if (e.deltaY > 0 && scroll != 4) {
      ctx.restore();
      ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
      setScroll(prevScroll => (prevScroll == 4 ? prevScroll : prevScroll + 1));
    }

    if (e.deltaY < 0 && scroll != 0) {
      ctx.restore();
      ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
      setScroll(prevScroll => (prevScroll == 0 ? prevScroll : prevScroll - 1));
    }
  }

  function handleMouseDown(e) {
    setStartTime(Date.now());
    setIsDragging(true);
  }

  function handleMouseMove(e) {
    if (!isDragging) {
      return;
    }
    setOffCoord({
      x: e.pageX - (canvasEle.width / 2 - 120 / 2) * zoomLevel[scroll],
      y: e.pageY - (canvasEle.height / 3) * zoomLevel[scroll]
    });

    setDuration(startTime - Date.now());
  }

  function handleMouseUp(e) {
    setIsDragging(false);
    if (duration === null) {
      console.log(duration);
      const pos = checkTilePosition(e, listTile, tileStyle, zoomLevel[scroll], offCoord);
      console.log(pos);
      if (pos !== null && pos.object === "Pine_Seed") {
        (async () => {
          console.log("Remove: ", await user.actor.removeObject(pos.tileId));
        })();
      }
      if (pos !== null && object.objectId === "dig" && pos.object) {
        (async () => {
          setLoading(true);
          console.log("Remove: ", await user.actor.removeObject(pos.tileId));
          setTileplant(await loadTileSlots(props.landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);
          setLoading(false);
        })();
      } else if (
        object.objectId === "factory" &&
        pos &&
        checkAvailablePosition(pos.row, pos.col, 9)
      ) {
        (async () => {
          console.log(
            "Build Factory: ",
            await user.actor.constructBuilding(props.landSlotProperties.id, pos.row, pos.col, "c1")
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
        })();
      } else if (
        pos &&
        checkAvailablePosition(pos.row, pos.col, 1) &&
        object.objectId != undefined &&
        object.amount > 0 &&
        object.objectId !== "m6pine_seed"
      ) {
        (async () => {
          await user.actor.subtractInventory(object.id);
          console.log(
            "Plant tree status: ",
            await user.actor.sowSeed(props.landSlotProperties.id, pos.row, pos.col, object.objectId)
          );
          setTileplant(await loadTileSlots(props.landSlotProperties));
          setInventory((await user.actor.listInventory(characterId)).ok);
        })();
      } else if (pos) {
        if (pos.object === "Factory") {
          setObjectId(pos.objectId);
          setPopupFactory(true);
        } else if (pos.object !== "None" && pos.status === "fullGrown") {
          (async () => {
            console.log("Harvest", await user.actor.harvestPlant(pos.tileId));
            setWarehouses((await user.actor.listProductStorage())?.ok);
            setTileplant(await loadTileSlots(props.landSlotProperties));
          })();
        }
      }
    } else {
      // ctx.restore();
      // ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
    }
    setDuration(null);
  }

  return (
    <div>
      {popupFactory ? (
        <FarmProduce handlePopupFactory={handlePopupFactory} objectId={objectId} />
      ) : (
        <></>
      )}
      <canvas
        ref={canvas}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}></canvas>
      <Hotbar inventory={inventory} onUpdate={handleChoose} />
      <UIFarm warehouses={warehouses}></UIFarm>
    </div>
  );
}

export default Farm;
