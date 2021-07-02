/* eslint-disable no-console */
'use strict'


const pages = {};

pages['gt'] = {
  entry: './src/multipages/gt/gt.app.js',
  publicPath: '/',
  fileName: '/gt.html',
  template: 'public/index.html',
  title: 'gt',
  chunks: ['chunk-vendors', 'chunk-common', 'chunk-gt-vendors', 'gt'] 
};


module.exports = {
    pages,
    configureWebpack: {
        optimization: {
            splitChunks: {
                minSize: 1
            }
        }
    },
    "transpileDependencies": [
        "vuetify"
    ],

    devServer: {
        host: 'local.com',
        historyApiFallback: {
            rewrites: [
                { from: /\//, to: '/gt.html' }
            ]
        }
    },
}