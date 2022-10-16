class UserController {
  async register(ctx: { body: string }, next: any) {
    ctx.body = "用户注册成功";
  }
}

module.exports = new UserController();
