const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const prefixer = require('postcss-prefix-selector');

module.exports = env => {
    console.log('Admin: ', env && env.hasOwnProperty('admin'));

    return {
        entry: ['babel-polyfill', './index.js'],
        // entry: './index.js',
        output: {
            path: path.join(__dirname, '/lib'),
            filename: 'index.js',
            library: 'WebChat',
            libraryTarget: 'umd'
        },
        devServer: {
            stats: 'errors-only',
            host: 'localhost',
            port: env && env.hasOwnProperty('admin') ? '28281': '28280',
            open: true, // Open the page in browser
            contentBase: [__dirname, path.resolve(__dirname, 'lib')],
            proxy: [
                {
                    context: ['/websocket'],
                    target: 'ws://chatbot.sistas.com.tr:' + (env && env.hasOwnProperty('admin') ? '32301': '32300'),
                    ws: true
                }, {
                    context: ['/api'],
                    target: 'http://chatbot.sistas.com.tr:' + (env && env.hasOwnProperty('admin') ? '32301': '32300')
                }, {
                    context: ['/content'],
                    target: 'http://chatbot.sistas.com.tr:' + (env && env.hasOwnProperty('admin') ? '32301': '32300')
                }
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        mode: 'development',
        devtool: 'eval-source-map',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }, {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                insert:  function (element) {
                                    try {
                                        if (window._webChatStyleElements == null) {
                                            window._webChatStyleElements = [];
                                        }

                                        window._webChatStyleElements.push(element);
                                    } catch (e) {
                                        console.warn(e);
                                    }
                                }
                            }
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    prefixer({
                                        prefix: '.sistas-chatbot'
                                    })
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(__dirname, 'src/scss/')]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Web Chat Widget Test',
                filename: 'index.html',
                inject: false,
                template: 'dev/src/index.html',
                showErrors: true
            })
        ]
    }
};
