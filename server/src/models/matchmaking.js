const redis = require("./redis")
const { zip } = require("lodash")

const queue = async (session_id) => {
    await redis.set(`queue:${session_id}`, new Date().getTime())
    console.log(`client waiting ${session_id}`)
    return true
}

const update = async () => {
    const keys = await redis.keys("queue:*");
    console.log(`${keys.length} players in queue`)
    if (keys.length < 2) {
        console.log("not enough players")
        return
    }
    const values = (await redis.mget(keys)).map(x => x && Number(x));
    const kv = zip(keys, values).sort(([k1, v1], [k2, v2]) => v1 - v2).map(([k, v]) => k)
    console.log(kv)
}

setInterval(update, 1000)

module.exports = {
    queue,
    update,
}