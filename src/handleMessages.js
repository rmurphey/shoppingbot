const fs = require('fs');
const path = require('path');

const backup = require('./backup');
const parseItem = require('./parseItem');
const reply = require('./reply');

const backupFile = path.join(__dirname, '..', 'shopping.json');
const shoppingLists = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

const actions = [
    'add',
    'update',
    'remove',
    'show',
    'clear',
    'debug',
    'help'
];

module.exports = function handleMessages(bot) {
    bot.message((message) => {
        const { channel, text } = message;
        const [ action, ...items ] = text.toLowerCase().split(',');
        const cleanItems = items
            .map(item => item.trim())
            .filter(item => item);

        if (!actions.includes(action)) { return; }

        if (!shoppingLists[channel]) {
            shoppingLists[channel] = {};
        }

        const list = shoppingLists[channel];
        const answer = [];

        if (action === 'help') {
            answer.push(`*options:* ${actions.join(' ')}`);
        }

        if (action === 'add') {
            cleanItems.forEach((item) => {
                let [ _item, increment ] = parseItem(item); // eslint-disable-line
                increment = +(increment || 1);
                list[_item] = list[_item] ? (list[_item] + increment) : increment;
                answer.push(`:white_check_mark: ${_item} (${list[_item]})`);
            });
        }

        if (action === 'update') {
            cleanItems.forEach((item) => {
                const [ _item, count ] = parseItem(item);
                list[_item] = +count;

                if (!list[_item]) {
                    delete list[_item];
                    answer.push(`:x: ${item}`);
                } else {
                    answer.push(`:white_check_mark: ${_item} (${list[_item]})`);
                }
            });
        }

        if (action === 'remove') {
            cleanItems.forEach((item) => {
                delete list[item];
                answer.push(`:x: ${item}`);
            });
        }

        const formattedList = Object.keys(list).map((k) => {
            const count = list[k] > 1 ? ` (${list[k]})` : '';
            return `${k}${count}`;
        }).join('\n');

        if (action === 'clear') {
            answer.push(':warning: CLEARED LIST!\n');
            answer.push(formattedList);
            delete shoppingLists[channel];
        }

        if (action === 'show') {
            answer.push(':memo:');

            if (cleanItems.length) {
                cleanItems.forEach((item) => {
                    const count = list[item] > 1 ? ` (${list[item]})` : '';
                    answer.push(`${item}${count}`);
                });
            } else {
                answer.push(formattedList);
            }
        }

        if (action === 'debug') {
            answer.push('```' + JSON.stringify(shoppingLists, null, 2) + '```'); // eslint-disable-line
        }

        backup(backupFile, shoppingLists, (err) => {
            if (err) {
                console.error(err);
            }

            reply(answer, channel);
        });
    });
};
