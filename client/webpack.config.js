const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    miniCss.loader,
                    // Creates `style` nodes from JS strings
                    // "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ]
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
              type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new miniCss({
            filename: 'css/style.css'
        }),
        new HtmlWebpackPlugin(),
    ]
};