# 后端node+koa+ts开发环境搭建示例

## 项目初始化与运行命令
```
# 1 安装依赖
npm i
# 2 运行项目
npm run dev
```
---
- 详细创建过程如下：
## 1. `npm init`创建项目`package.json`文件
```js
npm init
npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (ui-init)
version: (1.0.0)
description:    
entry point: (index.js) 
test command:   
git repository: 
keywords:       
author: 
license: (ISC)  
About to write to D:\Web\Code\git\iot\web-server\ui-init\package.json:

{
  "name": "ui-init",
  "author": "",
  "license": "ISC"
}

Is this OK? (yes)
```
## 2. 安装主依赖
- `npm i -D typescript ts-node-dev`
- `npm i koa koa-router koa-static socket.io axios`
- `npm i -D @type/koa`

## 3. 建立`tsconfig.json`文件
```json
{
	"compilerOptions": {
		"target": "esnext", // 目标语言版本
		"module": "commonjs", // 指定生成代码的模板标准
		"sourceMap": true,
		"outDir": "./dist",
		"rootDir": "./src", // 指定输出目录, 默认是dist文件夹
		"strict": true,
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true
	},
	// 需要编译的的文件和目录
	"include": ["src"],
	"exclude": ["node_modules", "dist", "public"]
}
```
## 4. 建立入口文件`app.ts`
```ts
import Koa, { DefaultContext, DefaultState, Context } from "Koa";

const app: Koa<DefaultState, DefaultContext> = new Koa();

app.use(async (ctx: Context) => {
  ctx.body = "Codroid Server";
});

app.listen(9098, () => {
  console.log("Codroid服务启动成功，running http://127.0.0.1:9098");
});
```
## 5. 最终的`package.json`文件如下
```json
{
  "name": "ui-init",
  "version": "1.0.0",
  "description": "",
  "main": "app.ts",
  "scripts": {
    "dev": "ts-node-dev --respawn app.ts"
  },
  "author": "codroid",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.1.3",
    "koa": "^2.13.4",
    "koa-router": "^12.0.0",
    "koa-static": "^5.0.0",
    "socket.io": "^4.5.3"
  },
  "devDependencies": {
    "@types/koa": "^2.13.5",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.8.4"
  }
}
```
## 6. 输入`npm run dev`开启开发与调试模式