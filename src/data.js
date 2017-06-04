const fs = require('fs');
const { BACKUP_FILE } = require('./constants');
const reply = require('./reply');

let shoppingLists = {};

try {
    shoppingLists = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
} catch (e) {
    console.warn(`Error reading ${BACKUP_FILE}`);
}

function backup(channel) {
    fs.writeFile(BACKUP_FILE, JSON.stringify(shoppingLists, null, 2), (err) => {
        if (err) {
            console.error(err);
            reply([ `Error writing backup file ${BACKUP_FILE}`, err.toString() ], channel);
        }
    });
}

module.exports = {
    getList(channel) {
        if (!shoppingLists[channel]) {
            shoppingLists[channel] = {};
        }

        return shoppingLists[channel];
    },

    deleteList(channel) {
        delete shoppingLists[channel];
        backup(channel);
    },

    updateList(channel, obj) {
        shoppingLists[channel] = Object.assign({}, shoppingLists[channel], obj);

        Object.keys(shoppingLists[channel]).forEach((k) => {
            if (!shoppingLists[channel][k]) {
                delete shoppingLists[channel][k];
            }
        });

        backup(channel);
    },

    deleteItem(channel, item) {
        delete shoppingLists[channel][item];
        backup(channel);
    },

    getCount(channel, item) {
        return shoppingLists[channel][item];
    }
};
