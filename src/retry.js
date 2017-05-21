const time = 5000;
let retries = 0;

module.exports = function retry(err, cb) {
    retries++; // eslint-disable-line

    if (retries > 10) {
        process.exit(0);
    }

    const timeout = time * retries;

    console.error(err);
    console.error(`Retrying in ${timeout}ms`);

    setTimeout(cb, timeout);
};
