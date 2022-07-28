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

// async function updateCharacterStats(character){
//   const { user } = store.getState();
//   const updateCharacter = async () => await user.actor.updateCharacter(character);
//   const updated = await updateCharacter();
//   console.log("GG");
// };

function updateCharacterStats(character){
  const gg = new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.updateCharacter(character);
    resolve(rs);
  })
  gg.then((data)=>{
    console.log(data);
    return data;
  })
};


// async function getCharacterStatus(characterId){
//   const { user } = store.getState();
//   const getStatus = async () => await user.actor.getStatus(characterId);
//   const status = await getStatus();
// };

function getCharacterStatus(characterId){
  return new Promise((resolve, reject) => {
    const { user } = store.getState();
    const rs = user.actor.getCharacterStatus(characterId);
    resolve(rs);
  });
};

export {
  loadQuestItems,
  loadCharacter,
  loadEventOptions,
  updateCharacterStats,
  getCharacterStatus,
  characterTakeOption
}