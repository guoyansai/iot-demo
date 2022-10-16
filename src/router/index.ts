const fso = require("fs");
const IRouter = require("koa-router");
const routerIndex = new IRouter();

fso.readdirSync(__dirname).forEach((file: string) => {
  console.log(666.222, file);
  if (file && file !== "index.ts") {
    let r = require("./" + file);
    routerIndex.use(r.routes());
  }
});

module.exports = routerIndex;
