const wsUser: any = require('./user/Index');
const wsBroadcast: any = require('./broadcast/Index');

module.exports = (wsModel: any) => {
  wsUser(wsModel);
  wsBroadcast(wsModel);

  // 当服务器断掉WS服务的时候
  wsModel.ws.on('disconnect', () => {
    console.log(666.306, 'disconnect');
  });
};
