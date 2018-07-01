var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')

const extpath = path.join(__dirname, './src/extension/browser/');
const distPath = path.join(__dirname, "dist");

const baseConfig = (params) => ({
    mode: "development",
    entry: {
        background: [path.join(extpath, "background", "background")],
        //      options: [`${extpath}options/index`],
        //    window: [`${extpath}window/index`],
        devpanel: [path.join(extpath, "devpanel", "devpanel")],
        devtools: [path.join(extpath, "devtools", "devtools")],
        content: [path.join(extpath, "inject", "contentScript")],
        page: [path.join(extpath, "inject", "pageScript")],
        pagewrap: [path.join(extpath, "inject", "pageWrap")]
        // 'redux-devtools-extension': [`${extpath}inject/index`, `${extpath}inject/deprecatedWarn`],
        //inject: [path.join(extpath, "inject", "inject")],
        //...params.inputExtra
    },
    devtool: 'cheap-module-source-map',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js',
        path: path.join(distPath, "js")
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),

        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new CopyWebpackPlugin([
            {
                from: `${extpath}/views/*`,
                to: `${distPath}`,
                flatten: true
            },
            {
                from: `${extpath}/manifest.json`,
                to: `${distPath}`,
                flatten: true
            }
        ])
        // new UglifyJsPlugin({
        //     comments: false,
        //     compressor: {
        //         warnings: false
        //     },
        //     mangle: {
        //         screw_ie8: true,
        //         keep_fnames: true
        //     }
        // })

    ],
    resolve: {
        // alias: {
        //     app: path.join(__dirname, '../src/app'),
        //     tmp: path.join(__dirname, '../build/tmp')
        // },
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /(node_modules|tmp\/page\.bundle)/
            },
            {
                test: /\.css?$/,
                use: ['style-loader', 'raw-loader'],
            }
        ]
    }
});

module.exports = baseConfig();