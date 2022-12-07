module.exports = (route: any) => {
  const As: any = require('../../../utils/As');
  const dbSql: any = require('../../../utils/Data/Index')('file', {
    ext: '.jpg',
    dir: 'estunData/',
    create: 1,
  });

  route.post('/picture', async (ctx: any) => {
    const dataStr: any = await As.getCtxData(ctx);
    const { uid, name, size, data } = JSON.parse(dataStr);
    As.clog(666.1002, 'picture', uid, size, name);
    let base64 = data.replace(/^(data:image)(\/)(\w+)(;base64,)/, '');
    // let dataBuffer = new Buffer(base64, 'base64'); // 老式，已弃用
    let dataBuffer = Buffer.from(base64, 'base64'); // 把base64码转成buffer对象，
    dbSql
      .sqlDb({
        type: 'insert',
        table: 'upload',
        field: ['name', 'content'],
        value: [[uid, dataBuffer]],
      })
      .then((res: any) => {
        As.clog(10022, res);
        ctx.body = res;
      })
      .catch((err: any) => {
        As.clog(10021, err);
      });
  });
  return route;
};
