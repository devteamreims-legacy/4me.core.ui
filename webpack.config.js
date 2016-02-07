var path = require('path');
var outputPath = 'dist';
var HtmlWebpackPlugin = require('html-webpack-plugin');


var config = {
    context: __dirname + '/app',
    entry: './main.js',
    output: {
        path: outputPath,
        filename: 'scripts/bundle.js'
    },
    module: {
        loaders: [
          {
            test: /\.html$/,
            loader: 'raw'
          }, {
            test: /\.css$/,
            loader: 'style!css'
          }, {
            test: /\.svg$/,
            loader: 'raw'
          }
        ]
    }
};

config.plugins = [];
config.plugins.push(
    new HtmlWebpackPlugin({
        template: 'index.html',
        inject: 'body'
    })
);

module.exports = config;
