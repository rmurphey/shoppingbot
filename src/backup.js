const fs = require('fs');

module.exports = function backup(backupFile, obj, cb) {
    fs.writeFile(backupFile, JSON.stringify(obj, null, 2), (err) => {
        cb(err);
    });
};
