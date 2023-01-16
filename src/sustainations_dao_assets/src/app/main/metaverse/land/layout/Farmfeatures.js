import React, { useRef, useEffect, useState } from 'react';
import ObjectLayer from './layout/ObjectLayer'
import { useSelector } from 'react-redux';
import { selectUser } from "app/store/userSlice";
import { useLocation } from 'react-router-dom';
import { loadTileSlots } from '../../LandApi';
import Loading from '../loading';
import HotbarGame from './HotBar';
import { init, drawRect, drawRhombusImage, sOft, checkTilePosition, drawRhombus, getCenterCoordinate, canvasConfig } from "./publicfuntion"

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
  const [cantBuild, setCantBuild] = useState("")
  const [popupFactory, setPopupFactory] = useState(false)
  const [objectId, setObjectId] = useState("None")
  const [listTile, setListTile] = useState([])
  const [fillTile, setFillTile] = useState()

  const canvas = useRef();

  //import image
  const image = new Image();
  image.src = "metaverse/farm25D/Ground.png";
  const plant = new Image();
  plant.src = "metaverse/farm25D/Eggplant03.png";

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
    if (canvasEle.width < canvasEle.height) {
      let t = canvasEle.height
      canvasEle.height = canvasEle.width
      canvasEle.width = t
    }

    //map  init
    tileStyle = sOft(canvasEle.width / 2 - 120 / 2, canvasEle.height / 6, 10, 10, canvasEle.width / 15, canvasEle.height / 15);
    let map = init(tileStyle, Number(landSlotProperties.j) * 10, Number(landSlotProperties.i) * 10)

    const plantedTile = tileplant.filter(tile => {
      return tile.properties.name !== "None";
    })

    map.forEach(tile => {
      drawRhombusImage(ctx, image, tile.x, tile.y, tile.w, tile.h);
      const t = plantedTile.filter(object => {
        return object.properties.i === tile.row && object.properties.j === tile.col
      })
      if (t.length > 0) {
        // drawRhombusImage(ctx, plant, tile.x, tile.y, tile.w, tile.h);
        let cc = (getCenterCoordinate(tile));
        drawRhombusImage(ctx, plant, cc.x - 780 / 15, cc.y - 870 / 15, 1350 / 15, 1271 / 15, 9);

      }
    })
    setListTile(map);
  }, [tileplant]);


  // set object
  const fillColor = (posT, listTile, numTile) => {
    let filled = []
    filled = listTile.filter(row => {
      return row.id === posT.id;
    })

    if (filled.length === 0)
      return filled
    let cc = (getCenterCoordinate(filled[0]));
    // drawRhombusImage(ctx, image, cc.x - (canvasEle.width / 15) / 2, cc.y - ((canvasEle.height / 15) / 2) * 3, canvasEle.width / 5, canvasEle.height / 5);
    // drawRhombusImage(ctx, imageBuilding, cc.x + (canvasEle.width / 15) - 3300 / 36, cc.y - (canvasEle.height / 15) / 3 - 3100 / 36, 8551 / 36, 5707 / 36);
    drawRhombusImage(ctx, plant, cc.x - 780 / 15, cc.y - 870 / 15, 1350 / 15, 1271 / 15, 9);

    return filled
  }

  //set amount in warehouse
  const defineAmount = (item, productName) => {
    if (productName === "Carrot") {
      setWarehouses(warehouses.carrot = Number(item.amount))
    } else if (productName === "Wheat") {
      setWarehouses(warehouses.wheat = Number(item.amount))
    } else {
      setWarehouses(warehouses.tomato = Number(item.amount))
    }
  }


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

  function handleClick(e) {
    if (checkTilePosition(e, listTile, tileStyle)) {
      const pos = checkTilePosition(e, listTile, tileStyle)
      console.log(
        landSlotProperties.id,
        pos.row,
        pos.col);
      (async () => {
        console.log("Plant tree status: ", await user.actor.sowSeed(
          landSlotProperties.id,
          pos.row,
          pos.col,
          "m3tomato_seed"));
        setTileplant(await loadTileSlots(landSlotProperties));
      })();
    }
  }

  useEffect(() => {
    fillColor(fillTile, listTile, 9)
  }, [fillTile])

  return (
    <>
      <div>
        <canvas ref={canvas} onClick={handleClick}></canvas>
        {/* <ObjectLayer tileplant={tileplant} landSlotProperties={landSlotProperties}></ObjectLayer> */}
      </div>
    </>
  );
}

export default Farm;