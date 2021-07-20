/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/refined-unipass/',
    filename: 'bundle.js',
  },
  target: ['web', 'es5'],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
      },
      // Transpile rule for ES6 required modules
      {
        test: /\.js$/,
        include: [
          "ky"
        ].map((pkg) => path.join(__dirname, "node_modules", pkg)),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.5%, last 2 versions, Firefox ESR, not dead, ie 11',
                useBuiltIns: 'usage',
                corejs: 3,
                shippedProposals: true,
              }],
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', {
                corejs: 3,
              }],
            ],
          },
        }],
      },
      {
        test: /\.tsx?$/,
        exclude: [/(node_modules|bower_components)/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.5%, last 2 versions, Firefox ESR, not dead, ie 11',
                useBuiltIns: 'usage',
                corejs: 3,
                shippedProposals: true,
              }],
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', {
                corejs: 3,
              }],
            ],
            sourceType: 'script',
          },
        }, {
          loader: 'ts-loader',
        }],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.GOOGLE_ANALYTICS_ID': JSON.stringify("UA-83917556-1"),
      'process.env.API_BASE_URL': JSON.stringify('https://refined-unipass.debug.so/api'),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, 'reports/webpack-bundle-analysis.html'),
      openAnalyzer: false,
    }),
  ],
};
