const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
  mode: 'development',
  entry: ['./src/app.scss', './src/app.js'],
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Noodles',
      template: 'src/index.html',
    }),
  ],
  output: {
    // This is necessary for webpack to compile
    // But we never use style-bundle.js
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    static: './dist',
    allowedHosts: 'all',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },
}];