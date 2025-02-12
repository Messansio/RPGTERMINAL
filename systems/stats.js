const { getInput, getText } = require('../utils/input');

async function levelUp(player) {
    console.clear();
    console.log('\n=== LEVEL UP! ===');
    player.level++;
    player.exp -= (player.level - 1) * 100;
    
    // Base stat increases
    player.maxHealth += 10;
    player.health = player.maxHealth;
    player.strength += 2;
    player.dexterity += 2;
    player.intelligence += 2;
    player.faith += 2;
    player.resistance += 1;
    player.magicResistance += 1;
    player.faithResistance += 1;
    player.luck += 1;

    console.log(`You are now level ${player.level}!`);
    console.log('\nStats increased:');
    console.log('Health +10');
    console.log('Strength +2');
    console.log('Dexterity +2');
    console.log('Intelligence +2');
    console.log('Faith +2');
    console.log('All Resistances +1');
    console.log('Luck +1');
    
    console.log('\nPress Enter to continue...');
    await getText('');
}

async function checkExperience(player) {
    const expNeeded = player.level * 100;
    console.clear();
    console.log('\n=== EXPERIENCE ===');
    console.log(`Experience: ${player.exp}/${expNeeded}`);
    
    if (player.canLevelUp()) {
        console.log('\nLevel up available! Press Enter to continue...');
        await getText('');
        await levelUp(player);
    } else {
        console.log('\nPress Enter to continue...');
        await getText('');
    }
    console.clear();
}

function showStats(player) {
    console.log('\n=== CHARACTER STATS ===');
    console.log(`Name: ${player.name}`);
    console.log(`Class: ${player.class}`);
    console.log(`Level: ${player.level}`);
    console.log(`Health: ${player.health}/${player.maxHealth}`);
    console.log(`Vitality: ${player.vitality}`);
    console.log(`Strength: ${player.strength}`);
    console.log(`Dexterity: ${player.dexterity}`);
    console.log(`Resistance: ${player.resistance}`);
    console.log(`Intelligence: ${player.intelligence}`);
    console.log(`Faith: ${player.faith}`);
    console.log(`Luck: ${player.luck}`);
}

module.exports = {
    levelUp,
    checkExperience,
    showStats
};