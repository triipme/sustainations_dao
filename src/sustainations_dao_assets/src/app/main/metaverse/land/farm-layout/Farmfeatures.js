import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from "app/store/userSlice";
import { loadTileSlots } from '../../LandApi';
import Hotbar from './HotBar';
import FarmProduce from './FarmProduce';
import { init, drawRect, drawImageOnCanvas, sOft, checkTilePosition, drawRhombus, getCenterCoordinate, canvasConfig, loadImage } from "./publicfuntion"
import UIFarm from './FarmUI';

let tileStyle = {};
let ctx = null;
let canvasEle;

function Farm(props) {
  const user = useSelector(selectUser);
  const [tileplant, setTileplant] = useState(props.mapFeatures);
  const [landSlotProperties, setLandSlotProperties] = useState(props.landSlotProperties)
  const [inventory, setInventory] = useState([]);
  const [characterId, setChacterId] = useState("");
  const [loading, setLoading] = useState(false)
  const [warehouses, setWarehouses] = useState([]);
  const [popupFactory, setPopupFactory] = useState(false)
  const [object, setObject] = useState({})
  const [listTile, setListTile] = useState([])
  const [objectId, setObjectId] = useState("")
  const [render, setRender] = useState(false)
  const canvas = useRef();

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

  // load data
  useEffect(() => {
    (async () => {
      const characterid = await user.actor.readCharacter();
      const inv = user.actor.listInventory(characterid.ok[0]);
      const listProductStorage = user.actor.listProductStorage();
      const stash = user.actor.listStash();
      const result = await Promise.all([inv, listProductStorage, stash]);
      console.log(result[1].ok)
      setWarehouses(result[1]?.ok)
      setChacterId(characterid.ok[0]);
      setInventory(result[0].ok);
    }
    )();

    const cvConfig = canvasConfig(canvas)
    ctx = cvConfig[0]
    canvasEle = cvConfig[1]
    //map init

    tileStyle = sOft(canvasEle.width / 2 - 120 / 2, canvasEle.height / 6, 10, 10, canvasEle.width / 15, canvasEle.height / 15);
    let map = init(tileStyle, Number(landSlotProperties.j) * 10, Number(landSlotProperties.i) * 10)
    ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);

    const plantedTile = tileplant.filter(tile => {
      return tile.properties.name !== "None";
    })

    map.forEach(tile => {
      // clearCanvas
      const t = plantedTile.filter(object => {
        return object.properties.i === tile.row && object.properties.j === tile.col
      })
      loadImage("metaverse/farm25D/Ground.png").then(ground => {
        ctx.drawImage(ground, tile.x, tile.y, tile.w, tile.h);
        if (t.length > 0) { // if amount of tile have object > 0
          // Loop list tile have object
          let cc = (getCenterCoordinate(tile));
          if (t[0].properties.name !== "Factory") { // if object name is not Factory
            tile.object = t[0].properties.name
            tile.tileId = t[0].properties.tileId
            tile.status = t[0].properties.status
            drawImageOnCanvas(ctx,
              ("metaverse/farm25D/plant/" + t[0].properties.name + "/" + t[0].properties.name + "_" + t[0].properties.status + ".png"),
              cc.x - (canvasEle.width / 35), cc.y - canvasEle.height / 16, canvasEle.width / 20, canvasEle.height / 11, t[0].properties.rowSize, t[0].properties.colSize);
          } else {
            tile.object = "Factory"
            tile.tileId = t[0].properties.tileId
            tile.objectId = t[0].properties.objectId
            drawImageOnCanvas(ctx, ("metaverse/farm25D/Ground.png"), cc.x - (canvasEle.width / 15) / 2, cc.y - ((canvasEle.height / 15) / 2) * 3, canvasEle.width / 5, canvasEle.height / 5, t[0].properties.rowSize, t[0].properties.colSize);
            drawImageOnCanvas(ctx, ("metaverse/farm25D/building/Factory.png"), cc.x - ((canvasEle.width / (240))), cc.y - (57 * canvasEle.height / (500)), canvasEle.width / 8, canvasEle.height / 6, t[0].properties.rowSize, t[0].properties.colSize);
          }
        }
      });
    })

    setListTile(map);
  }, [tileplant]);

  const checkAvailablePosition = (i, j, x) => {
    let result = []
    if (x === 9) {
      result = tileplant.filter(tile => {
        return tile.properties.i >= i && tile.properties.i <= i + 2 && tile.properties.j >= j && tile.properties.j <= j + 2
      }
      )
    } else {
      result = tileplant.filter(tile => {
        return tile.properties.j == j && tile.properties.i == i
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


  function handleClick(e) {
    const pos = checkTilePosition(e, listTile, tileStyle)
    console.log(pos)
    if (object.objectId === "dig" && pos.object) {
      (async () => {
        setLoading(true)
        console.log("Remove: ", await user.actor.removeObject(pos.tileId))
        setTileplant(await loadTileSlots(landSlotProperties));
        setInventory((await user.actor.listInventory(characterId)).ok);
        setLoading(false)
      })();
    }
    else if (object.objectId === "factory" && pos && checkAvailablePosition(pos.row, pos.col, 9)) {
      (async () => {
        console.log("Build Factory: ", (await user.actor.constructBuilding(landSlotProperties.id, pos.row, pos.col, "c1")))
        setTileplant(await loadTileSlots(landSlotProperties));
      })();
    }
    else if (pos && checkAvailablePosition(pos.row, pos.col, 1) &&
      object.objectId != undefined && object.amount > 0 && object.objectId !== 'm6pine_seed') {
      (async () => {
        await user.actor.subtractInventory(object.id);
        console.log("Plant tree status: ", await user.actor.sowSeed(landSlotProperties.id, pos.row, pos.col, object.objectId));
        setTileplant(await loadTileSlots(landSlotProperties));
        setInventory((await user.actor.listInventory(characterId)).ok);
      })();
    }
    else if (pos) {
      if (pos.object === "Factory") {
        setObjectId(pos.objectId)
        setPopupFactory(true)
      } else if (pos.object !== "None" && pos.status === "fullGrown") {
        (async () => {
          console.log("Harvest", await user.actor.harvestPlant(pos.tileId))
          setWarehouses((await user.actor.listProductStorage())?.ok)
          setTileplant(await loadTileSlots(landSlotProperties));
        })();
      }
    }

  }

  const handleChoose = (newObj) => {
    setObject(newObj)
  }

  const handlePopupFactory = (opt) => {
    setPopupFactory(opt)
  }

  return (
    <div>
      {popupFactory ? <FarmProduce handlePopupFactory={handlePopupFactory} objectId={objectId} /> : <></>}
      <Hotbar inventory={inventory} onUpdate={handleChoose} />
      <canvas ref={canvas} onClick={handleClick} ></canvas>
      <UIFarm warehouses={warehouses}></UIFarm>
    </div>
  );
}

export default Farm;