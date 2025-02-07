import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueSetupExtend from "vite-plugin-vue-setup-extend"
import viteCompression from "vite-plugin-compression"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import requireTransform from  'vite-plugin-require-transform';
// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  	// 获取环境配置文件
	const env = loadEnv(mode, process.cwd());
	const { VITE_APP_ENV } = env;
  return{
  plugins: [vue(),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",

  }),
    requireTransform({
      // fileRegex: /.ts$|.tsx$|.vue$|.js$/
      fileRegex: /^(?!.*node_modules).*\.(js|jsx|ts|tsx)$/,
    }),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  VueSetupExtend(),
  viteCompression({
    // 开启gzip模式
    verbose: true,
    disable: false,
    threshold: 10240 * 50,
    deleteOriginFile: false, // 压缩后是否删除源文件
    algorithm: "gzip",
    ext: ".gz",
  }),
  ],
  //  wivmalls  mall
  base:VITE_APP_ENV === 'production' ? '/' : '/',
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
      "#": path.join(__dirname, "types"),
      "@assets": path.join("src/assets"),
      "@comps": path.join("src/components"),
      "@utils": path.join("src/utils"),
      "@router": path.join("src/router"),
      "@store": path.join("src/store"),


    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],

  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  },
  build: {
    // https://blog.csdn.net/lj1530562965/article/details/122231280
    // 混淆器设置
    minify: "terser",
    // 不生成source map文件，默认false
    sourcemap: false,
    // 指定输出路径（相对于项目根目录)，默认dist
    outDir: "dist",
    // 指定生成静态资源的存放路径，默认assets
    assetsDir: "assets",
    // chunk大小警告限制，默认500kbs
    chunkSizeWarningLimit: 1500,
    // 是否禁用css拆分(默认true)，设置false时所有CSS将被提取到一个CSS文件中
    cssCodeSplit: true,
    target: ['chrome52'],
    cssTarget: ["chrome52"],
    // 简要配置
    terserOptions: {
      compress: {
        // 移除console
        drop_console: true,
        // 移除debugger
        drop_debugger: true,
      },
      // 保留类名
      keep_classnames: true,
      format: {
        // 移除所有的注释
        comments: false,
      },
    },
    // js、css等文件打包到不同文件夹
    // https://rollupjs.org/guide/en/#outputoptions-object
    /* rollupOptions: {
                  output: {
                      chunkFileNames: "assets/js/[name]-[hash].js",
                      entryFileNames: "assets/js/[name]-[hash].js",
                      assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
                  }
              } */
  },
  server: {
    host: "0.0.0.0", // 默认为localhost
    port: 5173, // 端口号
    open: false, // 是否自动打开浏览器
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      "/dev-api": {
                  target: "http://localhost:5173/", // 后端服务实际地址
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/dev-api/, ""),
        rewrite: path => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
      },
    },
  },
}
})
