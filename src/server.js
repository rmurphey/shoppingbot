const express = require('express');
const Data = require('./data');
const bodyParser = require('body-parser');


module.exports = (db, cb) => {
    const data = new Data(db);

    const app = express();
    app.set('view engine', 'pug');
    app.use('/static', express.static('static'));

    app.get('/channel/:channel', (req, res) => {
        const { channel } = req.params;

        data.getList(channel, (err, list) => {
            const items = Object.keys(list).map((name) => {
                const label = `${name} (${list[name]})`;
                return { label, name };
            });

            res.render('index', { channel, items });
        });
    });

    app.post('/channel/:channel', bodyParser.urlencoded({ extended: false }), (req, res) => {
        const { channel } = req.params;

        const updated = Object.keys(req.body).reduce((obj, k) => {
            obj[k] = +req.body[k];
            return obj;
        }, {});

        data.updateList(channel, updated, () => {
            res.redirect(`/channel/${channel}`);
        });
    });

    app.listen(1947, cb);
};
