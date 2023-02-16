import store from 'app/store';

// call api

// get user info
function getUserInfo() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getUserInfo();
    resolve(rs);
  });
};

export function getQuestGameInfo(eventId){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getQuestGameInfo(eventId);
    resolve(rs);
  });
};

// export function getCharacterActions(eventId){
//   return new Promise((resolve, reject) => {
//     const { user } = store.getState();
//     const rs = user.actor.getCharacterActions(eventId);
//     resolve(rs);
//   });
// };


// character
const characterClassId = "cc1";

async function createDefautCharacter() {
  const { user } = store.getState();
  const create = async () => await user.actor.createCharacter(characterClassId);
  const character = (await create()).ok;
  return character;
};

function loadCharacter() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.readCharacter();
    resolve(rs);
  });
};

async function loadCharacterAwait() {
  const { user } = store.getState();
  const func = async () => await user.actor.readCharacter();
  const rs = (await func()).ok[1];
  return rs;
};

function updateCharacterStats(character) {
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.updateCharacter(character);
    resolve(rs);
  })
  promise.then((data) => {
    return data;
  })
};

export function updateCharacterStatsEngine(character) {
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.updateCharacterStatsEngine(character);
    resolve(rs);
  })
  promise.then((data) => {
    return data;
  })
};

function getCharacterStatus() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getCharacterStatus();
    resolve(rs);
  });
};

async function resetCharacter() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.resetCharacterStat();
    resolve(rs);
  });
};

async function characterTakeOption(eventId) {
  const { user } = store.getState();
  const takeOption = async () => await user.actor.takeOption(eventId);
  const result = (await takeOption()).ok;
  return result;
};

function gainCharacterExp(character) {
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.gainCharacterExp(character);
    resolve(rs);
  })
  promise.then((data) => {
    return data;
  })
};

// character actions
function useHpPotion(characterId) {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.useHpPotion(characterId);
    resolve(rs);
  });
};

// character selects items
function characterSelectsItems(characterId, itemIds) {
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.createCharacterSelectsItems(characterId, itemIds);
    resolve(rs);
  })
  promise.then((data) => {
    return data;
  })
};

async function listCharacterSelectsItems(characterId) {
  const { user } = store.getState();
  const listItems = async () => await user.actor.listCharacterSelectsItems(characterId);
  const rs = (await listItems()).ok;
  return rs;
};

// character collects materials
async function characterCollectsMaterials(eventId) {
  const { user } = store.getState();
  const collectsMaterials = async () => await user.actor.collectsMaterials(eventId);
  const result = (await collectsMaterials()).ok;
  return result;
};

async function createCharacterCollectsMaterials(characterCollectsMaterials) {
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.createCharacterCollectsMaterials(characterCollectsMaterials);
    resolve(rs);
  })
  promise.then((data) => {
    return data;
  })
};

async function listCharacterCollectsMaterials(characterId) {
  const { user } = store.getState();
  const characterCollectsMaterials = async () => await user.actor.listCharacterCollectsMaterials(characterId);
  const result = (await characterCollectsMaterials()).ok;
  return result;
};

async function resetCharacterCollectsMaterials(characterId) {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.resetCharacterCollectsMaterials(characterId);
    resolve(rs);
  });
};

// load quest items
async function loadQuestItems(questId) {
  const { user } = store.getState();
  const listQuestItems = async () => await user.actor.listQuestItems(questId);
  const questItems = (await listQuestItems()).ok;
  return questItems;
};

// load event options
async function loadEventOptions(eventId, selectedItemsIds) {
  const { user } = store.getState();
  const listEventOptions = async () => await user.actor.listEventOptions(eventId, selectedItemsIds);
  const eventOptions = (await listEventOptions()).ok;
  return eventOptions;
};

// load event items
async function loadEventItem() {
  const { user } = store.getState();
  const func = async () => await user.actor.loadEventItem();
  const result = (await func()).ok;
  return result;
};

function getHpPotion() {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getHpPotion();
    resolve(rs);
  });
};

async function getUsableItem() {
  const { user } = store.getState();
  const func = async () => await user.actor.getUsableItem();
  const result = (await func());
  return result;
};

async function listStash() {
  const { user } = store.getState();
  const func = async () => await user.actor.listStash();
  const result = (await func()).ok;
  return result;
};

export async function randomStashPotion() {
  const { user } = store.getState();
  const func = async () => await user.actor.randomStashPotion();
  const result = (await func()).ok;
  return result;
};

async function useUsableItem(characterId, stashId) {
  const { user } = store.getState();
  const func = async () => await user.actor.useUsableItem(characterId, stashId);
  const result = (await func()).ok;
  return result;
};

// get AR item
function canGetARItemPromise(eventItemId) {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.canGetARItem(eventItemId);
    resolve(rs);
  });
};

// character inventory
async function createInventory(characterId) {
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.createInventory(characterId);
    resolve(rs);
  })
  promise.then((data) => {
    console.log(data)
    return data;
  })
};

async function openInventory(characterId) {
  const { user } = store.getState();
  const func = async () => await user.actor.listInventory(characterId);
  const rs = (await func()).ok;
  return rs;
};

async function getRemainingTime(waitingTime, character) {
  const { user } = store.getState();
  const getRemainingTime = async () => await user.actor.getRemainingTime(waitingTime, character);
  const rs = (await getRemainingTime()).ok;
  return rs;
};

// load image from S3
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

// pay quest
async function payQuest(questId) {
  const { user } = store.getState();
  const func = async () => await user.actor.payQuest(questId);
  const result = (await func()).ok;
  return result;
};

export async function payQuestEngine(questId) {
  const { user } = store.getState();
  const func = async () => await user.actor.payQuestEngine(questId);
  const result = (await func()).ok;
  return result;
};

//read event
async function readEvent(eventId) {
  const { user } = store.getState();
  const func = async () => await user.actor.readEvent(eventId);
  const event = (await func()).ok;
  return event;
}

//Engine
async function createQuestEngine(quest) {
  const { user } = store.getState();
  const func = async () => await user.actor.createQuestEngine(quest);
  const rs = (await func()).ok;
  return rs;
}

async function createEventEngine(event) {
  const { user } = store.getState();
  const func = async () => await user.actor.createEventEngine(event);
  const rs = (await func()).ok;
  return rs;
}

async function createEventOptionEngine(eventOption) {
  const { user } = store.getState();
  const func = async () => await user.actor.createEventOptionEngine(eventOption);
  const rs = (await func()).ok;
  return rs;
}

export async function createAllEventOptionEngine(idEvent, eventOptions) {
  const { user } = store.getState();
  const func = async () => await user.actor.createAllEventOptionEngine(idEvent, eventOptions);
  const rs = (await func()).ok;
  return rs;
}

async function createScene(scene) {
  const { user } = store.getState();
  const func = async () => await user.actor.createScene(scene);
  const rs = (await func()).ok;
  return rs;
}

// list scene of quest
async function listSceneQuests(idQuest) {
  const { user } = store.getState();
  const func = async () => await user.actor.listSceneQuests(idQuest);
  const list_scene_quest = (await func()).ok;
  return list_scene_quest;
}

async function loadEventOptionEngines(eventId, selectedItemsIds) {
  const { user } = store.getState();
  const listEventOptionEngines = async () => await user.actor.listEventOptionEngines(eventId, selectedItemsIds);
  const eventOptions = (await listEventOptionEngines()).ok;
  return eventOptions;
};

async function readEventEngine(eventId) {
  const { user } = store.getState();
  const func = async () => await user.actor.readEventEngine(eventId);
  const event = (await func()).ok;
  return event;
}

export async function readQuestEngine(id) {
  const { user } = store.getState();
  const func = async () => await user.actor.readQuestEngine(id);
  const quest = (await func()).ok;
  return quest;
}

export async function getAllScenes(idQuest) {
  const { user } = store.getState();
  const func = async () => await user.actor.getAllScenes(idQuest);
  const rs = (await func()).ok;
  return rs;
}

export async function getListEventQuest() {
  const { user } = store.getState();
  const func = async () => await user.actor.getListEventQuest();
  const rs = (await func()).ok;
  return rs;
}

async function addAllInventory(characterId, amount) {
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.addAllInventory(characterId, amount);
    resolve(rs);
  });
};

async function readSceneEngine(sceneId) {
  const { user } = store.getState();
  const func = async () => await user.actor.readSceneEngine(sceneId);
  const scene = (await func()).ok;
  return scene;
}

async function loadQuestItemEngines(idQuest) {
  const { user } = store.getState();
  const func = async () => await user.actor.listQuestItemEngines(idQuest);
  const scene = (await func()).ok;
  return scene;
}

async function characterTakeOptionEngine(eventId) {
  const { user } = store.getState();
  const takeOptionEngine = async () => await user.actor.takeOptionEngine(eventId);
  const result = (await takeOptionEngine()).ok;
  return result;
};

async function characterCollectsMaterialEngines(eventId) {
  const { user } = store.getState();
  const func = async () => await user.actor.collectsMaterialEngines(eventId);
  const result = (await func()).ok;
  return result;
};

export async function deleteSceneEventAndEventOption(idScene) {
  const { user } = store.getState();
  const func = async () => await user.actor.deleteSceneEventAndEventOption(idScene);
  const result = (await func()).ok;
  return result;
};

export async function checkCreatedQuestOfUser() {
  const {user} = store.getState();
  const func = async () => await user.actor.checkCreatedQuestOfUser();
  const rs = (await func()).ok;
  return rs;
}

export async function getAdminQuest() {
  const {user} = store.getState();
  const func = async () => await user.actor.getAdminQuest();
  const rs = (await func()).ok;
  return rs;
}

export async function saveGameScore(questId, characterData){
  const {user} = store.getState();
  const func = async () => await user.actor.saveGameScore(questId, characterData);
  const rs = (await func()).ok;
  return rs;
}

export async function saveGameReward(questId){
  const {user} = store.getState();
  const func = async () => await user.actor.saveGameReward(questId);
  const rs = (await func()).ok;
  return rs;
}

export async function getLeaderBoard(questId){
  const {user} = store.getState();
  const func = async () => await user.actor.getLeaderBoard(questId);
  const rs = (await func()).ok;
  return rs;
}

export {
  getUserInfo,
  loadQuestItems,
  loadCharacter,
  loadCharacterAwait,
  loadEventOptions,
  updateCharacterStats,
  getCharacterStatus,
  characterTakeOption,
  resetCharacter,
  createDefautCharacter,
  characterSelectsItems,
  listCharacterSelectsItems,
  loadItemUrl,
  characterCollectsMaterials,
  createCharacterCollectsMaterials,
  listCharacterCollectsMaterials,
  canGetARItemPromise,
  loadEventItem,
  getHpPotion,
  useHpPotion,
  getUsableItem,
  listStash,
  gainCharacterExp,
  resetCharacterCollectsMaterials,
  characterCollectsMaterialEngines,
  createInventory,
  openInventory,
  getRemainingTime,
  payQuest,
  readEvent,
  listSceneQuests,
  addAllInventory,
  useUsableItem,
  createQuestEngine,
  createEventEngine,
  createEventOptionEngine,
  createScene,
  readEventEngine,
  readSceneEngine,
  loadEventOptionEngines,
  loadQuestItemEngines,
  characterTakeOptionEngine,
}