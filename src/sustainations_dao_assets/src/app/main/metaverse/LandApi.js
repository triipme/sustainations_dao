import store from 'app/store';
import proj4Src from 'proj4';

// call api
// convert utm to lonlat
function utm2lonlat(utmX,utmY) {
  let zoneNumber=20
  var firstProj="+proj=utm +ellps=clrk66 +zone=" + zoneNumber.toString() + " +units=m"
  var secondProj="+proj=longlat +ellps=WGS84 +datum=WGS84"
  let result = proj4Src(firstProj, secondProj, [utmX, utmY])
  return result
}
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

async function randomLandSlot() {
  const { user } = store.getState();
  const func = async () => await user.actor.randomLandSlot();
  const result = (await func()).ok; 
  let zone = 20
  let d = 1000
  let xIndex = Number(result.i)
  let yIndex = Number(result.j)
  let latlng1 = utm2lonlat(d*yIndex, d*xIndex);
  let latlng2 = utm2lonlat(d*(yIndex + 1), d*(xIndex + 1));
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

  return feature;
}

// create LandSlot
async function createLandSlot(i,j) {
  const { user } = store.getState();
  const func = async () => await user.actor.createLandSlot(parseInt(i),parseInt(j),20,"N",1000);
  const result = (await func()).ok;
  return result;
};

// load LandTransferHistories
async function loadLandTransferHistories() {
  const { user } = store.getState();
  const listLandTransferHistories = async () => await user.actor.listLandTransferHistories();
  const landTransferHistories = (await listLandTransferHistories()).ok;
  return landTransferHistories;
};

// update LandBuyingStatus
async function updateLandBuyingStatus(indexRow,indexColumn,randomTimes) {
  const { user } = store.getState();
  const func = async () => await user.actor.updateLandBuyingStatus(parseInt(indexRow),parseInt(indexColumn),20,"N",randomTimes);
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
  let d = 1000
  let zone = 20
  var result = {
    features: []
  };
  for (let i = Math.max(x-9,0); i <= Math.min(x+9,1500-1); i++) {
    for (let j = Math.max(y-18,0); j <= Math.min(y+18,1500-1); j++) {
      
      let xIndex = Number(i)
      let yIndex = Number(j)
      let latlng1 = utm2lonlat(d*yIndex, d*xIndex);
      let latlng2 = utm2lonlat(d*(yIndex + 1), d*(xIndex + 1));
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
  let d=100
  let zone = properties.zone
  let x = properties.i*10
  let y = properties.j*10
  for (let i=x;i<x+10;i++)
  {
    for (let j=y;j<y+10;j++)
    {
      let latlng1 = utm2lonlat(d*j,d*i);
      let latlng2 = utm2lonlat(d*(j+1),d*(i+1));
      let feature = {
        type : "Feature",
        properties: { "zone": zone, "i": i, "j": j }, 
        geometry: { type: "Polygon", coordinates: [
          [
            [latlng1[0], latlng1[1]],
            [latlng2[0], latlng1[1]],
            [latlng2[0], latlng2[1]],
            [latlng1[0], latlng2[1]],
            [latlng1[0], latlng1[1]]
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
  randomLandSlot,
  createLandSlot,
  loadLandTransferHistories,
  buyLandSlot,
  updateLandBuyingStatus,
  loadLandBuyingStatus,
  loadLandSlotsfromCenter,
  getLandIndex,
  loadTileSlots
}