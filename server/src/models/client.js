const redis = require("./redis")

const connect = async (session_id, socket_id) => {
    await redis.set(`client:${session_id}`, socket_id)
    console.log(`client connected ${session_id}`)
    return true
}

const disconnect = async (session_id) => {
    await redis.del(`*:${session_id}`)
    console.log(`disconnected client ${session_id}`)
    return true
}


module.exports = {
    connect,
    disconnect,
}