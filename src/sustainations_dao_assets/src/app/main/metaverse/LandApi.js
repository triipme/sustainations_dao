import store from 'app/store';
import proj4Src from 'proj4';
import polygonClipping from 'polygon-clipping';
// call api
// use func union in polygon-clipping
function unionLandSlots(utm1, utm2) {
  const rs = polygonClipping.union(utm1, utm2);
  return rs;
};

// get user info
function getUserInfo() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getUserInfo();
    resolve(rs);
  });
};

// list characters
function listCharacters() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.listCharacters();
    resolve(rs);
  });
};

// list Inventory
// function listInventory(characterId) {
//   return new Promise((resolve, reject) => {
//     const { user } = store.getState();
//     const rs = user.actor.listInventory(characterId);
//     resolve(rs).ok;
//   });
// };

// subtract Inventory
// async function subtractInventory(inventoryId) {
// return new Promise((resolve, reject) => {
//   const { user } = store.getState();
//   const rs = user.actor.subtractInventory(inventoryId);
//   resolve(rs);
// });
//   const { user } = store.getState();
//   const func = await user.actor.subtractInventory(inventoryId);
//   const result = func?.ok;
//   return result;
// };

// list Stash
function listStash() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.listStash();
    resolve(rs).ok;
  });
};


// buy LandSlot
async function buyLandSlot() {
  const { user } = store.getState();
  const func = await user.actor.buyLandSlot();
  const result = func?.ok;
  return result;
}

// random LandSlot
async function randomLandSlot() {
  const { user } = store.getState();
  const func = await user.actor.randomLandSlot()
  const result = func?.ok;
  console.log(func);
  let feature = {
    type: "Feature",
    properties: { "zoneNumber": result.zoneNumber, "zoneLetter": result.zoneLetter, "i": result.i, "j": result.j },
    geometry: {
      type: "Polygon",
      coordinates: result.coordinates,
    }
  };
  return feature;
}

// create LandSlot
async function createLandSlot(i, j, nationUTMS) {
  const { user } = store.getState();
  const func = await user.actor.createLandSlot(parseInt(i), parseInt(j), nationUTMS, 20, "N", 1000);
  const result = func?.ok;
  return result;
};


async function loadNationsfromCenter(x, y) {
  const { user } = store.getState();
  const { principal } = user;
  const func = await user.actor.loadNationsArea(
    x,y,11
  );
  const nations = func?.ok;
  // let zone = 20
  var result = {
    features: []
  };
  if (nations) {
    for (let nation of nations) {
      let feature = {
        type: "Feature",
        properties: {
          "id": nation.id,
          "zoneNumber": nation.zoneNumber,
          "zoneLetter": nation.zoneLetter,
          "i": nation.i,
          "j": nation.j
        },
        geometry: {
          type: "Polygon", coordinates: nation.coordinates,
        }
      }
      if (nation.id !== principal) {
        result.features.push(feature)
      } else {
        result.features = [feature].concat(result.features)
      }
    }


  }
  console.log(result.features)
  return nations ? result.features : [];
}

function utm2lonlat(utmX, utmY) {
  let zoneNumber = 20
  var firstProj = "+proj=utm +ellps=WGS84 +zone=" + zoneNumber.toString() + " +units=m"
  var secondProj = "+proj=longlat +ellps=WGS84 +datum=WGS84"
  let result = proj4Src(firstProj, secondProj, [utmX, utmY])
  return result
};

function lonlat2utm(lon, lat) {
  let zoneNumber = 20
  var firstProj = "+proj=utm +ellps=WGS84 +zone=" + zoneNumber.toString() + " +units=m"
  var secondProj = "+proj=longlat +ellps=WGS84 +datum=WGS84"
  let result = proj4Src(secondProj, firstProj, [lon, lat])
  return result
};
// load LandSLot from Center
// async function loadLandSlotsfromCenter(x, y) {
//   let d = 1000
//   let zone = 20
//   let result = {
//     features: []
//   };
//   for (let i = Math.max(x - 100, 0); i <= Math.min(x + 100, 1500 - 1); i++) {
//     for (let j = Math.max(y - 100, 0); j <= Math.min(y + 100, 1500 - 1); j++) {
//       let xIndex = Number(i)
//       let yIndex = Number(j)
//       let latlng1 = utm2lonlat(d * yIndex, d * xIndex);
//       let latlng2 = utm2lonlat(d * (yIndex + 1), d * (xIndex + 1));
//       let feature = {
//         type: "Feature",
//         properties: { "zone": zone, "i": xIndex, "j": yIndex },
//         geometry: {
//           type: "Polygon", coordinates: [
//             [
//               [latlng1[0], latlng1[1]],
//               [latlng2[0], latlng1[1]],
//               [latlng2[0], latlng2[1]],
//               [latlng1[0], latlng2[1]],
//               [latlng1[0], latlng1[1]]
//             ]
//           ]
//         }
//       };
//       result.features.push(feature)
//     }
//   }
//   return result.features
// }

// get LandIndex based on long and lat value of center point on the screen
function getLandIndex(latlng) {
  let temp = lonlat2utm(latlng.lng, latlng.lat)
  console.log([parseInt(temp[1]/1000), parseInt(temp[0]/1000)])
  return [parseInt(temp[1]/1000), parseInt(temp[0]/1000)]
}

// load LandTransferHistories
async function loadLandTransferHistories() {
  const { user } = store.getState();
  const listLandTransferHistories = await user.actor.listLandTransferHistories();
  const landTransferHistories = listLandTransferHistories?.ok;
  return landTransferHistories;
};


// load LandBuyingStatuses
async function loadLandBuyingStatus() {
  const { user } = store.getState();
  const readLandBuyingStatus = await user.actor.readLandBuyingStatus();
  const landBuyingStatus = readLandBuyingStatus?.ok;
  var feature = undefined
  if (landBuyingStatus != undefined) {
    feature = {
      type: "Feature",
      properties: {
        "zoneNumber": landBuyingStatus.geometry.zoneNumber,
        "zoneLetter": landBuyingStatus.geometry.zoneLetter,
        "i": landBuyingStatus.geometry.i,
        "j": landBuyingStatus.geometry.j,
        "randomTimes": landBuyingStatus.randomTimes
      },
      geometry: {
        type: "Polygon",
        coordinates: landBuyingStatus.geometry.coordinates,
      }
    }
  };
  return feature;
};



// load TileSlots
async function loadTileSlots(properties) {
  var result = {
    features: []
  };
  let d = 100
  let zone = Number(properties.zoneNumber)
  let x = Number(properties.i) * 10
  let y = Number(properties.j) * 10

  const { user } = store.getState();
  const func = async () => await user.actor.loadTilesArea(x, y, x + 9, y + 9);
  const tiles = (await func()).ok;
  

  var result = {
    features: []
  };
  for (let tile of tiles) {
    let latlng1 = utm2lonlat(d * Number(tile.indexColumn), d * Number(tile.indexRow));
    let latlng2 = utm2lonlat(d * (Number(tile.indexColumn) + 1), d * (Number(tile.indexRow) + 1));
    let landId = properties.i.toString() + "-" + properties.j.toString();
    let feature = {
      type: "Feature",
      properties: {
        "zone": zone,
        "i": Number(tile.indexRow),
        "j": Number(tile.indexColumn),
        "landId": landId,
        "tileId": tile.id,
        "name": tile.name,
        "hasEffectId": tile.hasEffectId,
        "status": tile.status,
        "remainingTime": Number(tile.remainingTime)
      },
      geometry: {
        type: "Polygon", coordinates: [
          [
            [latlng1[0], latlng1[1]],
            [latlng2[0], latlng1[1]],
            [latlng2[0], latlng2[1]],
            [latlng1[0], latlng2[1]],
            [latlng1[0], latlng1[1]]
          ]
        ]
      }
    };
    result.features.push(feature)
  }
  // console.log(result.features)
  return result.features
}

// async function loadNation() {
//   const { user } = store.getState();
//   const func = await user.actor.readNation();
//   const result = func?.ok;
//   return result;
// };

async function loadUserLandSlots() {
  const { user } = store.getState();
  const func = await user.actor.listUserLandSlots();
  const result = func?.ok;
  return result;

};
// Plant Tree
// async function plantTree(landId, indexRow, indexColumn, materialId) {
//   const { user } = store.getState();
//   const func = await user.actor.plantTree(landId, indexRow, indexColumn, materialId);
//   const result = func?.ok;
//   return result;
// }

// Harvest Tree
async function harvestTree(tileId) {
  const { user } = store.getState();
  const func = await user.actor.harvestTree(tileId);
  const result = func?.ok;
  return result;
}

// Remove Tree
async function removeTree(tileId) {
  const { user } = store.getState();
  const func = await user.actor.removeTree(tileId);
  const result = func?.ok;
  return result;
}



export {
  getUserInfo,
  // listInventory,
  // subtractInventory,
  listStash,
  listCharacters,
  randomLandSlot,
  createLandSlot,
  loadLandTransferHistories,
  buyLandSlot,
  loadLandBuyingStatus,
  loadNationsfromCenter,
  //loadLandSlotsfromCenter,
  getLandIndex,
  loadTileSlots,
  // loadNation,
  unionLandSlots,
  // plantTree,
  harvestTree,
  removeTree,
  loadUserLandSlots
}