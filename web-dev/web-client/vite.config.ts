import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

import { VitePWA } from 'vite-plugin-pwa'; // 离线缓存

// 官方文档：https://cn.vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  console.log(666.701, command, mode, ssrBuild);

  const Timestamp = new Date().getTime();
  // 可以根据不同环境自定义配置
  const IS_PROD = mode === 'production';
  const { APP_HTTP_HOST, APP_HTTP_PORT, APP_API_HTTP, APP_DIST_DIR } = loadEnv(
    mode,
    process.cwd(),
    ''
  );
  console.log(666.702, APP_HTTP_HOST, APP_HTTP_PORT, APP_API_HTTP, APP_DIST_DIR);

  return {
    plugins: [
      vue(),
      // AutoImport({
      //   resolvers: [ElementPlusResolver()],
      // }),
      // Components({
      //   resolvers: [ElementPlusResolver()],
      // }),
      VitePWA({
        workbox: {
          cacheId: 'Asai', //缓存名称
          runtimeCaching: [
            {
              urlPattern: /.*\.js.*/, //缓存文件
              handler: 'StaleWhileRevalidate', //重新验证时失效
              options: {
                cacheName: 'Asai-js', //缓存js，名称
                expiration: {
                  maxEntries: 30, //缓存文件数量 LRU算法
                  maxAgeSeconds: 30 * 24 * 60 * 60, //缓存有效期
                },
              },
            },
          ],
        },
      }),
    ],
    base: './', // 将打包后的绝对路径改为相对路径
    // 配置别名，注意：需要在tsconfig配置中同步
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 开发者相关的服务配置
    server: {
      host: APP_HTTP_HOST, //调试网址
      port: Number(APP_HTTP_PORT), // 调试端口
      open: true, // 是否在运行时自动打开浏览器
      cros: true, //跨域设置
      // 代理配置
      proxy: {
        '^/api': {
          target: APP_API_HTTP,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/socket.io': {
          target: APP_API_HTTP,
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/socket.io': '',
          },
        },
        'sockjs-node': {
          target: APP_API_HTTP,
          ws: false,
          changeOrigin: true,
        },
      },
    },
    // 打包构建时的配置
    build: {
      sourcemap: !IS_PROD, // 非生产环境生成 sourcemap
      outDir: APP_DIST_DIR,
      // assetsDir: APP_DIST_DIR+'static/img/', // 指定生成静态资源的存放路径
      // Rollup 打包配置
      rollupOptions: {
        // external: ['vue', 'element-plus'], // 确保外部化处理那些你不想打包进库的依赖
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // globals: {
          //   vue: 'Vue', // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          //   'element-plus': 'elementPlus',
          // },
        },
        brotliSize: false, // 不统计
        target: 'esnext',
        minify: 'esbuild', // 混淆器，terser构建后文件体积更小
        plugins: [
          // visualizer({ open: true, gzipSize: true })
        ],
      },
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: true, //css 拆分
      assetsInlineLimit: 5000, //小于该值 图片将打包成Base64
      minify: 'terser', //是否禁用最小化混淆，esbuild打包速度最快，'terser'打包体积最小。
      terserOptions: {
        compress: {
          drop_console: IS_PROD && false,
          drop_debugger: IS_PROD && false,
        },
      },
    },
  };
});
