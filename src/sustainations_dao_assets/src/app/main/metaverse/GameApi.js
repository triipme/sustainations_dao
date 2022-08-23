import store from 'app/store';

// call api
// character
const characterClassId = "cc1";

async function createDefautCharacter(){
  const { user } = store.getState();
  const create = async () => await user.actor.createCharacter(characterClassId);
  const character = (await create()).ok;
  return character;
};

function loadCharacter(){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.readCharacter();
    resolve(rs);
  });
};

async function loadCharacterAwait(){
  const { user } = store.getState();
  const func = async () => await user.actor.readCharacter();
  const rs = (await func()).ok[1];
  return rs;
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

async function characterTakeOption(eventId){
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
function useHpPotion(characterId){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.useHpPotion(characterId);
    resolve(rs);
  });
};

// character selects items
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
  return rs;
};

// character collects materials
async function characterCollectsMaterials(eventId){
  const { user } = store.getState();
  const collectsMaterials = async () => await user.actor.collectsMaterials(eventId);
  const result = (await collectsMaterials()).ok;
  return result;
};

async function createCharacterCollectsMaterials(characterCollectsMaterials){
  const promise = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.createCharacterCollectsMaterials(characterCollectsMaterials);
    resolve(rs);
  })
  promise.then((data)=>{
    return data;
  })
};

async function listCharacterCollectsMaterials(characterId){
  const { user } = store.getState();
  const characterCollectsMaterials = async () => await user.actor.listCharacterCollectsMaterials(characterId);
  const result = (await characterCollectsMaterials()).ok;
  return result;
};

async function resetCharacterCollectsMaterials(characterId){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.resetCharacterCollectsMaterials(characterId);
    resolve(rs);
  });
};

// load quest items
async function loadQuestItems(questId){
  const { user } = store.getState();
  const listQuestItems = async () => await user.actor.listQuestItems(questId);
  const questItems = (await listQuestItems()).ok;
  return questItems;
};

// load event options
async function loadEventOptions(eventId, selectedItemsIds){
  const { user } = store.getState();
  const listEventOptions = async () => await user.actor.listEventOptions(eventId, selectedItemsIds);
  const eventOptions = (await listEventOptions()).ok;
  return eventOptions;
};

// load event items
async function loadEventItem(){
  const { user } = store.getState();
  const func = async () => await user.actor.loadEventItem();
  const result = (await func()).ok;
  return result;
};

function getHpPotion(){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getHpPotion();
    resolve(rs);
  });
};

// get AR item
function canGetARItemPromise(eventItemId){
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
  promise.then((data)=>{
    return data;
  })
};

async function listInventories(characterId){
  const { user } = store.getState();
  const listInventories = async () => await user.actor.listInventories(characterId);
  const rs = (await listInventories()).ok;
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


export {
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
  gainCharacterExp,
  resetCharacterCollectsMaterials,
  createInventory,
  listInventories,
  getRemainingTime
}