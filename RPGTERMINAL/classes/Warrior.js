const BaseClass = require('./BaseClass');

class Warrior extends BaseClass {
    constructor() {
        super();
        this.vitality = 15;
        this.strength = 14;
        this.dexterity = 11;
        this.resistance = 12;      // High physical resistance
        this.magicResistance = 8;  // Weak against magic
        this.faithResistance = 10; // Average faith resistance
        this.intelligence = 9;
        this.faith = 9;
        this.luck = 7;
        this.health = 110;
        this.maxHealth = 110;
    }
}

module.exports = Warrior;