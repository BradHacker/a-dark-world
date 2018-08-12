const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const proxy = require("http-proxy-middleware");
const convert = require("koa-connect");

const outputDirectory = "dist";

module.exports = {
  entry: {
    index: "./src/client/index.js"
  },
  mode: "development",
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico"
    })
  ],
  serve: {
    open: {
      app: "Google Chrome",
      path: "/"
    },
    port: 3000,
    add: (app, middleware, options) => {
      middleware.webpack();
      middleware.content();
      app.use(convert(proxy("/api", { target: "http://localhost:8080" })));
    }
  },
  mode: process.env.WEBPACK_SERVE ? "development" : "production",
  devtool: "inline-source-map"
};
