const { createUser } = require("../service/user.service");

class UserController {
  async register(ctx: any, next: any) {
    // 获取request数据
    const { user_name, password } = ctx.request.body;
    // 操作数据库
    const res = await createUser(user_name, password);
    // 返回结果
    ctx.body = `用户注册成功${ctx.request.body}`;
  }
  async login(ctx: { body: string }, next: any) {
    ctx.body = "用户登录成功";
  }
}

module.exports = new UserController();
