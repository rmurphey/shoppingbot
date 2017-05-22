require('dotenv').config();

const slack = require('slack');

const retry = require('./src/retry');
const handleMessages = require('./src/handleMessages');
require('./src/server');

const token = process.env.SLACK_BOT_TOKEN;
const bot = slack.rtm.client();

function listen() {
    bot.listen({ token }, (err) => {
        if (err) {
            return retry(err, listen);
        }

        console.log('connected');
        handleMessages(bot);
    });
}

listen();
