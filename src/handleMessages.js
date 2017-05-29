const parseItem = require('./parseItem');
const reply = require('./reply');
const data = require('./data');

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

module.exports = function handleMessages(bot) {
    bot.message((message) => {
        const { channel, text } = message;
        const list = data.getList(channel);
        const [ action, ...items ] = text.toLowerCase().split(' ');

        if (!actions.includes(action)) { return; }

        const answer = [];

        const cleanItems = (items || '').join(' ')
            .split(',')
            .map(item => item.trim())
            .filter(item => item);

        if (action === 'help') {
            answer.push(`*options:* ${actions.join(' ')}`);
        }

        if (action === 'add') {
            cleanItems.forEach((item) => {
                let [ _item, increment ] = parseItem(item); // eslint-disable-line
                increment = +(increment || 1);
                data.updateList(channel, {
                    [_item]: list[_item] ? (list[_item] + increment) : increment
                });

                answer.push(`:white_check_mark: ${_item} (${data.getCount(channel, _item)})`);
            });
        }

        if (action === 'update') {
            cleanItems.forEach((item) => {
                const [ _item, count ] = parseItem(item);

                if (!+count) {
                    data.deleteItem(channel, _item);
                    answer.push(`:x: ${_item}`);
                } else {
                    data.updateList(channel, { [_item]: +count });
                    answer.push(`:white_check_mark: ${_item} (${+count})`);
                }
            });
        }

        if (action === 'remove') {
            cleanItems.forEach((item) => {
                data.deleteItem(channel, item);
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
            data.deleteList(channel);
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
            answer.push('```' + JSON.stringify(list, null, 2) + '```'); // eslint-disable-line
        }

        if (action === 'shop') {
            answer.push(`https://${process.env.HOST}/channel/${channel}`);
        }

        reply(answer, channel);
    });
};
