import store from 'app/store';

// call api
async function loadQuestItems(questId){
  const { user } = store.getState();
  const listQuestItems = async () => await user.actor.listQuestItems(questId);
  const questItems = (await listQuestItems()).ok;
  return questItems;
};

async function loadEventOptions(eventId){
  const { user } = store.getState();
  const listEventOptions = async () => await user.actor.listEventOptions(eventId);
  const eventOptions = (await listEventOptions()).ok;
  return eventOptions;
};

async function characterTakeOption(eventId){
  const { user } = store.getState();
  const takeOption = async () => await user.actor.takeOption(eventId);
  const result = (await takeOption()).ok;
  return result;
};

async function createDefautCharacter(){
  const { user } = store.getState();
  const create = async () => await user.actor.createCharacter("cc1");
  const character = (await create()).ok;
  return character;
};

async function loadCharacter(){
  const { user } = store.getState();
  const readCharacter = async () => await user.actor.readCharacter();
  const character = (await readCharacter()).ok;
  // console.log(character[1]);
  return character[1];
};

function updateCharacterStats(character){
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.updateCharacter(character);
    resolve(rs);
  })
  promise.then((data)=>{
    return data;
  })
};

function getCharacterStatus(){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getCharacterStatus();
    resolve(rs);
  });
};

async function resetCharacter(){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.resetCharacterStat();
    resolve(rs);
  });
};

function characterSelectsItems(characterId, itemIds){
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.createCharacterSelectsItems(characterId, itemIds);
    resolve(rs);
  })
  promise.then((data)=>{
    return data;
  })
};


async function listCharacterSelectsItems(characterId){
  const { user } = store.getState();
  const listItems = async () => await user.actor.listCharacterSelectsItems(characterId);
  const rs = (await listItems()).ok;
  // console.log(rs[1]);
  return rs;
};

async function takeOptionAbility(eventOptionId, itemIds){
  const { user } = store.getState();
  const takeable = async () => await user.actor.takeOptionAbility(eventOptionId, itemIds);
  const rs = (await takeable()).ok;
  // console.log(rs[1]);
  return rs;
};

function loadItemUrl(key) {
  let AWS = require('aws-sdk');
  AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
  });
  let s3 = new AWS.S3();
  const signedUrl = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: key });
  return signedUrl;
};

export {
  loadQuestItems,
  loadCharacter,
  loadEventOptions,
  updateCharacterStats,
  getCharacterStatus,
  characterTakeOption,
  resetCharacter,
  createDefautCharacter,
  characterSelectsItems,
  listCharacterSelectsItems,
  takeOptionAbility,
  loadItemUrl
}