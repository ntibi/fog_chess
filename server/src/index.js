const express = require('express');
const cors = require('cors');
const express_session = require("express-session");
const http = require("http")
const { v4: uuid } = require("uuid")
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const socket_session = require("express-socket.io-session");
const config = require("config");

const redis = require("./models/redis");
const matchmaking = require("./routes/matchmaking")
const game = require("./routes/game")
const { connect: connect_sockets } = require("./models/socket")
const url = config.get("client.url");
const secret = config.get("server.secret");
require("./models/matchmaking")

const app = express()
const server = http.createServer(app);
const api = express.Router()

const port = process.env.PORT || 8081

const session = express_session({
  genid: uuid,
  secret,
  resave: true,
  cookie: {
    maxAge: 36000,
    httpOnly: false,
    secure: false,
  },
  saveUninitialized: true,
  cookie: { secure: false }
})

app.use(cors({
  origin: url,
  credentials: true, // only if env == DEVELOPMENT
}));

app.use(cookie_parser(secret))

app.use(session)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${req.session.id}`)
  next()
})

connect_sockets(server, socket_session(session))

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

api.get('/isup', require("./routes/isup"))

api.post('/mm/queue', matchmaking.queue)
api.get('/mm/count', matchmaking.count)

api.post("/game/move", game.move)

app.use("/api", api)

server.listen(port, () => console.log(`app listening on port ${port}`))
