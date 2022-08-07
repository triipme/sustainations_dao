dfx canister call sustainations_dao createEvent '(record{id="e1";questId="jungle";description="Dense bushes a blocking your way";locationName="Position1";destinationName="Position2"})'
dfx canister call sustainations_dao createEvent '(record{id="e2";questId="jungle";description="You meet a waterfall";locationName="Position2";destinationName="Position3"})'
dfx canister call sustainations_dao createEvent '(record{id="e3";questId="jungle";description="You encouter a herd of monkeys";locationName="Position3";destinationName="Position4"})'
dfx canister call sustainations_dao createEvent '(record{id="e4";questId="jungle";description="You arrive at camping spot";locationName="Position4";destinationName="Position5"})'
dfx canister call sustainations_dao createEvent '(record{id="e5";questId="jungle";description="You encounters a large tree blocking the way";locationName="Position5";destinationName="Position6"})'
dfx canister call sustainations_dao createEvent '(record{id="e7";questId="catalonia1";description="Visit cathedral Santa Maria";locationName="La Seu d’Urgell";destinationName="El Ges"})'
dfx canister call sustainations_dao createEvent '(record{id="e8";questId="catalonia1";description="You moved to El Ges";locationName="El Ges";destinationName="Adraén"})'
dfx canister call sustainations_dao createEvent '(record{id="e9";questId="catalonia1";description="You moved to Adraén";locationName="Adraén";destinationName="Fórnols"})'
dfx canister call sustainations_dao createEvent '(record{id="e10";questId="catalonia1";description="You moved  to Fórnols";locationName="Fórnols";destinationName="Tuixent"})'
dfx canister call sustainations_dao createEvent '(record{id="e11";questId="catalonia1";description="You moved to Tuixent";locationName="Tuixent";destinationName="Gósol"})'
dfx canister call sustainations_dao createEvent '(record{id="e12";questId="catalonia1";description="You came to Gósol";locationName="Gósol";destinationName="Pedraforca Mountain"})'
dfx canister call sustainations_dao createEvent '(record{id="e13";questId="catalonia1";description="You are on Pedrafocra Mountain Phase 1";locationName="Pedraforca Mountain Phase 1";destinationName="Pedraforca Mountain Phase 2"})'
dfx canister call sustainations_dao createEvent '(record{id="e14";questId="catalonia1";description="You are on Pedrafocra Mountain Phase 2";locationName="Pedraforca Mountain Phase 2";destinationName="Guardiola de Baguedà"})'
dfx canister call sustainations_dao createEvent '(record{id="e15";questId="catalonia1";description="You came by Guardiola de Baguedà";locationName="Guardiola de Baguedà";destinationName="Bagà"})'
dfx canister call sustainations_dao createEvent '(record{id="e16";questId="catalonia1";description="You are at Bagà, the first stop of your long trip";locationName="Bagà";destinationName="Beller de Cerdanya"})'

dfx canister call sustainations_dao deleteEventOption '("eo28")'
dfx canister call sustainations_dao deleteEventOption '("eo29")'
dfx canister call sustainations_dao deleteEventOption '("eo30")'
dfx canister call sustainations_dao deleteEventOption '("eo33")'
dfx canister call sustainations_dao deleteEventOption '("eo38")'
dfx canister call sustainations_dao deleteEventOption '("eo39")'
dfx canister call sustainations_dao deleteEventOption '("eo40")'
dfx canister call sustainations_dao deleteEventOption '("eo41")'
dfx canister call sustainations_dao deleteEventOption '("eo42")'
dfx canister call sustainations_dao deleteEventOption '("eo45")'

dfx canister call sustainations_dao updateEventOption '(record{id="eo14";eventId="e7";description="Take a picture with camera";requireItemId="i7";lossHP=0.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=1.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo15";eventId="e7";description="Just take a walk and observe the cathedral";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=3.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo16";eventId="e8";description="Take a rest";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=2.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.4;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo17";eventId="e8";description="Have lunch in the village";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="money";gainExp=5;gainHP=2.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo18";eventId="e8";description="Visit the village";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=2.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.3;gainByLuck="seed";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo19";eventId="e9";description="Take a rest";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=2.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.4;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo20";eventId="e9";description="Have lunch in the village";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="money";gainExp=5;gainHP=2.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo21";eventId="e9";description="Visit the village";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=2.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.3;gainByLuck="seed";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo22";eventId="e10";description="Take a rest";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=2.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.4;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo23";eventId="e10";description="Have lunch in the village";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="money";gainExp=5;gainHP=2.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo24";eventId="e10";description="Visit the village";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=2.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.3;gainByLuck="seed";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo25";eventId="e11";description="Take a rest";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=2.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.4;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo26";eventId="e11";description="Have lunch in the village";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="money";gainExp=5;gainHP=2.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo27";eventId="e11";description="Visit the village";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=2.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.3;gainByLuck="seed";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo31";eventId="e12";description="Visit Centre Picasso de Gósol";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo32";eventId="e12";description="Take a picture with camera at Centre Picasso de Gósol";requireItemId="i7";lossHP=0.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=3.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo34";eventId="e13";description="Search around";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=1.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=3.0;gainMana=0.0;luckyChance=0.3;gainByLuck="seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo35";eventId="e13";description="Take a picture with camera and enjoy the view";requireItemId="i7";lossHP=0.0;lossMana=0.0;lossStamina=1.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo36";eventId="e14";description="Going down the mountain";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.7;riskLost="seed";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo37";eventId="e14";description="Going down the mountain with Rope & Hook";requireItemId="i10";lossHP=0.0;lossMana=0.0;lossStamina=1.0;lossMorale=0.0;riskChance=0.5;riskLost="seed";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo43";eventId="e15";description="Visit Benedictine cenotaph of Sant Lloranç";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=1.0;lossMorale=0.0;riskChance=0.5;riskLost="seed";lossOther="null";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=2.0;gainMana=0.0;luckyChance=0.3;gainByLuck="normal gear";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo44";eventId="e15";description="Enjoy the special recipe";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="money";gainExp=0;gainHP=1.0;gainStamina=1.0;gainMorale=1.0;gainMana=1.0;luckyChance=0.3;gainByLuck="normal gear";gainOther=0.0})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo46";eventId="e16";description="Take a picture";requireItemId="i7";lossHP=1.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="waiting";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo47";eventId="e16";description="Visit the village";requireItemId="null";lossHP=0.0;lossMana=0.0;lossStamina=2.0;lossMorale=2.0;riskChance=0.0;riskLost="null";lossOther="money";gainExp=0;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck="null";gainOther=0.0})'
