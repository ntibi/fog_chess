const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [ "babel-loader" ]
      },
      {
        test: /\.html$/,
        use: [ "html-loader" ]
      },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader" ]
      },
      {
        test: /\.svg$/,
        use: [ "svg-url-loader" ]
      },
      {
        test: /\.worker\.js$/,
        use: ["worker-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
  devServer: {
    host: "0.0.0.0",
    open: false,
    proxy: {
      "/api": "http://localhost:8081"
    }
  },
  node: {
    fs: "empty"
  },
};
