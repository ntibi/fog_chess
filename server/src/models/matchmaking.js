const redis = require("./redis")
const { zip } = require("lodash")
const { start } = require("./game")

const LOCK_NAME = "queue"

const queue = async (session_id) => {
    await redis.set(`queue:${session_id}`, new Date().getTime())
    console.log(`client waiting ${session_id}`)
    return true
}

const update = async () => {
    const lock = await redis.lock(LOCK_NAME)
    if (!lock) {
        console.log("could not lock queue")
        return
    }
    const keys = await redis.keys("queue:*");
    console.log(`${keys.length} players in queue`)
    if (keys.length < 2) {
        console.log("not enough players")
        await redis.release(LOCK_NAME)
        return
    }
    const values = (await redis.mget(keys)).map(x => x && Number(x));
    const kv = zip(keys, values).sort(([k1, v1], [k2, v2]) => v1 - v2).map(([k, v]) => k)
    for (let i = 0; i < keys.length - keys.length % 2; i += 2) {
        await pair(keys[i], keys[i + 1])
    }
    await redis.release(LOCK_NAME)
}

const pair = async (p1, p2) => {
    await redis.del(p1, p2)

    const [ s1, id1 ] = p1.match(/queue:([a-f0-9-]+)/)
    const [ s2, id2 ] = p2.match(/queue:([a-f0-9-]+)/)
    console.log(`pairing ${id1} ${id2}`)

    start(id1, id2)

    return
}

const count = async () => {
    const keys = await redis.keys("queue:*")
    return keys.length
}

// setInterval(update, 1000)

module.exports = {
    queue,
    update,
    count,
}
