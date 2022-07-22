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

async function updateCharacterStats(eventOptionId, characterId){
  const { user } = store.getState();
  const updateCharacter = async () => await user.actor.updateCharacter(eventOptionId, characterId);
  const updated = await updateCharacter();
};

export {
  loadQuestItems,
  loadCharacter,
  loadEventOptions,
  updateCharacterStats
}