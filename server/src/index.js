const express = require('express');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 8081

app.use(cors());

app.get('/isup', (req, res) => {
    console.log("isup")
    res.json("OK")
})

app.listen(port)
