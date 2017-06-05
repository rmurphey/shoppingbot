require('dotenv').config();

const slack = require('slack');
const Mongo = require('mongodb').MongoClient;

const retry = require('./src/retry');
const handleMessages = require('./src/handleMessages');

const server = require('./src/server');

const token = process.env.SLACK_BOT_TOKEN;
const bot = slack.rtm.client();

function listen(db) {
    bot.listen({ token }, (slackErr) => {
        if (slackErr) {
            console.error(`Error connecting to database: ${slackErr}`);
            return retry(slackErr, () => listen(db));
        }

        console.log('Connected to Slack');

        handleMessages(bot, db);
    });
}

Mongo.connect('mongodb://127.0.0.1:27017/shopping', (mongoErr, db) => {
    if (mongoErr) {
        console.error(`Error connecting to database, dying: ${mongoErr}`);
        throw mongoErr;
    }

    console.log('Connected to Mongo');

    server(db, (serverErr) => {
        if (serverErr) {
            console.error(`Error starting server, dying: ${serverErr}`);
            throw serverErr;
        }

        console.log('Started server');

        listen(db);
    });
});
