const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const http = require('http')
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require('./routes/messageRoutes')
const app = express();
const server = http.createServer(app)
const { Server } = require('socket.io');
const { Socket } = require("dgram");
require("dotenv").config()


app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoutes)
app.use('/api/message', messageRoutes)



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`mongoDB connected succesfully on ${process.env.MONGO_URL}`)
}).catch((err) => console.log("mongo error",err.message))

app.get('/', (req, res) => {
    // Sending an HTML tag as a response
    res.send('<h1>you are on / </h1>');
  });
const io = new Server(server, {
    cors: {
      origin:process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials:true,
    }
});

const usernameToSocketId = {}
io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('add_user', (user) => {
        usernameToSocketId[user._id] = socket.id;
        console.log("user:", user.name, "socket:", socket.id);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        const { msg, sender, to } = data;
        console.log(msg, sender, to);

        // Emit to the recipient
        io.to(usernameToSocketId[to]).emit("private_receive", { message: msg, sender });

        // Emit to the sender
        io.to(usernameToSocketId[sender]).emit("private_receive", { message: msg, sender });

        console.log('message sent');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`server started successfully on port:${process.env.PORT} and client ${process.env.CLIENT_URL}`)
})

/*kXXoxd1YLjkN1Zno  ip:42.106.191.28/32 */
