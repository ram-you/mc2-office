process.env.BABEL_ENV = 'renderer'

const path = require('path')
const { dependencies } = require('../package.json')

/* eslint-disable*/
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const VueLoaderPlugin = require('vue-loader/lib/plugin')
/* eslint-enable */

const devMode = process.env.NODE_ENV !== 'production'


const whiteListedModules = ['vue']

const rendererConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(
      d => !whiteListedModules.includes(d)
    )
  ],
  module: {
    rules: [

      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },



      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', ]
      },


      {
        test: /\.styl$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
      },



      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },

      {
        test: /\.js$/,

        loader: 'babel-loader',
        exclude: /node_modules/
      },



      {
        test: /\.node$/,
        use: 'node-loader'
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          loaders: {
            js: 'babel-loader'
          }
        }
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      nodeModules: process.env.NODE_ENV !== 'production' ? path.resolve(__dirname, '../node_modules') : false,
      minify: true
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      preload: /\.js$/,
      prefetch: {
        test: /\.js$/,
        chunks: 'async'
      },
    }),

    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].[hash].css',
    })


  ],

  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
    chunkFilename: '[name].[chunkhash:4].js',
    // crossOriginLoading: 'anonymous',
  },

  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js',
      // fabric$: path.join(__dirname, '../src/renderer/assets/script/fabric.js')
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target: 'electron-renderer',

  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: false,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],


  },



}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.plugins.push(
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../static'),
      to: path.join(__dirname, '../dist/electron/static'),
      ignore: ['.*']
    }])
  )
}



module.exports = rendererConfig