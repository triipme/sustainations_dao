dfx canister call sustainations_dao createMaterial '(record{id="m3tomato_seed"; name="tomato_seed"; description="tomato seed"})'
dfx canister call sustainations_dao createMaterial '(record{id="m4carrot_seed"; name="carrot_seed"; description="carrot seed"})'
dfx canister call sustainations_dao createMaterial '(record{id="m5wheat_seed"; name="wheat_seed"; description="wheat seed"})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo99";eventId="e36";description="An umbrella";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo104";eventId="e37";description="A hook";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo109";eventId="e38";description="Your name";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo110";eventId="e39";description="ENT";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo118";eventId="e40";description="A map";requireItemId="null";lossHP=2.0;lossMana=2.0;lossStamina=0.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed";gainOther=0.0})'

dfx canister call sustainations_dao createSeed '(record{id="s1tomato";harvestedProductId="ui5";materialId="m3tomato_seed";rowSize=1;columnSize=1;name="Tomato_Seed";description="Tomato Seed";waitTime=120;expiryTime=0;grownCondition="none";minAmount=1;maxAmount=1})'
dfx canister call sustainations_dao createSeed '(record{id="s2carrot";harvestedProductId="ui6";materialId="m4carrot_seed";rowSize=1;columnSize=1;name="Carrot_Seed";description="Carrot Seed";waitTime=120;expiryTime=0;grownCondition="none";minAmount=1;maxAmount=1})'
dfx canister call sustainations_dao createSeed '(record{id="s3wheat";harvestedProductId="ui7";materialId="m5wheat_seed";rowSize=1;columnSize=1;name="Wheat_Seed";description="Wheat Seed";waitTime=120;expiryTime=0;grownCondition="none";minAmount=1;maxAmount=1})'