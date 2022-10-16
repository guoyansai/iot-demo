const RouterUser = require("koa-router");
const { register, login } = require("../controller/user.controller");

const routerUser = new RouterUser({ prefix: "/users" });
// 注册接口
routerUser.post("/register", register);
// 登录接口
routerUser.post("/login", login);

module.exports = routerUser;
