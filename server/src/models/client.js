const redis = require("./redis")

const connect = async (session_id, socket_id) => {
    await redis.set(`client:${session_id}`, socket_id)
    console.log(`client connected ${session_id}`)
    return true
}

const disconnect = async (session_id) => {
    const to_delete = await redis.keys(`*:${session_id}`);
    await redis.del(...to_delete);
    console.log(`disconnected client ${session_id}`)
    return true
}


module.exports = {
    connect,
    disconnect,
}
