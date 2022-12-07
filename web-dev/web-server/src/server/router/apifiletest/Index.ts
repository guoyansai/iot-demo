module.exports = (route: any) => {
  const dbSql: any = require('../../../utils/Data/Index')('file', {
    ext: '.estun',
    dir: 'estunData/',
    create: 1,
  });

  const As: any = require('../../../utils/As');
  route
    .post('/add', async (ctx: any) => {
      const dataStr: any = await As.getCtxData(ctx);
      As.clog(666.1002, 'add', dataStr);
      dbSql
        .sqlDb({
          type: 'insert',
          table: 'apifiletest',
          field: ['name', 'content'],
          value: [[JSON.parse(dataStr).id, dataStr]],
        })
        .then((res: any) => {
          As.clog(10022, res);
          ctx.body = res;
        })
        .catch((err: any) => {
          As.clog(10021, err);
        });
    })
    .post('/edit', async (ctx: any) => {
      const dataStr: any = await As.getCtxData(ctx);
      As.clog(666.1004, 'edit', dataStr);
      dbSql
        .sqlDb({
          type: 'update',
          table: 'apifiletest',
          set: [['content', dataStr]],
          where: [['name', '=', JSON.parse(dataStr).id]],
        })
        .then((res: any) => {
          As.clog(10042, res);
          ctx.body = res;
        })
        .catch((err: any) => {
          As.clog(10041, err);
        });
    })
    .get('/del', async (ctx: any) => {
      As.clog(666.1006, 'del', ctx.query.id);
      dbSql
        .sqlDb({
          type: 'delete',
          table: 'apifiletest',
          where: [['name', '=', ctx.query.id]],
        })
        .then((res: any) => {
          As.clog(10062, res);
          ctx.body = res;
        })
        .catch((err: any) => {
          As.clog(10061, err);
        });
    })
    .get('/read', async (ctx: any) => {
      As.clog(666.1008, 'read', ctx.query.id);
      dbSql
        .sqlDb({
          type: 'select',
          table: 'apifiletest',
          field: ['name', 'content'],
          where: [['name', '=', ctx.query.id]],
        })
        .then((res: any) => {
          As.clog(100802, res);
          ctx.body = res;
        })
        .catch((err: any) => {
          As.clog(100801, err);
        });
    })
    .get('/list', async (ctx: any) => {
      As.clog(666.1008, 'list');
      dbSql
        .sqlDb({
          type: 'select',
          table: 'apifiletest',
          field: ['name', 'content'],
        })
        .then((res: any) => {
          As.clog(10082, res);
          ctx.body = res;
        })
        .catch((err: any) => {
          As.clog(10081, err);
        });
    });
  return route;
};
