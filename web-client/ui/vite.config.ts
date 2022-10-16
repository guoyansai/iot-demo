import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

import { VitePWA } from 'vite-plugin-pwa'; // 离线缓存
// import { resolve } from 'path';

// const resolvePath = (path) => resolve(__dirname, path);// 需要安装@types/node

export default defineConfig(({ mode }) => {
  console.log('<<<<<<<<<< VITE_ENV >>>>>>>>>>', mode);
  // 可以根据不同环境自定义配置
  const IS_PROD = mode === 'production';

  return {
    plugins: [
      vue(),
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
    resolve: {
      alias: {
        // '@': resolvePath('src'),
        // '@': './src',
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 开发服务器配置
    server: {
      host: '127.0.0.1',
      port: 909,
      open: true,
      cros: true,
      // https: true,
      // 代理配置
      // proxy: {
      //   '^/api': {
      //     target: 'https://***.com',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
    esbuild: {
      // 生产环境删除 console、debugger 语句
      drop: IS_PROD ? ['debugger', 'console'] : [],
    },
    // 构建时配置
    build: {
      outDir: '../../web-client-dist/ui/',
      // 非生产环境生成 sourcemap
      sourcemap: !IS_PROD,
      // Rollup 打包配置
      rollupOptions: {
        plugins: [
          // visualizer({ open: true, gzipSize: true })
        ],
      },
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: true, //css 拆分
      assetsInlineLimit: 5000, //小于该值 图片将打包成Base64
      minify: false, //是否禁用最小化混淆，esbuild打包速度最快，'terser'打包体积最小。
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
