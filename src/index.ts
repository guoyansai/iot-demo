const { APP_PORT } = require("./config/config.default");
import axios from "axios";

const http = require("http");

// IOT服务
const iot = require("./iot/runtime");
const iotInstance = new iot(require("./config").runMode, 2000); //production or development
iotInstance.run();

const { app } = require("./app/index");

// websocket
const server = http.createServer(app.callback());
const Socket = require("socket.io");
const io = Socket(server);
const sockets: any[] = [];
io.on("connect", (socket: { id: any }) => {
  console.log("socket conncet,id is:", socket.id);
  sockets.push(socket);
});

io.on("msg-client", (msg: string) => {
  console.log("client msg:", msg);
  io.emit("msg-server", { msg: msg });
});

io.on("disconnect", () => {
  console.log("disconnect");
});
setInterval(() => {
  io.emit("msg", iotInstance.Model);
  // console.log(
  //   sockets.map((item) => {
  //     return {
  //       id: item.id,
  //       connect_status: item.connected,
  //     };
  //   })
  // );
}, 1000);

//http lisenter
server.listen(APP_PORT, function () {
  console.log("server is running on http://127.0.0.1:" + APP_PORT);
});
