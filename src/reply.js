const slack = require('slack');

const token = process.env.SLACK_BOT_TOKEN;

module.exports = function reply(answer, channel) {
    slack.chat.postMessage({
        token,
        channel,
        text: answer.join('\n'),
        username: 'shoppingbot'
    }, (err) => {
        if (err) { throw err; }
    });
};
