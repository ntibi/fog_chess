const matchmaking = require("../models/matchmaking")

const queue = async (req, res) => {
    await matchmaking.queue(req.session.id)
    res.json("OK")
}

module.exports = {
    queue
}