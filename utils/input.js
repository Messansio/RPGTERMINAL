const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getText(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, answer => resolve(answer.trim()));
    });
}

async function getInput(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, answer => {
            const num = parseInt(answer);
            if (isNaN(num)) {
                console.log('Please enter a valid number');
                resolve(null);
            } else {
                resolve(num);
            }
        });
    });
}

async function getChoice(min, max) {
    while (true) {
        const choice = await getInput(`Enter choice (${min}-${max}): `);
        if (choice >= min && choice <= max) {
            return choice;
        }
        console.log(`Please enter a number between ${min} and ${max}`);
    }
}

module.exports = {
    getInput,
    getChoice,
    getText,
    rl
};