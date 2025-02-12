const { getInput } = require('../utils/input');

async function levelUp(player) {
    // Check if enough exp
    const expNeeded = player.level * 100;
    if (player.exp < expNeeded) {
        console.log('Not enough experience to level up!');
        return false;
    }

    const stats = [
        'vitality',    // Increases maxHealth by 10
        'strength',    // Increases damage
        'dexterity',   // Improves dodge chance
        'resistance',  // Reduces damage taken (max 20)
        'intelligence', // Increases magic damage
        'faith',       // Increases healing power
        'luck'        // Improves item drop rate
    ];

    console.log('\nChoose a stat to level up:');
    stats.forEach((stat, index) => {
        // Check if stat exists and has a value
        const statValue = player[stat] || 0;
        console.log(`${index + 1}. ${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${statValue}`);
    });

    const choice = await getInput('\nEnter number (1-7): ');

    if (choice < 1 || choice > stats.length) {
        console.log('Invalid choice!');
        return false;
    }

    const selectedStat = stats[choice - 1];

    if (selectedStat === 'resistance' && player.resistance >= 20) {
        console.log("Resistance is too high\n");
        return false;
    }

    // Increase stat and update derived values
    player[selectedStat] += 1;
    if (selectedStat === 'vitality') {
        player.maxHealth += 10;
    }
    
    // Deduct exp and increase level
    player.exp -= expNeeded;
    player.level += 1;
    
    // Restore full health
    player.health = player.maxHealth;
    
    console.log(`${selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)} increased to ${player[selectedStat]}`);
    console.log(`Level increased to ${player.level}!`);
    console.log(`Health fully restored to ${player.health}/${player.maxHealth}!`);
    console.log(`Remaining exp: ${player.exp}`);
    return true;
}

function checkExperience(player) {
    const expNeeded = player.level * 100;
    console.log(`\nExperience: ${player.exp}/${expNeeded}`);
    console.log(`Level: ${player.level}`);
    if (player.exp >= expNeeded) {
        console.log('Level up available!');
        return true;
    }
    return false;
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