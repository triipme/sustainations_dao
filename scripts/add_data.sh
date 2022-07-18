# dfx canister call sustainations_dao createQuest '(record{name="Jungle Tour";price=0;description="Jungle Tour"})'
# dfx canister call sustainations_dao listQuests

dfx canister call sustainations_dao createEvent '("Jungle Tour",record{description="There is one trouble is occurs : Dense bushes are blocking the way";locationName="Position 1";destinationName="The Old Tree 1000 years old on the Position 6"})'
dfx canister call sustainations_dao createEvent '("Jungle Tour",description="Met a waterfall";locationName="Position 1";destinationName="The Old Tree 1000 years old on the Position 6"})'
dfx canister call sustainations_dao createEvent '("Jungle Tour",description="Encouter a herd of monkeys";locationName="Position 1";destinationName="The Old Tree 1000 years old on the Position 6"})'
dfx canister call sustainations_dao createEvent '("Jungle Tour",description="Camping Spot";locationName="Position 1";destinationName="The Old Tree 1000 years old on the Position 6"})'
dfx canister call sustainations_dao createEvent '("Jungle Tour",description="Encounters a large tree blocking the way";locationName="Position 1";destinationName="The Old Tree 1000 years old on the Position 6"})'
dfx canister call sustainations_dao createEvent '("Jungle Tour",description="There is a river near the path";locationName="Position 1";destinationName="The Old Tree 1000 years old on the Position 6"})'
dfx canister call sustainations_dao listEvents

# dfx canister call sustainations_dao createItem '(record{name="Knife";strengthRequire=0.5})'
# dfx canister call sustainations_dao createItem '(record{name="Food";strengthRequire=0.5})'
# dfx canister call sustainations_dao createItem '(record{name="Rope & Hook";strengthRequire=1.0})'
# dfx canister call sustainations_dao createItem '(record{name="Saw";strengthRequire=0.5})'
# dfx canister call sustainations_dao createItem '(record{name="Medicine";strengthRequire=0.5})'
# dfx canister call sustainations_dao createItem '(record{name="Climbing stick";strengthRequire=1})'
# dfx canister call sustainations_dao createItem '(record{name="Bicycle";strengthRequire=5})'
# dfx canister call sustainations_dao createItem '(record{name="Tent";strengthRequire=3})'
# dfx canister call sustainations_dao createItem '(record{name="Clothes";strengthRequire=2})'
# dfx canister call sustainations_dao createItem '(record{name="Camera";strengthRequire=1.5})'
# dfx canister call sustainations_dao createItem '(record{name="Water";strengthRequire=0.5})'
# dfx canister call sustainations_dao createItem '(record{name="Inflatable Boat & paddle";strengthRequire=4})'
# dfx canister call sustainations_dao createItem '(record{name="Antidote";strengthRequire=0.5})'
# dfx canister call sustainations_dao listItems

# dfx canister call sustainations_dao createCharacterClass '(record{name="Trekker";specialAbility="Recover Stamina";description="Test Trekker";baseMana=3.0;baseHP=6.0;baseMorale=6.0;baseStamina=7.0;baseStrength=6.0;baseIntelligence=0;baseVitality=0;baseLuck=0})'
# dfx canister call sustainations_dao listCharacterClasses

# dfx canister call sustainations_dao createEventOption '(record{eventId="63BE4955-BAD5-4E90-8875-F78A58C57F0F";description="Cut the bushes to open the way with a Knife";requireItemIds=vec{"2B8A0551-8B75-4739-9926-91C9C2C332F4";"32F2711E-7C04-4B93-9C0A-471D439B441D"};lossHP=1.0;lossMana=0.0;lossStamina=2.0;lossMorale=1.0;riskChance=0.0;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck=0.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="63BE4955-BAD5-4E90-8875-F78A58C57F0F";description="Find a way out without chopping down the bushes";requireItemIds=vec{};lossHP=2.0;lossMana=0.0;lossStamina=1.0;lossMorale=2.0;riskChance=0.6;riskLost="Drop down some material from your bag";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.1;gainByLuck=5.0;gainOther=0.0})'

# dfx canister call sustainations_dao createEventOption '(record{eventId="38431F2C-ED97-41C9-9DE1-18219420373A";description="Follow the cliffs to climb up the waterfall";requireItemIds=vec{};lossHP=1.0;lossMana=0.0;lossStamina=2.0;lossMorale=1.0;riskChance=0.6;riskLost="Lost some item/material";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.2;gainByLuck=5.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9";description="Use Robes and hooks to climb up the waterfall";requireItemIds=vec{"320C678E-A333-43BA-8DEE-4F5E4C12CCC5"};lossHP=2.0;lossMana=0.0;lossStamina=3.0;lossMorale=0.0;riskChance=0.4;riskLost="";lossOther="Drop item";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.1;gainByLuck=5.0;gainOther=0.0})'

# dfx canister call sustainations_dao createEventOption '(record{eventId="E5DA064C-3CB9-4673-B5A7-F840918EB2F3";description="Give them some food";requireItemIds=vec{"9D42B54D-C838-49A0-A19F-495C18A861EB"};lossHP=1.0;lossMana=0.0;lossStamina=1.0;lossMorale=2.0;riskChance=0.3;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.4;gainByLuck=0.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9";description="Ignore and find the way to pass through them";requireItemIds=vec{};lossHP=1.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.7;riskLost="";lossOther="";gainExp=5;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck=0.0;gainOther=0.0})'

# dfx canister call sustainations_dao createEventOption '(record{eventId="E5DA064C-3CB9-4673-B5A7-F840918EB2F3";description="Cook";requireItemIds=vec{"9D42B54D-C838-49A0-A19F-495C18A861EB"};lossHP=1.0;lossMana=0.0;lossStamina=0.0;lossMorale=0.0;riskChance=0.0;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck=0.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9";description="Take a rest";requireItemIds=vec{};lossHP=1.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.0;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck=0.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9";description="Continue";requireItemIds=vec{};lossHP=1.0;lossMana=0.0;lossStamina=2.0;lossMorale=0.0;riskChance=0.0;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.0;gainByLuck=0.0;gainOther=0.0})'

# dfx canister call sustainations_dao createEventOption '(record{eventId="E5DA064C-3CB9-4673-B5A7-F840918EB2F3";description="Use a knife to cut branches to open the way";requireItemIds=vec{"2B8A0551-8B75-4739-9926-91C9C2C332F4";"32F2711E-7C04-4B93-9C0A-471D439B441D"};lossHP=1.0;lossMana=0.0;lossStamina=3.0;lossMorale=1.0;riskChance=0.0;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.7;gainByLuck=0.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9";description="Find another way to go";requireItemIds=vec{};lossHP=0.0;lossMana=0.0;lossStamina=1.0;lossMorale=1.0;riskChance=0.8;riskLost="Go back to position 3";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.01;gainByLuck=0.0;gainOther=0.0})'

# dfx canister call sustainations_dao createEventOption '(record{eventId="E5DA064C-3CB9-4673-B5A7-F840918EB2F3";description="Use inflatable boat to go through the river";requireItemIds=vec{};lossHP=1.0;lossMana=0.0;lossStamina=3.0;lossMorale=1.0;riskChance=0.0;riskLost="";lossOther="";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.7;gainByLuck=0.0;gainOther=0.0})'
# dfx canister call sustainations_dao createEventOption '(record{eventId="5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9";description="Continue to move along the river-bank";requireItemIds=vec{};lossHP=0.0;lossMana=0.0;lossStamina=1.0;lossMorale=1.0;riskChance=0.7;riskLost="Washed away by the water";lossOther="Lost Everything";gainExp=10;gainHP=0.0;gainStamina=0.0;gainMorale=0.0;gainMana=0.0;luckyChance=0.01;gainByLuck=0.0;gainOther=0.0})'


dfx canister call sustainations_dao createGearClass '(record{name="Shoes";description="10% Stamina Cost";mainStat=10})'
dfx canister call sustainations_dao createGearClass '(record{name="Shirt";description="+3 Vitality";mainStat=3})'
dfx canister call sustainations_dao createGearClass '(record{name="Pants";description="+3 Strength";mainStat=3})'
dfx canister call sustainations_dao createGearClass '(record{name="Belt";description="+3 Luck";mainStat=3})'
dfx canister call sustainations_dao createGearClass '(record{name="Hat";description="+3 Intelligent";mainStat=3})'

dfx canister call sustainations_dao createGearRarity '(record{name="Normal";description="Normal";boxColor="Black"})'
dfx canister call sustainations_dao createGearRarity '(record{name="Rare";description="Rare";boxColor="Blue"})'
dfx canister call sustainations_dao createGearRarity '(record{name="Epic";description="Epic";boxColor="Epic"})'
dfx canister call sustainations_dao createGearRarity '(record{name="Legendary";description="Legendary";boxColor="Orange"})'
dfx canister call sustainations_dao createGearRarity '(record{name="Perfect Legendary";description="Perfect Legendary";boxColor="Red"})'