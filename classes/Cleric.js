const BaseClass = require('./BaseClass');

class Cleric extends BaseClass {
    constructor() {
        super();
        this.vitality = 12;
        this.strength = 11;
        this.dexterity = 8;
        this.resistance = 11;
        this.intelligence = 7;
        this.faith = 16;
        this.luck = 7;
        this.health = 100;
        this.maxHealth = 100;
    }
}

module.exports = Cleric;