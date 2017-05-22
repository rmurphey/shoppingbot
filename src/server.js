const express = require('express');
const data = require('./data');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static('static'));

app.get('/channel/:channel', (req, res) => {
    const { channel } = req.params;
    const list = data.getList(channel);
    const items = Object.keys(list).map((name) => {
        const label = `${name} (${list[name]})`;
        return { label, name };
    });

    res.render('index', { channel, items });
});

app.post('/channel/:channel', bodyParser.urlencoded({ extended: false }), (req, res) => {
    const { channel } = req.params;
    const obj = {};

    Object.keys(req.body).forEach((k) => {
        obj[k] = +req.body[k];
    });

    data.updateList(channel, obj);
    res.redirect(`/channel/${channel}`);
});

app.listen(1947, () => {
    console.log('listening on 1947');
});
