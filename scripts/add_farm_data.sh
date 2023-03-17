dfx canister call sustainations_dao createMaterial '(record{id="m7sugarcane_seed"; name="sugarcane_seed"; description="sugar cane seed"})'
dfx canister call sustainations_dao createMaterial '(record{id="m8bean_seed"; name="bean_seed"; description="bean seed"})'

dfx canister call sustainations_dao createSeed '(record{id = "s5sugarcane";harvestedProductId = "p4sugarcane";materialId = "m7sugarcane_seed";rowSize = 1;columnSize = 1;name = "Sugarcane_Seed";description = "Sugar Cane Seed";waitTime = 120;expiryTime = 0;grownCondition = "none";minAmount = 1;maxAmount = 1;})'
dfx canister call sustainations_dao createSeed '(record{id = "s6bean";harvestedProductId = "p5bean";materialId = "m8bean_seed";rowSize = 1;columnSize = 1;name = "Bean_Seed";description = "Bean Seed";waitTime = 120;expiryTime = 0;grownCondition = "none";minAmount = 1;maxAmount = 1;})'

dfx canister call sustainations_dao createProduct '(record{id = "p4sugarcane";name = "Sugar_Cane";description = "Sugar Cane";})'
dfx canister call sustainations_dao createProduct '(record{id = "p5bean";name = "Bean";description = "Bean";})'

dfx canister call sustainations_dao updateEventOption '(record{id="eo99";eventId="e36";description="An umbrella";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed/sugarcane_seed/bean_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo104";eventId="e37";description="A hook";requireItemId="null";lossHP=2.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed/sugarcane_seed/bean_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo109";eventId="e38";description="Your name";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed/sugarcane_seed/bean_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo110";eventId="e39";description="ENT";requireItemId="null";lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed/sugarcane_seed/bean_seed";gainOther=0.0})'
dfx canister call sustainations_dao updateEventOption '(record{id="eo118";eventId="e40";description="A map";requireItemId="null";lossHP=2.0;lossMana=2.0;lossStamina=0.0;lossMorale=1.0;riskChance=0.0;riskLost="null";lossOther="null";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck="tomato_seed/carrot_seed/wheat_seed/sugarcane_seed/bean_seed";gainOther=0.0})'

dfx canister call sustainations_dao createBuildingType '(record{id = "c2";name = "Windmill";price = 10000.0;rowSize = 3;columnSize = 3;buildWaitTime = 0;description = "this construction allow player to craft wheat flour and soy sauce";})'
dfx canister call sustainations_dao createBuildingType '(record{id = "c3";name = "Henhouse";price = 10000.0;rowSize = 3;columnSize = 3;buildWaitTime = 0;description = "this construction allow player to produce eggs";})'
dfx canister call sustainations_dao createBuildingType '(record{id = "c4";name = "Goathouse";price = 10000.0;rowSize = 3;columnSize = 3;buildWaitTime = 0;description = "this construction allow player to produce milks";})'
dfx canister call sustainations_dao createBuildingType '(record{id = "c5";name = "Feedmaker";price = 10000.0;rowSize = 3;columnSize = 3;buildWaitTime = 0;description = "this construction allow player to produce animal feeds";})'

# them produceRecipe va produceRecipeDetail