const path = require('path');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const findImports = require('find-imports');
const without = require('lodash/without');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nib = require('nib');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const stylusLoader = require('stylus-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const buildConfig = require('./build.config');
const pkg = require('./package.json');

const publicPath = '';
const buildVersion = pkg.version;
const timestamp = new Date().getTime();

module.exports = {
    mode: 'production',
    cache: true,
    target: 'web',
    devtool: '',
    entry: {
        polyfill: [
            path.resolve(__dirname, 'app/polyfill/index.js')
        ],
        vendor: findImports([
            'app/**/*.{js,jsx}',
            '!app/polyfill/**/*.js',
            '!app/**/*.development.js'
        ], { flatten: true }),
        app: [
            path.resolve(__dirname, 'app/index.js')
        ]
    },
    output: {
        path: path.join(__dirname, 'output'),
        chunkFilename: `[name].[hash].bundle.js?_=${timestamp}`,
        filename: `[name].[hash].bundle.js?_=${timestamp}`,
        pathinfo: false, // Defaults to false and should not be used in production
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
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify('production'),
                    BUILD_VERSION: JSON.stringify(buildVersion),
                    LANGUAGES: JSON.stringify(buildConfig.languages),
                    PUBLIC_PATH: JSON.stringify(publicPath)
                }
            }
        }),
        new stylusLoader.OptionsPlugin({
            default: {
                // nib - CSS3 extensions for Stylus
                use: [nib()],
                // no need to have a '@import "nib"' in the stylesheet
                import: ['~nib/lib/nib/index.styl']
            }
        }),
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
    ],
    resolve: {
        modules: [
            path.resolve(__dirname),
            'node_modules'
        ],
        extensions: ['.js', '.jsx']
    }
};
