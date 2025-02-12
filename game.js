const Player = require('./Player');
const { getInput, getChoice, getText, rl } = require('./utils/input');
const { showInventory } = require('./systems/inventory');
const { fight } = require('./systems/combat');
const { levelUp, checkExperience, showStats } = require('./systems/stats');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load JSON data
const MONSTERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'monsters.json'))).monsters;
const SHIELDS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'shields.json'))).shields;
const CONSUMABLES = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'consumables.json'))).consumables;
const WEAPONS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'weapons.json'))).weapons;
const EQUIPPABLES = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'equippables.json'))).equippables;

// Combine all items for random drops
const ITEMS = [...SHIELDS, ...CONSUMABLES, ...WEAPONS, ...EQUIPPABLES];

// Clear terminal on start
console.clear();

async function createCharacter() {
    const player = new Player();
    
    let name;
    while (!name) {
        name = await getText('Enter your character name: ');
        if (!name || name.trim().length === 0) {
            console.log('Name cannot be empty!');
            name = null;
        }
    }
    
    player.setName(name); // Add new method to set name
    console.clear();
    console.log('\nAvailable classes:');
    console.log('1. Warrior - High strength and vitality');
    console.log('2. Mage - High intelligence and dexterity');
    console.log('3. Cleric - High faith and resistance');

    const classChoice = await getChoice(1, 3);
    const classes = ['warrior', 'mage', 'cleric'];
    player.setClass(classes[classChoice - 1]);

    return player;
}

async function gameLoop(player) {
    let isRunning = true;

    while (isRunning) {
        console.clear(); // Clear console before showing menu

        if (player.health <= 0) {
            console.log('\n=== GAME OVER ===');
            console.log(`${player.name} has fallen in battle!`);
            console.log(`Final Level: ${player.level}`);
            console.log(`Experience gained: ${player.exp}`);
            console.log('\nPress Enter to continue...');
            await getText('');
            return false; // Return false to indicate game over
        }

        console.log('\n=== Game Menu ===');
        console.log('1. Show Stats');
        console.log('2. Check Experience');
        console.log('3. Level Up');
        console.log('4. Explore Dungeon');
        console.log('5. Check Inventory');
        console.log('6. Quit');

        const choice = await getChoice(1, 6);

        console.clear(); // Clear console after choice

        switch(choice) {
            case 1:
                showStats(player);
                console.log('\nPress Enter to continue...');
                await getText('');  // Wait for user input
                break;
            case 2:
                await checkExperience(player);
                break;
            case 3:
                if (!player.canLevelUp()) {
                    console.log('Not enough experience to level up!');
                    console.log('\nPress Enter to continue...');
                    await getText('');
                } else {
                    await levelUp(player);
                }
                break;
            case 4:
                const encounter = await exploreDungeon();
                if (encounter.type === 'monster') {
                    const survived = await fight(player, encounter.data);
                    if (!survived) {
                        continue; // Skip to next loop iteration to trigger game over
                    }
                } else {
                    player.inventory.push(encounter.data);
                    console.log(`${encounter.data.name} added to inventory!`);
                    console.log('\nPress Enter to continue...');
                    await getText('');
                }
                break;
            case 5:
                await showInventory(player);
                break;
            case 6:
                console.clear();
                console.log('\n=== Warning ===');
                console.log('Are you sure you want to quit?');
                console.log('Your progress will not be saved!');
                console.log('\n1. Yes');
                console.log('2. No');
                
                const quitChoice = await getChoice(1, 2);
                if (quitChoice === 1) {
                    console.clear();
                    console.log('\nReturning to main menu...');
                    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
                    isRunning = false;
                    return true;
                }
                break;
        }
    }
    return true; // Return true for normal exit
}

async function exploreDungeon() {
    console.log('\nYou see three paths ahead...');
    console.log('1. Path 1');
    console.log('2. Path 2');
    console.log('3. Path 3');

    const choice = await getChoice(1, 3);

    const isMonster = Math.random() < 0.7;
    
    if (isMonster) {
        const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
        console.log(`\nPath ${choice}: You encountered a ${monster.name}!`);
        return { type: 'monster', data: monster };
    } else {
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        console.log(`\nPath ${choice}: You found a ${item.name}!`);
        console.log('Press Enter to continue...');
        await getText('');  // Wait for user input
        return { type: 'item', data: item };
    }
}

async function showStartMenu() {
    let running = true;
    while (running) {
        console.clear();
        console.log('\n=== RPG Terminal ===');
        console.log('1. Start Game');
        console.log('2. Quit');
        
        const choice = await getChoice(1, 2);
        
        switch(choice) {
            case 1:
                try {
                    console.clear();
                    const player = await createCharacter();
                    await gameLoop(player);
                    continue; // Always return to menu
                } catch (error) {
                    console.error('Game error:', error);
                }
                break;
            case 2:
                console.clear();
                console.log('\n=== Warning ===');
                console.log('Are you sure you want to quit?');
                console.log('\n1. Yes');
                console.log('2. No');
                
                const quitChoice = await getChoice(1, 2);
                if (quitChoice === 1) {
                    console.clear();
                    console.log('Thanks for playing!');
                    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
                    running = false;
                    exec('taskkill /F /FI "WINDOWTITLE eq RPG Terminal"');
                }
                break;
        }
    }
}

async function startGame() {
    try {
        await showStartMenu();
    } catch (error) {
        console.error('Game error:', error);
    } finally {
        rl.close();
    }
}

startGame();