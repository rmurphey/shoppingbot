const async = require('async');

const parseItem = require('./parseItem');
const reply = require('./reply');
const Data = require('./data');
const throwOrElse = require('./throwOrElse');

const actions = [
    'add',
    'update',
    'remove',
    'show',
    'clear',
    'debug',
    'help',
    'shop'
];

function code(str) {
    return '```' + str + '```'; // eslint-disable-line
}

module.exports = function handleMessages(bot, db) {
    const data = new Data(db);

    bot.message((message) => {
        const { channel, text } = message;
        const answer = [];
        const finish = (dataErr) => {
            throwOrElse(dataErr, () => reply(answer, channel));
        };

        if (!text) { return; }

        data.getList(channel, (err, list) => {
            if (err) {
                console.error(err);
                throw err;
            }

            const [ action, ...items ] = text.toLowerCase().split(' ');

            if (!actions.includes(action)) { return; }

            const cleanItems = (items || '').join(' ')
                .split(',')
                .map(item => item.trim())
                .filter(item => item);

            if (action === 'help') {
                answer.push(`*options:* ${actions.join(' ')}`);
                return finish(null);
            }

            if (action === 'add') {
                return async.each(cleanItems, (item, cb) => {
                    let [ _item, increment ] = parseItem(item); // eslint-disable-line
                    increment = +(increment || 1);

                    const newCount = list[_item] ? (list[_item] + increment) : increment;
                    answer.push(`:white_check_mark: ${_item} (${newCount})`);

                    data.updateList(channel, { [_item]: newCount }, cb);
                }, finish);
            }

            if (action === 'update') {
                return async.each(cleanItems, (item, cb) => {
                    const [ _item, count ] = parseItem(item);

                    if (!+count) {
                        answer.push(`:x: ${_item}`);
                        data.deleteItem(channel, _item, cb);
                    } else {
                        answer.push(`:white_check_mark: ${_item} (${+count})`);
                        data.updateList(channel, { [_item]: +count }, cb);
                    }
                }, finish);
            }

            if (action === 'remove') {
                return async.each(cleanItems, (item, cb) => {
                    data.deleteItem(channel, item, cb);
                    answer.push(`:x: ${item}`);
                }, finish);
            }

            const formattedList = Object.keys(list).map((k) => {
                const count = list[k] > 1 ? ` (${list[k]})` : '';
                return `${k}${count}`;
            }).join('\n');

            if (action === 'clear') {
                answer.push(':warning: CLEARED LIST!\n');
                answer.push(formattedList);
                return data.deleteList(channel, finish);
            }

            if (action === 'show') {
                answer.push(':memo:');
                answer.push(formattedList);
                return reply(answer, channel);
            }

            if (action === 'debug') {
                answer.push(`channel: ${channel}`);
                answer.push(code(JSON.stringify(list, null, 2)));
                data.debug(channel, (debugErr, arr) => {
                    answer.push(code(JSON.stringify(arr, null, 2)));
                    finish(debugErr);
                });
            }

            if (action === 'shop') {
                answer.push(`https://${process.env.HOST}/channel/${channel}`);
                return reply(answer, channel);
            }
        });
    });
};
