dfx canister call sustainations_dao createQuest '(record{name="Jungle Tour";price=0;description="Jungle Tour"})'
dfx canister call sustainations_dao listQuests

dfx canister call sustainations_dao createItem '(record{name="Knife";strengthRequire=0.5})'
dfx canister call sustainations_dao createItem '(record{name="Food";strengthRequire=0.5})'
dfx canister call sustainations_dao createItem '(record{name="Rope & Hook";strengthRequire=1.0})'
dfx canister call sustainations_dao createItem '(record{name="Saw";strengthRequire=0.5})'
dfx canister call sustainations_dao listItems

dfx canister call sustainations_dao createCharacterClass '(record{name="Trekker";specialAbility="Recover Stamina";description="Test Trekker";baseMana=3.0;baseHP=6.0;baseMorale=6.0;baseStamina=7.0;baseStrength=6.0;baseIntelligence=0;baseVitality=0;baseLuck=0})'
dfx canister call sustainations_dao listCharacterClasses