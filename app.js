// const express = require('express');
// const app = express();
// const http = require('http');
// const socketio = require('socket.io');
// const server = http.createServer(app);
// const io = socketio(server);
// const path = require('path');


// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, "public")));


// io.on("connection", function (socket) {
//     socket.on("send-location", function (data) {
//         io.emit("receive-location", { id: socket.id, ...data });
//     })
//     console.log("Connected");

//     socket.on("disconnect", function () {
//         io.emit("user-disconnected", socket.id);
//     })
// })
// app.get("/", function (req, res) {
//     res.render("index");
// })

// // server.listen(3000);
// const port = process.env.PORT || 3000;
// server.listen(port, () => console.log(`Server running on port ${port}`));


const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const path = require('path');

// Set view engine and static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Receive location and broadcast to all clients
    socket.on("send-location", (data) => {
        console.log(`Location received from ${socket.id}:`, data);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit("user-disconnected", socket.id);
    });
});

// Render index page
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
