module.exports = (wsModel: any) => {
  // 这里演示一个服务器心跳广播的功能
  let indexNum: number = 1;
  setInterval(() => {
    indexNum++;
    // 所有在线的用户均可收到该广播
    wsModel.ws.emit('msg-index', indexNum);
  }, 1000);
};
