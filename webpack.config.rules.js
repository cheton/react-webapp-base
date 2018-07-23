const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    resolve: {
        modules: [
            path.resolve(__dirname),
            'node_modules'
        ],
        extensions: ['.js', '.jsx']
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
            /*
            {
                test: /\.styl$/,
                loader: 'stylint-loader',
                enforce: 'pre'
            },
            */
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
    }
};
