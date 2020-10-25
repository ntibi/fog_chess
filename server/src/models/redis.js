const { promisify } = require("util");
const redis = require("redis");

const client = redis.createClient();
 
[
    "get",
    "set",
    "del",
    "keys",
    "mget",
].forEach(fn => client[fn] = promisify(client[fn]))
client.get = promisify(client.get)
client.set = promisify(client.set)

client.on("error", function(error) {
  console.error(error);
});

module.exports = client