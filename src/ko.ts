// IOT服务
const iot = require("./iot/runtime");
const iotInstance = new iot(require("./config").runMode, 2000); //production or development
iotInstance.run();

// koa服务
const Koa = require("koa");
const app = new Koa();

// 解决跨域问题
const cors = require("./utils/cors");
app.use(cors);

// 通过koa内部封装好的上下文进行判断处理get、post、html页面
app.use(async (ctx: any, next: any) => {
  const { url, method } = ctx;
  console.log(666.999, url, method);
  // 前端调用示例：const value = await axios.post('http://127.0.0.1:9098/users');
  const getLists = ["/get", "/user/get", "/users"];
  const postLists = ["/post", "/user/post", "/users"];
  if (url.startsWith("/socket")) {
    console.log(666.456, "进入ws通信", url, method);
    await next();
  } else if (method === "GET" && getLists.includes(url)) {
    // 当GET请求时候的处理
    ctx.body = "get test" + url;
  } else if (method === "POST" && postLists.includes(url)) {
    // post请求的处理
    ctx.body = "post test" + url;
  } else {
    // 除了以上的数据特殊处理请求外，均执行dist文件包to网站服务
    const path = require("path");
    // 加载html页面或ejs、pug模板等
    const Views = require("koa-views");
    app.use(
      Views(path.join(__dirname, "../web-client-dist/ui"), {
        extension: "html",
        // map: { html: "html" },
      })
    );
    // 静态资源加载
    const Static = require("koa-static");
    app.use(Static(path.join(__dirname, "../web-client-dist/ui")));

    // 继续执行接下来的服务*必须
    await next();
  }
});

// nodejs启动http服务
const http = require("http");
const server = http.createServer(app.callback());

// websocket服务
const Socket = require("socket.io");
const io = Socket(server, {
  allowEIO3: true,
  // cors: true,
  cors: {
    origin: "*", // WS跨域，DEV调试的时候需要，示例：http://localhost:909
    methods: ["GET", "POST"],
  },
});
const sockets: any[] = [];
io.on("connection", (socket: any) => {
  console.log("socket conncet,id is:", socket.id);
  sockets.push(socket);

  socket.on("msg-client", (msg: string) => {
    console.log("client msg:", msg);
    socket.emit("msg-server", { msg: msg }, (res: any) => {
      console.log(666.329, res);
    });
  });

  socket
    .timeout(5000)
    .emit("timeout", "hello world", (err: any, response: any) => {
      if (err) {
        // 另一方未在给定延迟内确认事件
      } else {
        console.log(response); // "got it"
      }
    });

  socket.on("disconnect", () => {
    console.log("user disconnected" + socket.id);
  });
});

io.on("disconnect", () => {
  console.log("disconnect");
});

let indexNum: number = 1;
setInterval(() => {
  indexNum++;
  io.emit("msg", iotInstance.Model);
  io.emit("msg-index", indexNum);
  // console.log(
  //   sockets.map((item) => {
  //     return {
  //       id: item.id,
  //       connect_status: item.connected,
  //     };
  //   })
  // );
}, 1000);

//nodejs服务启动，包含http及ws
const { APP_PORT } = require("./config/config.default");
server.listen(APP_PORT, function () {
  console.log("server is running on http://127.0.0.1:" + APP_PORT);
});
