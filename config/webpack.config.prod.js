const webpack = require('webpack')

const webpackProdConfig = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.BROWSER': JSON.stringify(true)
        }),
        new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
}

module.exports = webpackProdConfig
