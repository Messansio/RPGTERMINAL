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
const ITEMS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'items.json'))).items;

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
        // Check if player is dead
        if (player.health <= 0) {
            console.log('\n=== GAME OVER ===');
            console.log(`${player.name} has fallen in battle!`);
            console.log(`Final Level: ${player.level}`);
            console.log(`Experience gained: ${player.exp}`);
            isRunning = false;
            exec('taskkill /F /FI "WINDOWTITLE eq RPG Terminal"');
            break;
        }

        console.log('\n=== Game Menu ===');
        console.log('1. Show Stats');
        console.log('2. Check Experience');
        console.log('3. Level Up');
        console.log('4. Explore Dungeon');
        console.log('5. Check Inventory');
        console.log('6. Quit');

        const choice = await getChoice(1, 6);

        switch(choice) {
            case 1:
                showStats(player);
                break;
            case 2:
                checkExperience(player);
                break;
            case 3:
                if (!player.canLevelUp()) {
                    console.log('Not enough experience to level up!');
                    break;
                }
                await levelUp(player);
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
                    console.log('Item added to inventory!');
                }
                break;
            case 5:
                await showInventory(player);
                break;
            case 6:
                console.log('Thanks for playing!');
                isRunning = false;
                exec('taskkill /F /FI "WINDOWTITLE eq RPG Terminal"');
                break;
        }
    }
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
        return { type: 'item', data: item };
    }
}

async function startGame() {
    try {
        const player = await createCharacter();
        await gameLoop(player);
    } catch (error) {
        console.error('Game error:', error);
    } finally {
        rl.close();
    }
}

startGame();