const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const mapEnvToProgram = (env) => {
    if (env.prog === 'flow') {
        return {
            entry: path.resolve(__dirname, './src/flow/index.js'),
            template: path.resolve(__dirname, './src/flow/template/index.html'),
            port: 4050,
            title: 'FLOW'
        }
    }

    if (env.prog === 'diagram') {
        return {
            entry: path.resolve(__dirname, './src/diagram/index.js'),
            template: path.resolve(__dirname, './src/diagram/index.html'),
            port: 4051,
            title: 'DIAGRAM'
        }
    }
}

module.exports = (env) => {
    const { entry, template, port } = mapEnvToProgram(env)
    return {
        entry,
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.(css)$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                }
            ]
        },
        resolve: {
            extensions: ['*', '.js']
        },
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'bundle.js',
        },
        devServer: {
            contentBase: path.resolve(__dirname, './build'),
            historyApiFallback: true,
            open: true,
            host: '0.0.0.0',
            port
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
                template,
                title: 'FLOW'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, './data/sets'),
                        to: 'assets/data/sets'
                    },
                    {
                        from: path.resolve(__dirname, './data/overview.json'),
                        to: 'assets/data/overview.json'
                    }
                ]
            })
        ]
    }
};