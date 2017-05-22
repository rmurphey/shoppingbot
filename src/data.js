const fs = require('fs');
const { BACKUP_FILE } = require('./constants');

let shoppingLists;

try {
    shoppingLists = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
} catch (e) {
    shoppingLists = {};
}

const noop = (err) => { console.error(err); };

console.log('init data', shoppingLists);

function backup(cb) {
    fs.writeFile(BACKUP_FILE, JSON.stringify(shoppingLists, null, 2), cb || noop);
}

module.exports = {
    getList(channel) {
        console.log('get list')
        if (!shoppingLists[channel]) {
            shoppingLists[channel] = {};
        }

        return shoppingLists[channel];
    },

    deleteList(channel) {
        console.log('delete list')
        delete shoppingLists[channel];
        backup();
    },

    updateList(channel, obj) {
        console.log('update list')
        shoppingLists[channel] = Object.assign({}, shoppingLists[channel], obj);

        Object.keys(shoppingLists[channel]).forEach((k) => {
            if (!shoppingLists[channel][k]) {
                delete shoppingLists[channel][k];
            }
        });

        backup();
    },

    deleteItem(channel, item) {
        console.log('delete item')
        delete shoppingLists[channel][item];
        backup();
    },

    getCount(channel, item) {
        console.log('get count')
        return shoppingLists[channel][item];
    }
};
