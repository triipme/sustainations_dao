dfx canister call sustainations_dao createQuestEngine '(record{id="test";name="Test Engine";description="Test Description";price = 0;images="Lake.png"})'

dfx canister call sustainations_dao createEventEngine '(record{id="ev1";questId="test";description="On the bench, there is a question. Find the correct answer to continue or else. “What is able to go up a chimney when down but unable to go down a chimney when up?”";locationName="spring";destinationName="summer"})'

dfx canister call sustainations_dao createEventOptionEngine '(record{id="eo1";eventId="ev1";description="An umbrella";requireItemId="i7";lossHP=2.0;lossMana=2.0;lossStamina=2.0;lossMorale=2.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao createEventOptionEngine '(record{id="eo2";eventId="ev1";description="A parachute ";requireItemId="null";lossHP=2.0;lossMana=2.0;lossStamina=2.0;lossMorale=2.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'

dfx canister call sustainations_dao createScene '(record{id="s1test"; idQuest= "test";idEvent="ev1"; front="development/engine/scene1/front.png"; mid="development/engine/scene1/mid.png"; back="development/engine/scene1/back.png"; obstacle="development/engine/scene1/obstacle.png"})'