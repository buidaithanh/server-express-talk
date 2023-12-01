const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/mesageRoutes");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connection successful.");
  })
  .catch((err) => {
    console.log(`DB connection error:${err}`);
  });

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    credentials: true,
  },
});

global.onlineUser = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUser.set(userId, socket.id);
  });
  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUser.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-recieve", data.message);
    }
  });
});
