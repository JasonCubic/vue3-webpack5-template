const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// inspirations:
// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/base.js
// https://github.com/jherr/micro-fes-simplified-vue/blob/master/growlers/webpack.config.js

function getWebpackConfig(env, options) {
  const isDevelopmentMode = options?.mode === 'development';
  const webpackConfig = {
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
      path: path.resolve(__dirname, './dist'),
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            reactivityTransform: true,
          },
        },
        {
          // https://webpack.js.org/loaders/babel-loader/#usage
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: { loader: 'babel-loader' },
        },
        // https://webpack.js.org/guides/asset-modules/
        {
          // images
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          // do not base64-inline SVGs.
          // https://github.com/facebookincubator/create-react-app/pull/1180
          test: /\.(svg)(\?.*)?$/,
          type: 'asset/resource',
        },
        {
          // media
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          // fonts
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          // https://webpack.js.org/loaders/postcss-loader/#autoprefixer
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1, // https://github.com/webpack-contrib/css-loader#importloaders
                // 0 => no loaders (default);
                // 1 => postcss-loader;
                // 2 => postcss-loader, sass-loader
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['autoprefixer', { /* Options */ }],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: !isDevelopmentMode,
      minimizer: [
        '...',
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: isDevelopmentMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: isDevelopmentMode ? '[id].css' : '[id].[contenthash].css',
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new CopyPlugin({
        patterns: [
          { from: '**/*', context: path.resolve(__dirname, './public') },
        ],
      }),
    ],
  };
  if (!isDevelopmentMode) {
    webpackConfig.plugins.push(new CleanWebpackPlugin());
  }
  return webpackConfig;
}

module.exports = getWebpackConfig;
