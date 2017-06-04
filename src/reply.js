const slack = require('slack');

const token = process.env.SLACK_BOT_TOKEN;

module.exports = function reply(answer, channel) {
    slack.chat.postMessage({
        token,
        channel,
        text: answer.join('\n'),
        username: process.env.SLACK_USERNAME
    }, (err) => {
        if (err) {
            console.error(err);
        }
    });
};
