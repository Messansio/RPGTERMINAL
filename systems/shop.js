const fs = require('fs');
const path = require('path');

function printShop(items) {
    console.log("-------------- Shop --------------\n");
    
    for (let i = 0; i < items.length; i++) {
        console.log(`${items[i].name.padEnd(20, ' ')}\t${items[i].value}`);
        console.log("---------------------------------");
    }
}

let items = []; // Inizializza items come array vuoto

try {
    // Correggi l'errore di battitura qui
    items = JSON.parse(fs.readFileSync(path.join('data', 'consumables.json'))).consumables;
} catch (error) {
    console.error("Errore nel caricamento del file JSON:", error);
    return; // Esci dalla funzione in caso di errore
}

// Controlla se items è definito e un array
if (Array.isArray(items)) {
    printShop(items);
} else {
    console.error("La proprietà 'consumables' non è un array o non è definita.");
}