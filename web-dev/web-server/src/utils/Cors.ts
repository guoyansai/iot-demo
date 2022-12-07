// const REG_WHITE_LIST = /^https?:\/\/(?:[0-9a-zA-Z-]+\.)*\.(?:ws|biz|com)(?::\d+)?$/;// 正则方式匹配 REG_WHITE_LIST.test(origin)
const REG_WHITE_LIST = [
  '127.0.0.1:908',
  '127.0.0.1:909',
  '127.0.0.1:9098',
  '127.0.0.1:9099',
]; // 这里写上想要匹配请求的域名白名单
module.exports = async (ctx: any, next: any) => {
  // console.log(666.8008, 'cros is ok', ctx.request);
  // 首先从ctx里获取当前请求头
  const origin = ctx.request.header.host;
  if (origin && REG_WHITE_LIST.includes(origin)) {
    // console.log(666.8009, '进入白名单');
    // ctx.set('Connection', 'keep-alive');
    ctx.set('Access-Control-Allow-Origin', origin); // 允许跨域的域名
    ctx.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,HEAD,PUT,DELETE'); // 支持跨域访问的方法
    ctx.set('Access-Control-Allow-Credentials', 'true'); // 允许传入Cookie
    ctx.set('Access-Control-Max-Age', 2592000); // 过期时间一个月30*24*60*60s
    // 如果有特殊的请求头，直接响应
    if (ctx.get('Access-Control-Request-Headers')) {
      ctx.set(
        'Access-Control-Allow-Headers',
        ctx.get('Access-Control-Request-Headers')
      );
    }
    // 浏览器某些情况下没有带Origin头
    ctx.set('Vary', 'Origin');
    // 如果是 OPTIONS 请求，则直接返回
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
  }
  await next();
};
