const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
//const CORS_WHITELIST = process.env.CORS_WHITELIST.split(',') //deployment doesnt work with this
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
// app.use(cors({
//   origin: CORS_WHITELIST  // deployment doesnt work with this
// }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://project-4-ummibobbins-fe.herokuapp.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// SESSION MIDDLEWARE
// Need to be at most top so that all app.use middlewares below it is applicable
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

// const
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_BASE_URL = process.env.MONGO_BASE_URL;
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_BASE_URL}/${DATABASE}?retryWrites=true&w=majority`;

// controllers

const userController = require("./controller/userController");
app.use("/user/api", userController);

const sessionController = require("./controller/sessionController");
app.use("/user/api", sessionController);

const parentController = require("./controller/parentController");
app.use("/parent/api", parentController);

const babySitterController = require("./controller/babySitterController");
app.use("/babysitter/api", babySitterController);

const bookingController = require("./controller/bookingController");
app.use("/booking/api", bookingController);

// socket io////////////////////////
//////////////
//listen for events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  //listen for frontend input of data which is room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  //listens for data sent (socket.on) from frontend
  //and send data (socket.to) back to frontend
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

///////
/////////////////////////////////

// connect to mongoose
mongoose.connect(MONGO_URL).then(async () => {
  console.log("database connected");
  server.listen(PORT, () => {
    console.log("listening on", PORT);
  });
});
