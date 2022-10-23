import store from 'app/store';

// call api
var utmObj = require('utm-latlng');
var utm = new utmObj('Clarke 1866');
// get user info
function getUserInfo() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getUserInfo();
    resolve(rs);
  });
};

// LandSlot
async function buyLandSlot() {
  const { user } = store.getState();
  const func = async () => await user.actor.buyLandSlot();
  const result = (await func()).ok;
  return result;
}

async function updateLandSlot(zone, index) {
  const { user } = store.getState();
  const func = async () => await user.actor.updateLandSlot(zone, index);
  const result = (await func()).ok;
  return result;
};

async function loadLandSlots() {
  const { user } = store.getState();
  const listLandSlots = async () => await user.actor.listLandSlots();
  const landTransferHistories = (await listLandSlots()).ok;
  return landTransferHistories;
};

// load LandTransferHistories
async function loadLandTransferHistories() {
  const { user } = store.getState();
  const listLandTransferHistories = async () => await user.actor.listLandTransferHistories();
  const landTransferHistories = (await listLandTransferHistories()).ok;
  return landTransferHistories;
};

// update LandBuyingStatus
async function updateLandBuyingStatus(zone, landIndex, randomTimes) {
  const { user } = store.getState();
  const func = async () => await user.actor.updateLandBuyingStatus(zone, String(landIndex), randomTimes);
  const result = (await func()).ok;
  return result;
};

// load LandBuyingStatuses
async function loadLandBuyingStatus() {
  const { user } = store.getState();
  const readLandBuyingStatus = async () => await user.actor.readLandBuyingStatus();
  const landBuyingStatus = (await readLandBuyingStatus()).ok;
  return landBuyingStatus;
};

async function loadLandSlotsfromCenter(x, y) {

  let d = 100;

  const { user } = store.getState();
  const loadLandSlotsArea = async () => await user.actor.loadLandSlotsArea(
    Math.max(x - 9, 0), Math.max(y - 18, 0), Math.min(x + 9, 1600 - 1), Math.min(y + 18, 1600 - 1), 400
  );
  const landSlots = (await loadLandSlotsArea()).ok;
  var result = {
    features: []
  };

  for (let i in landSlots) {
    let zone = Number(landSlots[i].zone)
    let xIndex = Number(landSlots[i].xIndex)
    let yIndex = Number(landSlots[i].yIndex)
    let latlng1 = utm.convertUtmToLatLng(d * yIndex, d * xIndex, zone, 'N');
    let latlng2 = utm.convertUtmToLatLng(d * (yIndex + 1), d * (xIndex + 1), zone, 'N');

    let feature = {
      type: "Feature",
      properties: { "zone": zone, "i": xIndex, "j": yIndex },
      geometry: {
        type: "Polygon", coordinates: [
          [
            [latlng1.lng, latlng1.lat],
            [latlng2.lng, latlng1.lat],
            [latlng2.lng, latlng2.lat],
            [latlng1.lng, latlng2.lat],
            [latlng1.lng, latlng1.lat]
          ]
        ]
      }
    };
    result.features.push(feature)
  }
  return result.features
}

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

// load TileSlots
async function loadTileSlots(properties) {
  var result = {
    features: []
  };
  let d=10
  let zone = properties.zone
  let x = properties.i*10
  let y = properties.j*10
  // console.log("Properties: ", properties)
  for (let i=x;i<x+10;i++)
  {
    for (let j=y;j<y+10;j++)
    {
      let latlng1 = utm.convertUtmToLatLng(d*j,d*i,zone,'N');
      let latlng2 = utm.convertUtmToLatLng(d*(j+1),d*(i+1),zone,'N');
      let feature = {
        type : "Feature",
        properties: { "zone": zone, "i": i, "j": j }, 
        geometry: { type: "Polygon", coordinates: [
          [
            [latlng1.lng,latlng1.lat],
            [latlng2.lng,latlng1.lat],
            [latlng2.lng,latlng2.lat],
            [latlng1.lng,latlng2.lat],
            [latlng1.lng,latlng1.lat]
          ]
        ]}
      };
      result.features.push(feature)
    }
  }
  return result.features
}

export {
  getUserInfo,
  updateLandSlot,
  loadLandTransferHistories,
  buyLandSlot,
  loadLandSlots,
  updateLandBuyingStatus,
  loadLandBuyingStatus,
  loadLandSlotsfromCenter,
  getLandIndex,
  loadTileSlots
}