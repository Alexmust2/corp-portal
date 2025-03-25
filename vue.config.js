const path = require("path");
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@public": path.resolve(__dirname, "public"),
      },
      fallback: {
        crypto: false,
      },
    },
  },
  pwa: {
    name: "Корпоративный портал",
    short_name: "",
    themeColor: "#FFFFFF",
    msTileColor: "#FFFFFF",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "white",
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      swDest: "generated-sw.js", 
    },
  },
});
