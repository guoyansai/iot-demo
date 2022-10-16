const Router = require("koa-router");
const router = new Router({ prefix: "/users" });
router.get("/", (ctx: { body: string }, next: any) => {
  ctx.body = "hello users";
});

module.exports = router;
