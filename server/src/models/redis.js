const { promisify } = require("util");
const redis = require("redis");

const client = redis.createClient();
 
[
    "get",
    "set",
    "del",
    "keys",
    "mget",
    "getset",
    "multi",
    "hset",
    "hget",
    "hmget",
].forEach(fn => client[fn] = promisify(client[fn]))

client.on("error", function(error) {
  console.error(error);
});

client.lock = async (name) => {
  const lock = await client.getset(`lock:${name}`, "locked")
  return !lock
}

client.release = async (name) => {
  return client.del(`lock:${name}`)
}

module.exports = client