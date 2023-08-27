const fs = require("fs");

module.exports = {
  transpileDependencies: ["vuetify"],

  devServer: {
    port: 8080,
    https:
      process.env.NODE_ENV === "development"
        ? {
            key: fs.readFileSync("localhost+2-key.pem"),
            cert: fs.readFileSync("localhost+2.pem"),
          }
        : false,
    host: "localhost",
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/sw.js",
      swDest: "service-worker.js",
      exclude: [
        "web.config",
        /\.map$/,
        /\.ttf$/,
        /\.eot$/,
        /\.svg$/,
        /\.woff$/,
        /\.woff2$/,
      ],
    },
  },
};
