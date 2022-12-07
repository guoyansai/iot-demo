module.exports = (wsModel: any) => {
  // 监听到有用户连接上来了！
  wsModel.ws.on('connection', (socket: any) => {
    if (!wsModel.users.timer) {
      wsModel.users.timer = new Date();
    }
    wsModel.users.count++;
    console.log(666.301, 'connection', socket.id);

    // 将A用户id加入用户列表
    wsModel.users.lists.push(socket.id);

    // 对外广播有A用户连接上来了，注意：这里使用ws
    wsModel.ws.emit('msg-broadcast', {
      msg: `欢迎${wsModel.users.count}，${socket.id}`,
      users: wsModel.users.lists,
    });

    // 监听A用户发过来的消息
    socket.on('msg-client', (msg: string) => {
      console.log(666.301, 'msg-client', msg);
      // 将A用户发过来的消息封装一下再回传给用户，注意：这里使用socket
      socket.emit('msg-server', { msg, tm: new Date() }, (res: any) => {
        // 增加第三个回调函数变量是为了获取A用户拿到消息后的回答信息
        console.log(666.303, 'msg-server', res);
      });
    });

    // 监听A用户主动来拉取服务器信息，如用户列表信息
    socket.on('msg-fetch', (msg: string) => {
      console.log(666.309, 'msg-fetch', msg);
      // 回应A用户的请求
      socket.emit('msg-fetch-server', {
        msg,
        tm: new Date(),
        fetch: wsModel.users.lists,
      });
    });

    // 当A用户离开(断开连接)的时候
    socket.on('disconnect', () => {
      console.log(666.305, 'disconnect', socket.id);
      // 将用户从服务器端的用户列表中删除
      wsModel.users.lists.splice(
        wsModel.users.lists.findIndex((el: any) => el === socket.id),
        1
      );
      // 将A用户离开的消息发送给所有在线连接的用户
      wsModel.ws.emit('msg-broadcast', {
        msg: `${socket.id}，再见`,
        users: wsModel.users.lists,
      });
    });
  });
};
