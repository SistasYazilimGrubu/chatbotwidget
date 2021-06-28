'use strict';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const prefixer = require('postcss-prefix-selector');

module.exports = {
    entry: ['babel-polyfill', './index.js'],
    // entry: './index.js',
    output: {
        path: path.join(__dirname, '/lib'),
        filename: 'index.js',
        library: 'WebChat',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insert: function (element) {
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
            },
            {
                test: /\.(jpg|png|gif|svg|mp4)$/,
                use: {
                    loader: 'url-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['lib']),
        new FileManagerPlugin({
            onEnd: {
                delete: [
                    '../chatbot-gateway/src/main/webapp/content/img',
                    '../chatbot-admin-gateway/src/main/webapp/content/img'
                ],
                copy: [
                    {source: path.join(__dirname, '/lib/index.js'), destination: '../chatbot-gateway/src/main/webapp/widget/widget.js'},
                    {source: path.join(__dirname, '/lib/index.js'), destination: '../chatbot-admin-gateway/src/main/webapp/widget/widget.js'},
                    {source: path.join(__dirname, '/content/img/*.*'), destination: '../chatbot-gateway/src/main/webapp/content/img'},
                    {source: path.join(__dirname, '/content/img/*.*'), destination: '../chatbot-admin-gateway/src/main/webapp/content/img'}
                ]
            }
        })
    ]
};
