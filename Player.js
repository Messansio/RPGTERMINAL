const Warrior = require('./classes/Warrior');
const Mage = require('./classes/Mage');
const Cleric = require('./classes/Cleric');
const BaseClass = require('./classes/BaseClass');
const { getInput } = require('./utils/input');

class Player {
    constructor() {
        this.name = null; // Initialize as null
        this.class = null;
        this.level = 1;
        this.health = null;
        this.maxHealth = null;
        this.exp = 0;
        this.vitality = null;
        this.strength = null;
        this.dexterity = null;
        this.resistance = null;      // Physical resistance
        this.magicResistance = null; // Magic resistance
        this.faithResistance = null; // Faith/Holy resistance
        this.intelligence = null;
        this.faith = null;
        this.luck = null;
        this.inventory = [];
        this.equipment = {
            shield: null
        };
    }

    setName(name) {
        this.name = name;
    }

    setClass(className) {
        const classes = {
            warrior: Warrior,
            mage: Mage,
            cleric: Cleric
        };

        if (!classes[className.toLowerCase()]) {
            console.log('Invalid class name');
            return false;
        }

        const CharacterClass = classes[className.toLowerCase()];
        const classInstance = new CharacterClass();
        
        // Save name and class
        const playerName = this.name;
        const playerClass = className.toLowerCase();
        
        // Copy class properties
        Object.assign(this, classInstance);
        
        // Restore saved properties
        this.name = playerName;
        this.class = playerClass;
        
        console.log(`You are now a ${className}!`);
        return true;
    }

    takeDamage(damage, type = 'physical') {
        if (this.health <= 0) return;

        let resistance;
        switch(type) {
            case 'magic':
                resistance = this.magicResistance;
                break;
            case 'faith':
                resistance = this.faithResistance;
                break;
            default:
                resistance = this.resistance;
        }

        const actualDamage = Math.max(1, damage - (damage/100) * resistance);
        this.health = Math.max(0, this.health - actualDamage);
        console.log(`${this.name || 'Player'} took ${actualDamage} ${type} damage! Health: ${this.health}/${this.maxHealth}`);
        
        if (this.health <= 0) {
            console.log(`${this.name || 'Player'} has been defeated!`);
            return true; // Indicates defeat
        }
        return false;
    }

    heal(amount) {
        const healAmount = amount * (1 + this.faith * 0.1);
        this.health = Math.min(this.maxHealth, this.health + healAmount);
        console.log(`${this.name} healed for ${healAmount}! Health: ${this.health}/${this.maxHealth}`);
    }

    gainExperience(amount) {
        this.exp += amount;
        console.log(`Gained ${amount} experience points!`);
        
        const expNeeded = this.level * 100;
        if (this.exp >= expNeeded) {
            console.log('Level up available!');
        }
    }

    canLevelUp() {
        return this.exp >= this.level * 100;
    }

    equipShield(shield) {
        if (this.equipment.shield) {
            this.resistance -= this.equipment.shield.value;
        }
        
        this.equipment.shield = shield;
        this.resistance += shield.value;
        console.log(`Equipped ${shield.name}! Defense increased by ${shield.value}`);
    }

    calculateDamage() {
        const baseDamage = this.strength;
        const variation = Math.floor(Math.random() * 6) - 2; // -2 to +3
        return Math.max(1, baseDamage + variation);
    }

    dodge() {
        return Math.random() < this.dexterity * 0.01;
    }
}

module.exports = Player;