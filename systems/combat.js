const { getInput } = require('../utils/input');

async function fight(player, monster) {
    console.log(`\n=== COMBAT: ${player.name} vs ${monster.name} ===`);
    let monsterHealth = monster.health;

    while (monsterHealth > 0 && player.health > 0) {
        // Display status
        console.log(`\n${monster.name} HP: ${monsterHealth}`);
        console.log(`Your HP: ${player.health}/${player.maxHealth}`);
        
        // Combat menu
        console.log('\n1. Attack');
        console.log('2. Use Item');
        
        const choice = await getInput('\nWhat will you do? (1-2): ');

        switch(choice) {
            case 1:
                // Player attack
                const playerDamage = calculateDamage(player.strength);
                monsterHealth -= playerDamage;
                console.log(`\nYou dealt ${playerDamage} damage to ${monster.name}!`);
                
                // Monster attack if still alive
                if (monsterHealth > 0) {
                    const monsterDamage = monster.damage;
                    // Check for dodge based on dexterity
                    if (Math.random() < player.dexterity * 0.01) {
                        console.log('You dodged the attack!');
                    } else {
                        player.takeDamage(monsterDamage);
                    }
                }
                break;
            case 2:
                // Show and use inventory
                await useInventoryItem(player);
                break;
            default:
                console.log('Invalid choice!');
        }
    }

    if (monsterHealth <= 0) {
        console.log(`\nYou defeated the ${monster.name}!`);
        // Calculate exp with luck bonus
        const expGained = Math.floor(monster.exp * (1 + player.luck * 0.1));
        player.gainExperience(expGained);
        
        // Drop item chance based on luck
        if (Math.random() < 0.3 + (player.luck * 0.02)) {
            dropItem(player);
        }
        return true;
    }

    console.log('You were defeated!');
    return false;
}

function calculateDamage(strength) {
    const baseDamage = strength;
    const variation = Math.floor(Math.random() * 6) - 2; // -2 to +3
    return Math.max(1, baseDamage + variation);
}

function dropItem(player) {
    const items = [
        { name: 'Health Potion', effect: 'heal', value: 50 },
        { name: 'Wooden Shield', effect: 'defense', value: 5 },
        { name: 'Iron Shield', effect: 'defense', value: 10 }
    ];
    
    const item = items[Math.floor(Math.random() * items.length)];
    player.inventory.push(item);
    console.log(`Found ${item.name}!`);
}

async function useInventoryItem(player) {
    if (player.inventory.length === 0) {
        console.log('No items to use!');
        return;
    }

    console.log('\n=== Items ===');
    player.inventory.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
    });

    const choice = await getInput('\nChoose item (0 to cancel): ');
    if (choice > 0 && choice <= player.inventory.length) {
        const item = player.inventory[choice - 1];
        useItem(player, item, choice - 1);
    }
}

function useItem(player, item, index) {
    switch(item.effect) {
        case 'heal':
            player.health = Math.min(player.maxHealth, player.health + item.value);
            console.log(`Healed for ${item.value}! Health: ${player.health}/${player.maxHealth}`);
            player.inventory.splice(index, 1);
            break;
        case 'defense':
            player.equipShield(item);
            player.inventory.splice(index, 1);
            break;
    }
}

module.exports = { fight };