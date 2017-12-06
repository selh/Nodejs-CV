const webpack = require('webpack')

const webpackDevConfig = {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // The DefinePlugin allows you to create global constants which can be configured at compile time.
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.BROWSER': JSON.stringify(true)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}

module.exports = webpackDevConfig
