module.exports = {
  clog(...arg: any) {
    console.log(...arg);
  },
  jsonParse(str: any) {
    if (str && typeof str === 'string') {
      return JSON.parse(str);
    }
    return str;
  },

  getCtxData(ctx: any, type: string = 'data') {
    return new Promise(function (resolve, reject) {
      try {
        let str = '';
        ctx.req.on(type, function (chunk: any) {
          str += chunk;
        });
        ctx.req.on('end', function (chunk: any) {
          resolve(str);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  resFail(val: any) {
    return { code: 907, data: val };
  },
  resEmpty(val: string) {
    return { code: 908, data: val };
  },
  resSuccess(val: any) {
    return { code: 909, data: val };
  },
};
