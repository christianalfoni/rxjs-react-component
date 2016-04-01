var path = require('path');
var webpack = require('webpack');

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel",
    "query": {
      "presets": [
        "es2015"
      ]
    }
  }
];

module.exports = {
  entry: path.resolve('src', 'index.js'),
  output: {
    libraryTarget: 'umd'
  },
  externals: ['react', 'rxjs'],
  module: {
    loaders: loaders
  }
};
