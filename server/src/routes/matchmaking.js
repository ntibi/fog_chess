const matchmaking = require("../models/matchmaking")

const queue = async (req, res) => {
    await matchmaking.queue(req.session.id)
    matchmaking.update()
    res.sendStatus(200)
}

const count = async (req, res) => {
    const count = await matchmaking.count()
    res.json(count)
}

module.exports = {
    queue,
    count,
}