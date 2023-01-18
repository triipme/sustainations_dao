import React, { useRef, useEffect, useState } from 'react';
import ObjectLayer from './layout/ObjectLayer'
import { useSelector } from 'react-redux';
import { selectUser } from "app/store/userSlice";
import { useLocation } from 'react-router-dom';
import { loadTileSlots } from '../../LandApi';
import Loading from './loading';
import Hotbar from './HotBar';
import FarmProduce from './FarmProduce';
import { init, drawRect, drawRhombusImage, sOft, checkTilePosition, drawRhombus, getCenterCoordinate, canvasConfig, defineAmount } from "./publicfuntion"

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
  const [warehouses, setWarehouses] = useState({
    carrot: 0,
    wheat: 0,
    tomato: 0,
  });
  const [popupFactory, setPopupFactory] = useState(false)
  const [object, setObject] = useState({})
  const [listTile, setListTile] = useState([])
  const [objectId, setObjectId] = useState("")
  const canvas = useRef();

  function loadImage(localurl) {
    const image = new Image();
    image.src = localurl;
    return image
  }

  // load data
  useEffect(() => {
    (async () => {
      const characterid = await user.actor.readCharacter();
      const inv = user.actor.listInventory(characterid.ok[0]);
      const listProductStorage = user.actor.listProductStorage();
      const stash = user.actor.listStash();
      const result = await Promise.all([inv, listProductStorage, stash]);
      result[1].ok.forEach(item => defineAmount(item, item.productName))
      setChacterId(characterid.ok[0]);
      setInventory(result[0].ok);
    }
    )();
  }, []);

  //config canvas
  useEffect(() => {
    const cvConfig = canvasConfig(canvas)
    ctx = cvConfig[0]
    canvasEle = cvConfig[1]


    //map  init
    tileStyle = sOft(canvasEle.width / 2 - 120 / 2, canvasEle.height / 6, 10, 10, canvasEle.width / 15, canvasEle.height / 15);
    let map = init(tileStyle, Number(landSlotProperties.j) * 10, Number(landSlotProperties.i) * 10)
    const plantedTile = tileplant.filter(tile => {
      return tile.properties.name !== "None";
    })

    map.forEach(tile => {
      drawRhombusImage(ctx, loadImage("metaverse/farm25D/Ground.png"), tile.x, tile.y, tile.w, tile.h);
      const t = plantedTile.filter(object => {
        return object.properties.i === tile.row && object.properties.j === tile.col
      })
      const arr = [0, 1, 2]
      if (t.length > 0) {
        t.forEach(obj => {
          let cc = (getCenterCoordinate(tile));
          if (obj.properties.name === "Factory") {
            tile.object = "Factory"
            tile.tileId = obj.properties.tileId
            tile.objectId = obj.properties.objectId
            drawRhombusImage(ctx, loadImage("metaverse/farm25D/Ground.png"), cc.x - (canvasEle.width / 15) / 2, cc.y - ((canvasEle.height / 15) / 2) * 3, canvasEle.width / 5, canvasEle.height / 5, obj.properties.rowSize, obj.properties.colSize);
            drawRhombusImage(ctx, loadImage("metaverse/farm25D/building/" + obj.properties.name + ".png"), cc.x + (canvasEle.width / 15) - 3300 / 36, cc.y - (canvasEle.height / 15) / 3 - 3100 / 36, 8551 / 36, 5707 / 36, obj.properties.rowSize, obj.properties.colSize);
          }
          else {
            tile.object = obj.properties.name
            tile.tileId = obj.properties.tileId
            tile.status = obj.properties.status
            drawRhombusImage(ctx,
              loadImage("metaverse/farm25D/plant/" + obj.properties.name + "/" + obj.properties.name + "_" + obj.properties.status + ".png"),
              cc.x - 780 / 15, cc.y - 870 / 15, 1350 / 15, 1271 / 15, obj.properties.rowSize, obj.properties.colSize);
          }
        })
      }
    });
    setListTile(map);
  }, [tileplant]);


  // useEffect(() => {
  //   (() => {
  //     inventoryStatus["dig"] = false;
  //     inventoryStatus["factory"] = false;
  //     for (let i = 0; i < inventory.length; i++) {
  //       if (inventory[i].materialName !== "wood" && inventory[i].materialName !== "seed") {
  //         inventoryStatus[inventory[i].materialName] = false;
  //       }
  //     }
  //     console.log("run")
  //   })();
  // }, [inventory]);


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
    console.log()
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
      object.objectId != undefined && object.amount > 0) {
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
        console.log(pos)
      } else if (pos.object !== "None" && pos.status === "fullGrown") {
        (async () => {
          console.log("Harvest", await user.actor.harvestPlant(pos.tileId))
          setTileplant(await loadTileSlots(landSlotProperties));
          const listProductStorage = (await user.actor.listProductStorage()).ok
          listProductStorage.forEach(item => defineAmount(item, item.productName))
        })();
      }
    }

  }

  // useEffect(() => {
  //   fillColor(fillTile, listTile, 9)
  // }, [fillTile])

  const handleChoose = (newObj) => {
    setObject(newObj)
  }

  const handlePopupFactory = (opt) => {
    setPopupFactory(opt)
  }
  console.log(objectId)
  return (
    <>
      {popupFactory ? <FarmProduce handlePopupFactory={handlePopupFactory} objectId={objectId} /> : <></>}
      <Hotbar inventory={inventory} onUpdate={handleChoose} />
      <canvas ref={canvas} onClick={handleClick}></canvas>
    </>
  );
}

export default Farm;