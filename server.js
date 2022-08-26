const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const io = require("socket.io")(server)
const PORT = 3000
require('dotenv').config()
const env = process.env

const mongoose = require("mongoose")

const Msg = require("./models/messages")
    // const mongoDB = require("./libs/mongo_info")

const mongoDB = env.URI
console.log(mongoDB)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
io.on("connection", (socket) => {
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => Msg.find().then(result => socket.emit('output-messages', result)))
        .catch(err => console.log(err))
    console.log("userが接続しました");
    socket.on("chat_message", (msg) => {
        const message = new Msg({ msg })
        message.save().then(() => {

            io.emit("chat_message", msg)
        })
    })
})
server.listen(PORT, () => {
    console.log("listening on port " + PORT);
})