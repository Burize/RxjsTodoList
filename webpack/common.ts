import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import * as postcssReporter from 'postcss-reporter';
import * as postcssEasyImport from 'postcss-easy-import';
import * as postcssSCSS from 'postcss-scss';
import * as autoprefixer from 'autoprefixer';
import * as stylelint from 'stylelint';
import * as doiuse from 'doiuse';

// http://www.backalleycoder.com/2016/05/13/sghpa-the-single-page-app-hack-for-github-pages/
const isNeed404Page: boolean = process.env.NODE_ENV_MODE === 'gh-pages' ? true : false;

export const commonPlugins: webpack.Plugin[] = [
  new CleanWebpackPlugin(['build', 'static'], { root: path.resolve(__dirname, '..') }),
  new MiniCssExtractPlugin({
    filename: `css/[name].css`,
    chunkFilename: `css/[id].css`,
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'assets/index.html',
    chunksSortMode: sortChunks,
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV_MODE': JSON.stringify(process.env.NODE_ENV_MODE),
    '__HOST__': JSON.stringify('http://localhost:3000'),
    '__LANG__': JSON.stringify(process.env.LANG || 'en'),
    '__CLIENT__': true,
    '__SERVER__': false,
  }),
]
  .concat(isNeed404Page ? (
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: 'assets/index.html',
      chunksSortMode: sortChunks,
    })
  ) : []);

function sortChunks(a: HtmlWebpackPlugin.Chunk, b: HtmlWebpackPlugin.Chunk) {
  const order = ['app', 'vendors', 'runtime'];
  return order.findIndex(item => b.names[0].includes(item)) - order.findIndex(item => a.names[0].includes(item));
}

export const commonRules: webpack.Rule[] = [
  {
    test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
    use: 'file-loader?name=fonts/[hash].[ext]',
  },
  {
    test: /\.(png|svg)/,
    loader: 'url-loader',
    options: {
      name: 'images/[name].[ext]',
      limit: 10000,
    },
  },
];

export function getStyleRules(type: 'dev' | 'prod' | 'server') {
  const cssLoaders: Record<typeof type, webpack.Loader[]> = {
    dev: ['style-loader', 'css-loader'],
    prod: [MiniCssExtractPlugin.loader, 'css-loader'],
    server: ['css-loader/locals'],
  };
  const scssFirstLoaders: Record<typeof type, webpack.Loader[]> = {
    dev: ['style-loader', 'css-loader?importLoaders=1'],
    prod: [MiniCssExtractPlugin.loader, 'css-loader?importLoaders=1'],
    server: ['css-loader/locals?importLoaders=1'],
  };

  return [
    {
      test: /\.css$/,
      use: cssLoaders[type],
    },
    {
      test: /\.scss$/,
      use: scssFirstLoaders[type].concat(commonScssLoaders),
    },
  ];
}

const commonScssLoaders: webpack.Loader[] = [
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => {
        return [
          autoprefixer({
            browsers: ['last 2 versions'],
          }),
        ];
      },
    },
  },
  'sass-loader',
  {
    loader: 'postcss-loader',
    options: {
      syntax: postcssSCSS,
      plugins: () => {
        return [
          postcssEasyImport({
            extensions: '.scss',
          }),
          stylelint(),
          doiuse({
            // https://github.com/browserslist/browserslist
            // to view resulting browsers list, use the command in terminal `npx browserslist "defaults, not ie > 0"`
            browsers: ['defaults', 'not op_mini all', 'not ie > 0', 'not ie_mob > 0'],
            ignore: [],
            ignoreFiles: ['**/normalize.css'],
          }),
          postcssReporter({
            clearReportedMessages: true,
            throwError: true,
          }),
        ];
      },
    },
  },
];

export const commonConfig: webpack.Configuration = {
  target: 'web',
  context: path.resolve(__dirname, '..', 'src'),
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'build'),
    filename: `js/[name].bundle.js`,
    chunkFilename: `js/[name].bundle.js`,
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    hot: true,
    contentBase: path.resolve('..', 'build'),
    host: '0.0.0.0',
    port: 8080,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    disableHostCheck: true,
    stats: {
      colors: true,
      errors: true,
      errorDetails: true,
      warnings: true,
      assets: false,
      modules: false,
    },
  },
};
