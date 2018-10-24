const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// var fs = require('fs');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals')
// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = {
  entry: './src/index.js',
  target: 'node', // should use this in node rest api using express
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  externals: [nodeExternals()], // this will exclude all node modules in compiled bundle code
  module: {
    rules: [
      {
        // babel is used for transpiling code from ES6 to ES5 since browser doesnot support
        // ES6 code. For instance : import express from 'express', import is not supported in browser
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader' 
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    // this plugin is to generate index.html in dist folder from a template html
    // usually for frontend code not for backend code like rest api 
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.IgnorePlugin(/\.(css|less)$/)
  ],
  devtool: 'sourcemap',
  optimization: {
    minimizer: [
      new UglifyJsPlugin() // this plugin is to make code unreadable (ugly)
    ]
  }
}