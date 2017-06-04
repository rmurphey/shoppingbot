module.exports = (err, otherwise) => {
    if (err) {
        console.error(err);
        throw err;
    }

    otherwise();
};
