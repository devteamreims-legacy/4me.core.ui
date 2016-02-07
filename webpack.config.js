var path = require('path');
var outputPath = 'dist';


var config = {
    context: __dirname + '/app',
    entry: './main.js',
    output: {
        path: outputPath,
        filename: 'scripts/bundle.js'
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'html'
        }]
    }
};

module.exports = config;
