import store from 'app/store';
import proj4Src from 'proj4';
import polygonClipping from 'polygon-clipping';
import axios from 'axios';
// call api

// use func union in polygon-clipping
function unionLandSlots(utm1, utm2) {
  const rs = polygonClipping.union(utm1, utm2);
  return rs;
};

// function from nation api
export const getNationLonLat = async (nationId) => {
  let nation = null
  try {
    const response = await axios.get(process.env.NATION_API_URL+"/"+nationId)
    nation = response.data.data
  }
  catch (err) {
    console.error(err);
  }
  return nation;
}

export const updateNationLonLat = async (nationId, coordinates) => {
  let utms = []
  for (let coord of coordinates[0]) {
    console.log(coord)
    let utm = [ Number(coord[0]), Number(coord[1]) ]
    utms.push(utm)
  }
  let nation = {
    nationId: nationId,
    utms: utms, 
  };
  let nationlonlat = null;
  try {
    const response = await axios.post(process.env.NATION_API_URL,nation)
    nationlonlat = response.data.data;
  } catch (err) {
    console.error(err);
  }

  return nationlonlat;
}

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
function listProductStorage() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.listProductStorage();
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
  let d = 1000;
  let latlng1 = utm2lonlat(d * Number(result.j), d * Number(result.i));
  let latlng2 = utm2lonlat(d * (Number(result.j) + 1), d * (Number(result.i) + 1));
  let feature = {
    type: "Feature",
    properties: { "zoneNumber": result.zoneNumber, "zoneLetter": result.zoneLetter, "i": result.i, "j": result.j },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [latlng1[0], latlng1[1]],
          [latlng2[0], latlng1[1]],
          [latlng2[0], latlng2[1]],
          [latlng1[0], latlng2[1]],
          [latlng1[0], latlng1[1]]
        ]
      ],
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

// async function loadNationsfromCenter(x, y) {
//   const { user } = store.getState();
//   const { principal } = user;
//   // const func = await user.actor.loadNationsArea(
//   //   x - 100, y - 100, x + 100, y + 100
//   // );
//   const func = await user.actor.loadNationsArea(
//     x, y, 4
//   );
//   const nations = func?.ok;
//   var result = {
//     features: []
//   };
//   if (nations) {
//     for (let nation of nations) {
//       console.log(nation.id)
//       console.log(nation.coordinates)
//       let feature = {
//         type: "Feature",
//         properties: {
//           "id": nation.id,
//           "zoneNumber": nation.zoneNumber,
//           "zoneLetter": nation.zoneLetter,
//           "i": nation.i,
//           "j": nation.j
//         },
//         geometry: {
//           type: "Polygon", coordinates: [[nation.coordinates]],
//         }
//       }
//       if (nation.id !== principal) {
//         result.features.push(feature)
//       } else {
//         result.features = [feature].concat(result.features)
//       }
//     }
//   }
//   return nations ? result.features : [];
// }

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
  // console.log([parseInt(temp[1]/1000), parseInt(temp[0]/1000)])
  return [parseInt(temp[1] / 1000), parseInt(temp[0] / 1000)]
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
    let d = 1000;
    let latlng1 = utm2lonlat(d * Number(landBuyingStatus.geometry.j), d * Number(landBuyingStatus.geometry.i));
    let latlng2 = utm2lonlat(d * (Number(landBuyingStatus.geometry.j) + 1), d * (Number(landBuyingStatus.geometry.i) + 1));  
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
        coordinates: [
          [
            [latlng1[0], latlng1[1]],
            [latlng2[0], latlng1[1]],
            [latlng2[0], latlng2[1]],
            [latlng1[0], latlng2[1]],
            [latlng1[0], latlng1[1]]
          ]
        ],
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
  // console.log("tiles", tiles)
  for (let tile of tiles) {
    let latlng1 = utm2lonlat(d * Number(tile.indexColumn), d * Number(tile.indexRow));
    let latlng2 = utm2lonlat(d * (Number(tile.indexColumn) + Number(tile.columnSize)), d * (Number(tile.indexRow) + Number(tile.rowSize)));
    let landId = properties.i.toString() + "-" + properties.j.toString();

    let feature = {
      type: "Feature",
      properties: {
        "zone": zone,
        "i": Number(tile.indexRow),
        "j": Number(tile.indexColumn),
        "rowSize": tile.rowSize,
        "columnSize": tile.columnSize,
        "landId": landId,
        "tileId": tile.id,
        "name": tile.name,
        "objectId" : tile.objectId,
        "hasEffectId": tile.hasEffectId,
        "status": tile.status,
        "remainingTime": Number(tile.remainingTime),
        "hasEffectId": tile.hasEffectId,
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

async function loadUserHasLandEffect() {
  const { user } = store.getState();
  const func = await user.actor.readUserHasLandEffect();
  const result = func?.ok;
  return result;
};

async function loadUserLandSlots() {
  const { user } = store.getState();
  const func = await user.actor.listUserLandSlots();
  const result = func?.ok;
  return result;

};
// Plant Tree
// async function sowSeed(landId, indexRow, indexColumn, materialId) {
//   const { user } = store.getState();
//   const func = await user.actor.sowSeed(landId, indexRow, indexColumn, materialId);
//   const result = func?.ok;
//   return result;
// }

// Harvest Tree
async function harvestPlant(tileId) {
  const { user } = store.getState();
  const func = await user.actor.harvestPlant(tileId);
  const result = func?.ok;
  return result;
}

// Remove Tree
async function removeObject(tileId) {
  const { user } = store.getState();
  const func = await user.actor.removeObject(tileId);
  const result = func?.ok;
  return result;
}

// Construct Building
async function constructBuilding(landId, indexRow, indexColumn, constructionId) {
  const { user } = store.getState();
  const func = await user.actor.constructBuilding(landId, indexRow, indexColumn, constructionId);
  const result = func?.ok;
  return result;
}

// craft UsableItem
async function craftUsableItem(buildingId, alchemyRecipeId) {
  const { user } = store.getState();
  const func = await user.actor.craftUsableItem(buildingId, alchemyRecipeId);
  const result = func?.ok;
  return result;
}



export {
  getUserInfo,
  // listInventory,
  // subtractInventory,
  listProductStorage,
  listCharacters,
  randomLandSlot,
  createLandSlot,
  loadLandTransferHistories,
  buyLandSlot,
  loadLandBuyingStatus,
  // loadNationsfromCenter,
  //loadLandSlotsfromCenter,
  getLandIndex,
  loadTileSlots,
  // loadNation,
  loadUserHasLandEffect,
  unionLandSlots,
  // plantTree,
  harvestPlant,
  removeObject,
  loadUserLandSlots,
  constructBuilding,
  craftUsableItem
}
