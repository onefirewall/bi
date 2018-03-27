const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));



const port = 3000
const server = http.createServer(app)

server.listen(port, () => console.log(`Running on localhost:${port}`))