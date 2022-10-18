// const REG_WHITE_LIST = /^https?:\/\/(?:[0-9a-zA-Z-]+\.)*\.(?:ws|biz|com)(?::\d+)?$/;// 正则方式匹配 REG_WHITE_LIST.test(origin)
const REG_WHITE_LIST = ["http://127.0.0.1:909", "http://127.0.0.1:9098"];
// 这里写上想要匹配的域名
module.exports = async (ctx: any, next: any) => {
  const origin = ctx.request.header.origin;
  // const origin = ctx.get("Origin");
  console.log(
    666.789,
    Date.now(),
    ctx.request.header.origin,
    REG_WHITE_LIST.includes(origin)
  );
  if (origin && REG_WHITE_LIST.includes(origin)) {
    ctx.set("Access-Control-Allow-Origin", origin); // 允许跨域
    ctx.set("Access-Control-Allow-Methods", "POST,GET,OPTIONS,HEAD,PUT,DELETE"); // 支持的方法
    ctx.set("Access-Control-Allow-Credentials", "true"); // 允许传入Cookie
    ctx.set("Access-Control-Max-Age", 2592000); // 过期时间一个月
    // 如果有特殊的请求头，直接响应
    if (ctx.get("Access-Control-Request-Headers")) {
      ctx.set(
        "Access-Control-Allow-Headers",
        ctx.get("Access-Control-Request-Headers")
      );
    }
    // FIX：浏览器某些情况下没有带Origin头
    ctx.set("Vary", "Origin");
    // 如果是 OPTIONS 请求，则直接返回
    if (ctx.method === "OPTIONS") {
      ctx.status = 204;
      return;
    }
  }
  await next();
};
