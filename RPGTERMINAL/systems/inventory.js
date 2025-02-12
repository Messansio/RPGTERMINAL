const { getInput } = require('../utils/input');

async function showInventory(player) {
    console.log('\n=== INVENTORY ===');
    
    if (!player.inventory || player.inventory.length === 0) {
        console.log('Inventory is empty');
        return;
    }

    // Show equipped items
    console.log('\n=== EQUIPPED ===');
    if (player.equipment.shield) {
        console.log(`Shield: ${player.equipment.shield.name} (defense: +${player.equipment.shield.value})`);
    }

    // Show inventory items
    console.log('\n=== ITEMS ===');
    player.inventory.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.effect}: +${item.value})`);
    });

    // Ask to use/equip item
    const choice = await getInput('\nUse/Equip item (0 to exit): ');
    if (choice > 0 && choice <= player.inventory.length) {
        await useItem(player, choice - 1);
    }
}

async function useItem(player, index) {
    const item = player.inventory[index];

    switch(item.effect) {
        case 'heal':
            player.health = Math.min(player.maxHealth, player.health + item.value);
            console.log(`Used ${item.name}! Healed for ${item.value}`);
            console.log(`Health: ${player.health}/${player.maxHealth}`);
            player.inventory.splice(index, 1);
            break;
        case 'defense':
            player.equipShield(item);
            player.inventory.splice(index, 1);
            break;
        case 'strength':
            player.strength += item.value;
            console.log(`Used ${item.name}! Strength increased by ${item.value}`);
            player.inventory.splice(index, 1);
            break;
        default:
            console.log('Cannot use this item');
            return false;
    }
    return true;
}

module.exports = { 
    showInventory,
    useItem
};