const async = require('async');

function createItem(name, count) {
    return { name, count };
}

class Data {
    constructor(db) {
        this.db = db;
    }

    getList(channel, cb) {
        this.db.collection(channel).find().toArray((err, items) => {
            cb(err, items.reduce((acc, curr) => {
                acc[curr.name] = curr.count;
                return acc;
            }, {}));
        });
    }

    deleteList(channel, cb) {
        this.db.collection(channel).deleteMany({}, cb);
    }

    updateList(channel, obj, cb) {
        const items = Object.keys(obj).map(item => createItem(item, obj[item]));
        const coll = this.db.collection(channel);

        async.each(items, (item, _cb) => {
            coll.findOneAndDelete({ name: item.name }, _cb);
        }, (err) => {
            if (err) { cb(err); }
            coll.insertMany(items.filter(item => item.count > 0), cb);
        });
    }

    deleteItem(channel, item, cb) {
        this.db.collection(channel).deleteOne({ name: item }, cb);
    }

    debug(channel, cb) {
        this.db.collection(channel).find().toArray(cb);
    }
}

module.exports = Data;
