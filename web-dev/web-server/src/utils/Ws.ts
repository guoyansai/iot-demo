const serverWs: any = require('../server/ws/index');

module.exports = (Server: any) => {
  // 将WS服务以相同的地址和端口集成到Web服务中
  const Socket = require('socket.io'); // 引入ws服务
  // 基于http的Server，建立WebSocket服务
  const ws = Socket(Server, {
    allowEIO3: true, // 是否启用与V2版本的客户端兼容，默认是false
    // cors:true, // 开放跨域，官方文档：https://socket.io/docs/v4/server-options/#cors
    cors: {
      origin: '*', // 支持单个网址，或网址的数组
      methods: ['GET', 'POST', 'PUT'], // 请求方式
    },
  });
  // 封装下游模型
  const wsModel: any = {
    ws,
    users: {
      timer: '',
      count: 0,
      lists: [], // 当前连接用户信息
    },
    data: {},
  };
  // 执行ws服务
  serverWs(wsModel);
};
