const path = require('path');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const without = require('lodash/without');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nib = require('nib');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const stylusLoader = require('stylus-loader');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const buildConfig = require('./build.config');
const webpackConfigRules = require('./webpack.config.rules');
const pkg = require('./package.json');

dotenv.config();

const publicPath = process.env.PUBLIC_PATH || '';
const buildVersion = pkg.version;

const webpackConfig = Object.assign({}, webpackConfigRules, {
    mode: 'development',
    cache: true,
    target: 'web',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        polyfill: [
            // https://github.com/Yaffle/EventSource
            'eventsource-polyfill',
            path.resolve(__dirname, 'app/polyfill/index.js')
        ],
        app: [
            // https://github.com/Yaffle/EventSource
            'eventsource-polyfill',
            path.resolve(__dirname, 'app/index.js')
        ]
    },
    output: {
        path: path.join(__dirname, 'output'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: publicPath
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin()
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify('development'),
                    BUILD_VERSION: JSON.stringify(buildVersion),
                    LANGUAGES: JSON.stringify(buildConfig.languages),
                    PUBLIC_PATH: JSON.stringify(publicPath)
                }
            }
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new stylusLoader.OptionsPlugin({
            default: {
                // nib - CSS3 extensions for Stylus
                use: [nib()],
                // no need to have a '@import "nib"' in the stylesheet
                import: ['~nib/lib/nib/index.styl']
            }
        }),
        // https://github.com/gajus/write-file-webpack-plugin
        // Forces webpack-dev-server to write bundle files to the file system.
        new WriteFileWebpackPlugin(),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            new RegExp('^\./(' + without(buildConfig.languages, 'en').join('|') + ')$')
        ),
        new MiniCssExtractPlugin({
            filename: `[name].css?_=${buildVersion}`,
            chunkFilename: `[id].css?_=${buildVersion}`,
        }),
        new CSSSplitWebpackPlugin({
            size: 4000,
            imports: '[name].[ext]?[hash]',
            filename: '[name]-[part].[ext]?[hash]',
            preserve: false
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'output/index.html'),
            template: path.resolve(__dirname, 'public/index.html'),
            chunksSortMode: 'dependency' // Sort chunks by dependency
        }),
    ].filter(Boolean), // filter out empty values
    node: {
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    devServer: {
        //
        // https://webpack.github.io/docs/webpack-dev-server.html#additional-configuration-options
        //
        disableHostCheck: true,
        noInfo: false,
        lazy: false,
        // // https://webpack.github.io/docs/node.js-api.html#compiler
        watchOptions: {
            // poll: true, // use polling instead of native watchers
            ignored: /node_modules/
        },
        proxy: {
            '/api': {
                target: process.env.PROXY_TARGET,
                changeOrigin: true
            }
        }
    }
});

module.exports = webpackConfig;
