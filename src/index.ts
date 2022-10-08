const http = require("http");
const express = require("express");
const Socket = require("socket.io");
const path = require("path");
const iot = require("./iot/runtime");
const { json } = require("express");

const iotInstance = new iot(require("./config").runMode, 2000); //production or development
iotInstance.run();

const app = express();
app.use("/", express.static(path.join(__dirname, "../client-dist")));
app.get("/", (req: any, res: { sendFile: (arg0: any) => void }) => {
  res.sendFile(path.join(__dirname, "../client-dist/index.html"));
});

const server = http.createServer(app);

//websocket
const io = Socket(server);
const sockets: any[] = [];
io.on("connect", (socket: { id: any }) => {
  console.log("socket conncet,id is:", socket.id);
  sockets.push(socket);
});
io.on("disconnect", () => {
  console.log("disconnect");
});
setInterval(() => {
  io.emit("msg", iotInstance.Model);
  console.log(
    sockets.map((item) => {
      return {
        id: item.id,
        connect_status: item.connected,
      };
    })
  );
}, 1000);

//http lisenter
server.listen(9091, function () {
  console.log("server is running on http://127.0.0.1:9091");
});
