const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackDevConfig = require('./webpack.config.dev')
const webpackProdConfig = require('./webpack.config.prod')

let webpackConfig = {
    entry: {
        main: __dirname + '/../src/app/js/app.jsx',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/../src/public'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(jsx?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: `${__dirname}/tmp`
                }
            },
            {
                test: /\.(s?css)$/,
                use: [
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, webpackProdConfig)
} else {
    webpackConfig = merge(webpackConfig, webpackDevConfig)
}

if (process.env.WEBPACK_ANALYZER) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

    webpackConfig = merge(webpackConfig, {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerPort: 18888,
                openAnalyzer: false,
            })
        ],
    })
}

module.exports = webpackConfig
