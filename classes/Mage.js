const BaseClass = require('./BaseClass');

class Mage extends BaseClass {
    constructor() {
        super();
        this.vitality = 10;
        this.strength = 8;
        this.dexterity = 12;
        this.resistance = 8;       // Low physical resistance
        this.magicResistance = 14; // High magic resistance
        this.faithResistance = 10; // Average faith resistance
        this.intelligence = 15;
        this.faith = 8;
        this.luck = 9;
        this.health = 90;
        this.maxHealth = 90;
    }
}

module.exports = Mage;