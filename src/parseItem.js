function parseItem(item) {
    const EMOJI = /^:[^:]+:/;
    const matches = item.match(EMOJI);

    let name;
    let count;
    let _item;

    if (matches) {
        name = matches[0];
        _item = item.replace(EMOJI, '');
        count = _item.split(':')[1];
    } else {
        [ name, count ] = item.split(':');
    }

    return [ name, count ];
}

module.exports = parseItem;
