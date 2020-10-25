const game = require("../models/game")

const move = async (req, res) => {
    const allowed = game.move(req.session.id, req.body.src, req.body.dst)
    if (allowed)
        res.sendStatus(200)
    else
        res.sendStatus(403)
}

module.exports = {
    move
}