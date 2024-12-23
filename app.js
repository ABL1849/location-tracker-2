const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const path = require('path');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));


io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    })
    console.log("Connected");

    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    })
})
app.get("/", function (req, res) {
    res.render("index");
})

// server.listen(3000);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));