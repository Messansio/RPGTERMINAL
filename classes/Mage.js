const BaseClass = require('./BaseClass');

class Mage extends BaseClass {
    constructor() {
        super();
        this.vitality = 9;
        this.strength = 7;
        this.dexterity = 12;
        this.resistance = 8;
        this.intelligence = 15;
        this.faith = 7;
        this.luck = 11;
        this.health = 85;
        this.maxHealth = 85;
    }
}

module.exports = Mage;