module.exports = (route: any) => {
  route
    .get('/index', async (ctx: any) => {
      ctx.body = '<h1>index</h1>';
    })
    .get('/try', async (ctx: any) => {
      ctx.body = '<h1>try something</h1>';
    })
    .get('/ui', async (ctx: any) => {
      ctx.body = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" href="../web-client/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Codroid</title>
          <script type="module" crossorigin src="../web-client/static/js/index-a0940fe8.js"></script>
          <link rel="stylesheet" href="../web-client/static/css/index-2ab9a729.css">
        <link rel="manifest" href="../web-client/manifest.webmanifest"><script id="vite-plugin-pwa:register-sw" src="../web-client/registerSW.js"></script></head>
        <body>
          <div id="app"></div>
          
        </body>
      </html>
      `;
    });
  return route;
};
