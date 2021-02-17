const redis = require("./redis")

const connect = async (session_id, socket_id) => {
    await redis.hmset(`client:${session_id}`, "socket", socket_id, "ts", new Date().getTime())
    console.log(`client connected ${session_id}`)
    return true
}

const disconnect = async (session_id) => {
    const to_delete = await redis.keys(`client:${session_id}`);
    await redis.del(to_delete);
    console.log(`disconnected client ${session_id}`)
    return true
}

const get_socket = async (session_id) => {
    const [socket] = await redis.hmget(`client:${session_id}`, "socket");
    return socket
}

module.exports = {
    connect,
    disconnect,
    get_socket,
}