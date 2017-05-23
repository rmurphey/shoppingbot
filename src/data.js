const fs = require('fs');
const { BACKUP_FILE } = require('./constants');

let shoppingLists;

try {
    shoppingLists = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
} catch (e) {
    shoppingLists = {};
}

function backup() {
    fs.writeFile(BACKUP_FILE, JSON.stringify(shoppingLists, null, 2));
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
        backup();
    },

    updateList(channel, obj) {
        shoppingLists[channel] = Object.assign({}, shoppingLists[channel], obj);

        Object.keys(shoppingLists[channel]).forEach((k) => {
            if (!shoppingLists[channel][k]) {
                delete shoppingLists[channel][k];
            }
        });

        backup();
    },

    deleteItem(channel, item) {
        delete shoppingLists[channel][item];
        backup();
    },

    getCount(channel, item) {
        return shoppingLists[channel][item];
    }
};
