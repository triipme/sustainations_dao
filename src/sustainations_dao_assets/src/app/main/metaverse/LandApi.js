import store from 'app/store';

// call api

// get user info
function getUserInfo(){
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

async function createLandSlot(zone,index) {
  const { user } = store.getState();
  const func = async () => await user.actor.createLandSlot(zone,index);
  const result = (await func()).ok;
  return result;
};

async function loadLandSlots(){
  const { user } = store.getState();
  const listLandSlots = async () => await user.actor.listLandSlots();
  const landTransferHistories = (await listLandSlots()).ok;
  return landTransferHistories;
};

// load LandTransferHistories
async function loadLandTransferHistories(){
  const { user } = store.getState();
  const listLandTransferHistories = async () => await user.actor.listLandTransferHistories();
  const landTransferHistories = (await listLandTransferHistories()).ok;
  return landTransferHistories;
};

// update LandBuyingStatus
async function updateLandBuyingStatus(zone,landIndex,randomTimes) {
  const { user } = store.getState();
  const func = async () => await user.actor.updateLandBuyingStatus(zone,landIndex,randomTimes);
  const result = (await func()).ok;
  return result;
};

// load LandBuyingStatuses
async function loadLandBuyingStatus(){
  const { user } = store.getState();
  const readLandBuyingStatus = async () => await user.actor.readLandBuyingStatus();
  const landBuyingStatus = (await readLandBuyingStatus()).ok;
  return landBuyingStatus;
};

function loadLandSlotsfromCenter(x,y,mapData){
  var result = {
    features: []
  };
  for (let i = Math.max(x-9,0); i <= Math.min(x+9,400-1); i++) {
    for (let j = Math.max(y-18,0); j <= Math.min(y+18,400-1); j++) {
      result.features.push(mapData.features[i*400+j]);
    }
  }
  return result.features
}

function getLandIndex(latlng,landData) {
  for (let i in landData)
  {
    let coordinates = landData[i].geometry.coordinates[0]
    let minlng = coordinates[0][0]
    let maxlng = coordinates[2][0]
    let minlat = coordinates[0][1]
    let maxlat = coordinates[2][1]
    if (latlng.lat>=minlat &&latlng.lat<=maxlat && latlng.lng>=minlng && latlng.lng<=maxlng)
    {
      return [landData[i].properties.i,landData[i].properties.j]
    }
  }
}


export {
  getUserInfo,
  createLandSlot,
  loadLandTransferHistories,
  buyLandSlot,
  loadLandSlots,
  updateLandBuyingStatus,
  loadLandBuyingStatus,
  loadLandSlotsfromCenter,
  getLandIndex,
}