# OriginalMS Scripting Architecture Blueprint

This document serves as the master execution ledger for the v62 massive scripting phase. Execution must follow these tracks sequentially to maintain context stability.

## Track 1: Static World NPCs (Nautilus & Victoria Island)
- [x] `1090000.js` - Kyrin (Pirate Job Instructor)
- [x] `1092000.js` - Muirhat
- [x] `1092001.js` - Blackbark
- [x] `1092002.js` - Jack
- [x] `1092007.js` - Bart
- [x] `1092008.js` - Bael
- [x] `1092011.js` - Morgan
- [x] `1092014.js` - Jonathan
- [x] `1092015.js` - Charles
- [x] `1092016.js` - Bonnie
- [x] `1092017.js` - Sharyl
- [x] `1092018.js` - Tangyoon (Nautilus Chef)
- [x] `1092019.js` - Mrs. Reade
- [x] `1094000.js` - Guen (Nautilus Weapon/Armor Seller)
- [x] `1094002.js` - Joyce (Nautilus Potion Seller)

## Track 2: Job Advancement & Quest Chains (Pirate Path)
- [ ] `1090000.js` - Kyrin (1st, 2nd, 3rd, and 4th Job Advancement scripts)
- [ ] `1092011.js` - Morgan (Early tutorial quests)
- [ ] `2166.js` - Pirate 1st Job Advancement quest logic
- [ ] `2167.js` - Pirate 2nd Job Advancement quest logic
- [ ] `2168.js` - Pirate 3rd Job Advancement quest logic
- [ ] `2169.js` - Pirate 4th Job Advancement quest logic
- [ ] `pirate_in0.js` - Portal script for 1st Job test room
- [ ] `pirate_in1.js` - Portal script for 2nd Job test room

## Track 3: Complex State Engines (Monster Carnival PQ & Horntail)
- [ ] `mc_out.js` - Monster Carnival exit portal logic
- [ ] `cpqchallenge.js` - Monster Carnival lobby challenge interaction portal
- [ ] `MCRevive1.js` - CPQ Room 1 Revive Portal
- [ ] `MCRevive2.js` - CPQ Room 2 Revive Portal
- [ ] `MCRevive3.js` - CPQ Room 3 Revive Portal
- [ ] `MCRevive4.js` - CPQ Room 4 Revive Portal
- [ ] `MCRevive5.js` - CPQ Room 5 Revive Portal
- [ ] `MCRevive6.js` - CPQ Room 6 Revive Portal
- [ ] `hontale_BR.js` - Horntail Boss Room entry portal
- [ ] `hontale_Bopen.js` - Horntail specific state logic portal
- [ ] `hontale_C.js` - Horntail Cave logic
- [ ] `hontale_morph2.js` - Horntail phase transition portal
- [ ] `hontale_out1.js` - Horntail exit portal
