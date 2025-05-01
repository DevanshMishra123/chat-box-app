import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listening for a message from a client and sending it to all clients
    socket.on("send_message", (data) => {
      // This will send the message to all connected clients
      io.emit("receive_message", data);  // Change from socket.broadcast.emit
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
/*
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
      socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
*/