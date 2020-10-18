const express = require('express')

const app = express()
const port = process.env.PORT || 8081

app.get('/isup', (req, res) => {
    res.json("OK")
})

app.listen(port, () => {
})