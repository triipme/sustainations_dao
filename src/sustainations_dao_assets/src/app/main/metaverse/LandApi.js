import store from 'app/store';
import { result } from 'lodash';
import proj4Src from 'proj4';
import { func } from 'prop-types';

// call api


// get user info
function getUserInfo() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getUserInfo();
    resolve(rs);
  });
};

// buy LandSlot
async function buyLandSlot() {
  const { user } = store.getState();
  const func = async () => await user.actor.buyLandSlot();
  const result = (await func()).ok;
  return result;
}

// random LandSlot
async function randomLandSlot() {
  const { user } = store.getState();
  const func = async () => await user.actor.randomLandSlot();
  const result = (await func()).ok;
  let feature = {
    type: "Feature",
    properties: { "zoneNumber": result.zoneNumber, "zoneLetter": result.zoneLetter, "i": result.i, "j": result.j },
    geometry: {
      type: "Polygon",
      coordinates: result.coordinates,
    }
  };
  console.log("==random==")
  console.log(feature)
  console.log("=========")
  return feature;
}

// create LandSlot
async function createLandSlot(i, j) {
  const { user } = store.getState();
  const func = async () => await user.actor.createLandSlot(parseInt(i), parseInt(j), 20, "N", 1000);
  const result = (await func()).ok;
  return result;
};


async function loadNationsfromCenter(x, y) {
  const { user } = store.getState();
  const func = async () => await user.actor.loadNationsArea(
    x - 100, y - 100, x + 100, y + 100
  );
  const nations = (await func()).ok;
  // let zone = 20
  var result = {
    features: []
  };
  for (let nation of nations) {
    let feature = {
      type: "Feature",
      properties: { "zoneNumber": nation.zoneNumber, "zoneLetter": nation.zoneLetter, "i": nation.i, "j": nation.j },
      geometry: {
        type: "Polygon", coordinates: nation.coordinates,
      }
    }
    result.features.push(feature)
  }
  console.log(result.features)
  return result.features
}

// load LandSLot from Center
async function loadLandSlotsfromCenter(x, y) {
  let d = 1000
  let zone = 20
  var result = {
    features: []
  };
  function utm2lonlat(utmX, utmY) {
    let zoneNumber = 20
    var firstProj = "+proj=utm +ellps=WGS84 +zone=" + zoneNumber.toString() + " +units=m"
    var secondProj = "+proj=longlat +ellps=WGS84 +datum=WGS84"
    let result = proj4Src(firstProj, secondProj, [utmX, utmY])
    return result
  };
  for (let i = Math.max(x - 100, 0); i <= Math.min(x + 100, 1500 - 1); i++) {
    for (let j = Math.max(y - 100, 0); j <= Math.min(y + 100, 1500 - 1); j++) {

      let xIndex = Number(i)
      let yIndex = Number(j)
      let latlng1 = utm2lonlat(d * yIndex, d * xIndex);
      let latlng2 = utm2lonlat(d * (yIndex + 1), d * (xIndex + 1));
      let feature = {
        type: "Feature",
        properties: { "zone": zone, "i": xIndex, "j": yIndex },
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
  }
  return result.features
}

// get LandIndex based on long and lat value of center point on the screen
function getLandIndex(latlng, landData) {
  for (let i in landData) {
    let coordinates = landData[i].geometry.coordinates[0]
    let minlng = coordinates[0][0]
    let maxlng = coordinates[2][0]
    let minlat = coordinates[0][1]
    let maxlat = coordinates[2][1]
    if (latlng.lat >= minlat && latlng.lat <= maxlat && latlng.lng >= minlng && latlng.lng <= maxlng) {
      return [landData[i].properties.i, landData[i].properties.j]
    }
  }
}

// load LandTransferHistories
async function loadLandTransferHistories() {
  const { user } = store.getState();
  const listLandTransferHistories = async () => await user.actor.listLandTransferHistories();
  const landTransferHistories = (await listLandTransferHistories()).ok;
  return landTransferHistories;
};

// update LandBuyingStatus
async function updateLandBuyingStatus(indexRow, indexColumn, randomTimes) {
  const { user } = store.getState();
  const func = async () => await user.actor.updateLandBuyingStatus(parseInt(indexRow), parseInt(indexColumn), randomTimes);
  const result = (await func()).ok;
  return result;

};

// load LandBuyingStatuses
async function loadLandBuyingStatus() {
  const { user } = store.getState();
  const readLandBuyingStatus = async () => await user.actor.readLandBuyingStatus();
  const landBuyingStatus = (await readLandBuyingStatus()).ok;
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
  let zone = properties.zone
  let x = properties.i * 10
  let y = properties.j * 10
  for (let i = x; i < x + 10; i++) {
    for (let j = y; j < y + 10; j++) {
      let latlng1 = utm2lonlat(d * j, d * i);
      let latlng2 = utm2lonlat(d * (j + 1), d * (i + 1));
      let feature = {
        type: "Feature",
        properties: { "zone": zone, "i": i, "j": j },
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
  }
  return result.features
}

async function loadNation() {
  const { user } = store.getState();
  const func = async () => await user.actor.readNation();
  const result = (await func()).ok;
  return result;

};

// Draw polygon 


export {
  getUserInfo,
  randomLandSlot,
  createLandSlot,
  loadLandTransferHistories,
  buyLandSlot,
  updateLandBuyingStatus,
  loadLandBuyingStatus,
  loadNationsfromCenter,
  loadLandSlotsfromCenter,
  getLandIndex,
  loadTileSlots,
  loadNation
}