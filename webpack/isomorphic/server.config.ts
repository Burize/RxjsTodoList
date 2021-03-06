import * as path from 'path';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';

import devConfig from '../dev.config';
import prodConfig, { typescriptRule } from '../prod.config';
import { commonRules, getStyleRules } from '../common';

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

const serverConfig: webpack.Configuration = {
  ...config,
  name: 'server-web',
  target: 'node',
  entry: {
    main: './server.tsx',
  },
  output: {
    ...config.output,
    filename: 'index.js',
    path: path.resolve(__dirname, '..', '..', 'static'),
    libraryTarget: 'commonjs2',
  },
  module: {
    ...config.module,
    rules: [
      typescriptRule,
      ...commonRules,
      ...getStyleRules('server'),
    ],
  },
  externals: [
    nodeExternals({
      whitelist: [
        'normalize.css',
        'react-select/dist/react-select.css',
      ],
    }),
  ],
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DISABLE_SSR__: process.env.DISABLE_SSR,
    }),
    ...config.plugins || [],
  ],
  optimization: {
    ...config.optimization,
    splitChunks: false,
    runtimeChunk: false,
  },
};

export default serverConfig;
