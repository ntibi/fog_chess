const express = require('express');
const cors = require('cors');
const express_session = require("express-session");
const http = require("http")
const { v4: uuid } = require("uuid")
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const socket_session = require("express-socket.io-session");

const redis = require("./models/redis");
const { server: { secret } } = require("../../config");
const matchmaking = require("./routes/matchmaking")
const { connect: connect_sockets } = require("./models/socket")
const { client: { url } } = require("../../config")
require("./models/matchmaking")

const app = express()
const server = http.createServer(app);

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

app.get('/isup', require("./routes/isup"))

app.post('/mm/queue', matchmaking.queue)

server.listen(port, () => console.log(`app listening on port ${port}`))