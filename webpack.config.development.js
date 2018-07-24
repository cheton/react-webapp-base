const path = require('path');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const dotenv = require('dotenv');
const findImports = require('find-imports');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const without = require('lodash/without');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nib = require('nib');
const stylusLoader = require('stylus-loader');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const buildConfig = require('./build.config');
const pkg = require('./package.json');

dotenv.config();

const publicPath = process.env.PUBLIC_PATH || '';
const buildVersion = pkg.version;
const timestamp = new Date().getTime();

module.exports = {
    mode: 'development',
    cache: true,
    target: 'web',
    devtool: 'cheap-module-eval-source-map',
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
    },
    entry: {
        polyfill: [
            'eventsource-polyfill', // https://github.com/Yaffle/EventSource
            'webpack-hot-middleware/client?reload=true', // https://github.com/glenjamin/webpack-hot-middleware
            path.resolve(__dirname, 'app/polyfill/index.js')
        ],
        vendor: [
            'eventsource-polyfill', // https://github.com/Yaffle/EventSource
            'webpack-hot-middleware/client?reload=true', // https://github.com/glenjamin/webpack-hot-middleware
            ...findImports([
                'app/**/*.{js,jsx}',
                '!app/polyfill/**/*.js',
                '!app/**/*.production.js'
            ], { flatten: true })
        ],
        app: [
            'eventsource-polyfill', // https://github.com/Yaffle/EventSource
            'webpack-hot-middleware/client?reload=true', // https://github.com/glenjamin/webpack-hot-middleware
            path.resolve(__dirname, 'app/index.js')
        ]
    },
    output: {
        path: path.join(__dirname, 'output'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: publicPath
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
                options: {
                    quiet: true
                }
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|docs)/
            },
            {
                test: /\.styl$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?camelCase&modules&importLoaders=1&localIdentName=[path][name]__[local]--[hash:base64:5]',
                    'stylus-loader'
                ],
                exclude: [
                    path.resolve(__dirname, 'app/styles')
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?camelCase',
                    'stylus-loader'
                ],
                include: [
                    path.resolve(__dirname, 'app/styles')
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    node: {
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
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
            filename: `[name].css?_=${timestamp}`,
            chunkFilename: `[id].css?_=${timestamp}`
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
        })
    ],
    resolve: {
        modules: [
            path.resolve(__dirname),
            'node_modules'
        ],
        extensions: ['.js', '.jsx']
    }
};
