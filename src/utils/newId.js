let lastId = {};

export default function (prefix = 'id') {
    if (lastId[prefix] === undefined)
        lastId[prefix] = 0
    else
        lastId[prefix]++;
    return `${prefix}${lastId[prefix]}`;
}