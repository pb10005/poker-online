const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: {
        "bundle": path.join(__dirname, "src/main.js"),
        "dealer": path.join(__dirname, "src/dealer.js")
    },
    output: {
        path: path.join(__dirname, "public/javascripts"),
        filename: "[name].js"
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [new UglifyJsPlugin()]
};

