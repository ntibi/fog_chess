const { io } = require("./io")
const { shuffle } = require("lodash")
const redis = require("./redis")

const colors = ["w", "b"]

const start = async (id1, id2) => {
    const [ socket1, socket2 ] = await redis.mget([`client:${id1}`, `client:${id2}`])

    const assignedColors = shuffle(colors)

    await redis.hmset(`game:${id1}`, "opponent", id2, "color", assignedColors[0], "turn", assignedColors[0] === "w", "connected", true)
    await redis.hmset(`game:${id2}`, "opponent", id1, "color", assignedColors[1], "turn", assignedColors[1] === "w", "conntected", true)

    await io().to(socket1).emit("start", {
        color: assignedColors[0]
    })
    await io().to(socket2).emit("start", {
        color: assignedColors[1]
    })
    console.log(`match started between ${id1} and ${id2}`)
}

const move = async (session_id, src, dst) => {
    const [ opponent, turn ] = await redis.hmget(`game:${session_id}`, "opponent", "turn")
    if (!turn)
        return false
    await redis.hmset(`game:${session_id}`, "turn", false);
    await redis.hmset(`game:${opponent}`, "turn", true);
    const opponent_socket_id = await redis.get(`client:${opponent}`)
    io().to(opponent_socket_id).emit("move", { src, dst })
    return true
}

const disconnect = async (session_id) => {
    await redis.hmset(`game:${session_id}`, "connected", false)
    const [opponent, connected] = await redis.hmget(`game:${session_id}`, "opponent", "connected")
    if (!opponent)
        return
    console.log(`${session_id} was in a game`)
    const socket = await redis.get(`client:${opponent}`)
    if (connected && socket) {
        await io().to(socket).emit("info", {
            message: "opponent disconnected",
        })
        console.log(`${session_id} opponent (${opponent}) was notified`)
    } else {
        await redis.del(`game:${session_id}`, `game:${opponent}`)
        console.log(`${session_id} opponent (${opponent}) disconnected too, stopped the game`)
    }
}

const recover = async (session_id) => {
    const [ opponent, turn ] = await redis.hmget(`game:${session_id}`, "opponent", "turn")
    if (opponent && turn) {
        console.log(`recovering ${session_id} game against ${opponent}`)
        const player_socket = await redis.get(`client:${session_id}`)
        const opponent_socket = await redis.get(`client:${opponent}`)
        // await io().to(player_socket).emit("recover")
        // await io().to(opponent_socket).emit("recover")
    }
}

module.exports = {
    start,
    move,
    disconnect,
    recover,
}