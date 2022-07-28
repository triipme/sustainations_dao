import store from 'app/store';

// call api
async function loadQuestItems(questId){
  const { user } = store.getState();
  const listQuestItems = async () => await  user.actor.listQuestItems(questId);
  const questItems = (await listQuestItems()).ok;
  return questItems;
};

async function loadCharacter(characterId){
  const { user } = store.getState();
  const readCharacter = async () => await user.actor.readCharacter(characterId);
  const character = (await readCharacter()).ok;
  return character;
};

async function loadEventOptions(eventId){
  const { user } = store.getState();
  const listEventOptions = async () => await user.actor.listEventOptions(eventId);
  const eventOptions = (await listEventOptions()).ok;
  return eventOptions;
};

async function characterTakeOption(eventId, characterId){
  const { user } = store.getState();
  const takeOption = async () => await user.actor.takeOption(eventId, characterId);
  const result = (await takeOption()).ok;
  return result;
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

function getCharacterStatus(characterId){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getCharacterStatus(characterId);
    resolve(rs);
  });
};

async function resetCharacter(characterId){
  const { user } = store.getState();
  const reset = async () => await user.actor.resetCharacterStat(characterId);
  const result = (await reset()).ok;
  return result;
};

export {
  loadQuestItems,
  loadCharacter,
  loadEventOptions,
  updateCharacterStats,
  getCharacterStatus,
  characterTakeOption,
  resetCharacter
}