class UserController {
  async register(ctx: { body: string }, next: any) {
    ctx.body = "用户注册成功";
  }
  async login(ctx: { body: string }, next: any) {
    ctx.body = "用户登录成功";
  }
}

module.exports = new UserController();
