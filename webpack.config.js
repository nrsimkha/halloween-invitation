const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('IS DEV ' + isDev)

const optimization = () => {
    const config = {
        splitChunks: {
            cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
        },
    }
    if(isProd){
        config.minimizer =[
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill','./scripts/main.js'],
        api: './scripts/api.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        libraryExport: 'default'
    },
    resolve: {
        extensions: ['.js']
    },
    optimization: optimization(),
    devtool: isDev ? 'source-map' : '',
    devServer: {
        contentBase: path.join(__dirname, '/dist/'),
        compress: true,
        port: 4200,
        hot: isDev
    },
    plugins: [
       new HTMLWebpackPlugin({
            template: './index.html',
            favicon: './assets/favicon.ico',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CleanWebpackPlugin(),        
    ],
    module: {
        rules: [
           {
                test: /\.html$/i,
                use: ['html-loader'],
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    }
                }, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: 'img/',
                        esModule: false
                    }
                }
                ],
            },
            {
                test: /\.(ttf|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'                        
                    }
                }
                ],
            },
            {
                test: /\.scss$/i,
                use: [                                  
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        }
                    },                  
                    'css-loader', 
                    'resolve-url-loader',                  
                    'sass-loader'
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
        ]
    }
}