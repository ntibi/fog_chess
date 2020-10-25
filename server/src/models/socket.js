const socket = require("socket.io")
const client = require("./client");
const matchmaking = require("./matchmaking");

let io

const set_listeners = () => {
    io.on("connection", async (sock) => {
        const session_id = sock.handshake.sessionID
        await client.connect(session_id, sock.id)
        sock.on("disconnect", async () => {
            await client.disconnect(session_id)
        });
    });
}

const connect = (http, session) => {
    io = socket(http, {
        origins: "*:*",
        serveClient: false,
    });
    io.use(session)
    set_listeners()
    console.log("socket created")
}

module.exports = {
    connect,
}