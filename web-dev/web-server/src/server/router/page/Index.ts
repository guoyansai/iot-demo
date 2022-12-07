import axios from 'axios';

module.exports = (route: any) => {
  route
    .get('/api', async (ctx: any) => {
      const result = await axios.post(
        'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf'
      ); // 这是一个通过后端通过api请求第三方服务的示例，用于支撑系统对外服务请求
      ctx.body = {
        ...result.data.data,
      };
    })
    .get('/404', async (ctx: any) => {
      ctx.body ='<h1>404</h1>';
    })
    .get('/helloworld', async (ctx: any) => {
      ctx.body ='<h1>hello world</h1>';
    });
  return route;
};
