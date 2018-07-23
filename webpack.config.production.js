const path = require('path');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const without = require('lodash/without');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nib = require('nib');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const stylusLoader = require('stylus-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const buildConfig = require('./build.config');
const webpackConfigRules = require('./webpack.config.rules');
const pkg = require('./package.json');

const publicPath = '';
const buildVersion = pkg.version;

const webpackConfig = Object.assign({}, webpackConfigRules, {
    mode: 'production',
    cache: true,
    target: 'web',
    devtool: '',
    entry: {
        polyfill: [
            path.resolve(__dirname, 'app/polyfill/index.js')
        ],
        app: [
            path.resolve(__dirname, 'app/index.js')
        ]
    },
    output: {
        path: path.join(__dirname, 'output'),
        chunkFilename: `[name].[hash].bundle.js?_=${buildVersion}`,
        filename: `[name].[hash].bundle.js?_=${buildVersion}`,
        pathinfo: false, // Defaults to false and should not be used in production
        publicPath: publicPath
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
    ].filter(Boolean), // filter out empty values
    node: {
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
});

module.exports = webpackConfig;
