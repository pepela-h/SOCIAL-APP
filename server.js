require("dotenv").config();
const express = require("express");
const cors = require("cors");
const CookieParser = require("cookie-parser");
const dbConn = require("./config/dbConn");
const corsOptions = require("./config/corsOptions");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DATABASE_URI;
const socketio = require("socket.io");
dbConn(DB_URI);
const app = express();
app.use(cors(corsOptions));
app.use(CookieParser());
app.use(express.json({ limit: "3mb", extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // console.log(
  //   req.url,
  //   req.headers.authorization
  // );
  next();
});

app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));
app.use("/refresh", require("./routes/refresh"));
app.use("/admin", require("./routes/admin"));

mongoose.connection.once("open", () => {
  console.info("Connected to MongoDB");
});
const server = app.listen(PORT, () => {
  console.info("Server is listening on port " + PORT);
});

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  sessionId = socket.handshake.auth.id;
  if (!username) return next(new Error("No username"));
  socket.username = username;
  socket.sessionId = sessionId;
  socket.userId = sessionId;

  next();
});

io.on("connection", (socket) => {
  socket.join(socket.userId);
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      username: socket.username,
      userId: socket.userId,
    });
  }
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userId: socket.userId,
    username: socket.username,
  });

  socket.on("pm", ({ message, to }) => {
    socket.to(to).emit("pm", {
      message: message,
      from: socket.username,
      to,
    });
  });

  socket.on("disconnect", () => {});
});
