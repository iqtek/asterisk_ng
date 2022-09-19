const path = require("path");

const webpack = require("webpack");

const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin');
const ZipPlugin = require("zip-webpack-plugin");


const BUILD_DIR = "build"


module.exports = (env, argv) => {

    
    if (argv.mode === 'production') {
        config.optimization.chunkIds = "total-size";

        const terserPlugin= new TerserPlugin({
            extractComments: false,
            terserOptions: {
                compress: {
                  drop_console: true,
                },
            }
        })

        config.optimization.minimizer = [terserPlugin];
    }
  
    if (argv.mode === 'development') {
        config.optimization.chunkIds = "named";

        const terserPlugin= new TerserPlugin({
            extractComments: false,
            terserOptions: {
                compress: {
                  drop_console: false,
                },
            }
        })
        config.optimization.minimizer = [terserPlugin];
    }
  
    return config;
};


var config = {

    context: __dirname,

    entry: path.resolve(__dirname, './src/script.ts'),

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    shadowMode: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    'vue-loader',
                    'vue-svg-loader',
                ],
            }
        ],
    },

    devtool: false,

    optimization: {
        minimize: true,
        chunkIds: "named",
        minimizer: [],
    },

    externals: {
        jquery: 'jquery',
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.resolve(__dirname, `./${BUILD_DIR}`),
            ],
        }),
        new webpack.DefinePlugin({
            /*
                SETTINGS_FIELD: The name of the text field for storing settings specified in manifest.json.
                NOTIFICATON_DELAY: Minimum delay between notifications (seconds).
            */
            SETTINGS_FIELD: JSON.stringify("jsonSettings"),
            NOTIFICATON_DELAY: 300,
            MIN_LENGTH_INTERNAL_NUMBER: 3
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "src/blank"), to: path.resolve(__dirname, `./${BUILD_DIR}/widget`) },
            ]
        }),
        new ZipPlugin({
            path: path.resolve(__dirname, `./${BUILD_DIR}`),
            filename: 'widget',
            extension: 'zip',
        }),
        new VueLoaderPlugin()
    ],

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        path: path.resolve(__dirname, `${BUILD_DIR}/widget`),
        filename: 'script.js',
        library: {
            type: "amd",
            export: ['default'],
        },

    }
}
