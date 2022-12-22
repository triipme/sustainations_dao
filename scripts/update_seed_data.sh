dfx canister call sustainations_dao updateSeed '(record{id="s1tomato";harvestedProductId="p1tomato";materialId="m3tomato_seed";rowSize=1;columnSize=1;name="Tomato_Seed";description="Tomato Seed";waitTime=120;expiryTime=0;grownCondition="none";minAmount=1;maxAmount=1;})'
dfx canister call sustainations_dao updateSeed '(record{id="s2carrot";harvestedProductId="p2carrot";materialId="m4carrot_seed";rowSize=1;columnSize=1;name="Carrot_Seed";description="Carrot Seed";waitTime=120;expiryTime=0;grownCondition="none";minAmount=1;maxAmount=1;})'
dfx canister call sustainations_dao updateSeed '(record{id="s3wheat";harvestedProductId="p3wheat";materialId="m5wheat_seed";rowSize=1;columnSize=1;name="Wheat_Seed";description="Wheat Seed";waitTime=120;expiryTime=0;grownCondition="none";minAmount=1;maxAmount=1;})'
dfx canister call sustainations_dao restoreProducts
dfx canister call sustainations_dao deleteUsableItem '("ui5")'
dfx canister call sustainations_dao deleteUsableItem '("ui6")'
dfx canister call sustainations_dao deleteUsableItem '("ui7")'
dfx canister call sustainations_dao deleteUsableItem '("ui8")'
dfx canister call sustainations_dao createUsableItem '(record {id = "ui5";increaseStamina = 3.0;name = "Super Potion";increaseMana = 3.0;effect = "none";increaseMorale = 3.0;increaseHP = 3.0;image = "test.jpg";})'