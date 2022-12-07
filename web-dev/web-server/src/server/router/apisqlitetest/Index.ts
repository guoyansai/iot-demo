module.exports = (route: any) => {
  const dbSql: any = require('../../../utils/Data/Index')('sqlite', {
    database: './asaiData.db',
    create: 1,
  });

  const As: any = require('../../../utils/As');
  route
    .post('/add', async (ctx: any) => {
      const dataStr: any = await As.getCtxData(ctx);
      As.clog(666.1002, 'add', dataStr);
      await dbSql
        .sqlDb({
          type: 'insert',
          table: 'apifiletest',
          field: ['name', 'content'],
          value: [[As.jsonParse(dataStr).id, dataStr]],
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
      await dbSql
        .sqlDb({
          type: 'update',
          table: 'apifiletest',
          set: [['content', dataStr]],
          where: [['name', '=', As.jsonParse(dataStr).id]],
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
      await dbSql
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
      await dbSql
        .sqlDb({
          type: 'select',
          table: 'apifiletest',
          field: ['name', 'content'],
          where: [['name', '=', ctx.query.id]],
        })
        .then((res: any) => {
          As.clog(10082, res);
          ctx.body = res;
        })
        .catch((err: any) => {
          As.clog(10081, err);
        });
    })
    .get('/list', async (ctx: any) => {
      As.clog(666.1008, 'list');
      await dbSql
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
