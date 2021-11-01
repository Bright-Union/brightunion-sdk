const path = require('path');

// const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');

var config = {
  entry: './src/BrightClient.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    filename: 'BrightClient.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
  },
  plugins: [
    // new ESLintPlugin(
    //   {
    //     extensions: ['.tsx', '.ts', '.js', 'json'],
    //
    //   }
    // ),
  // new CleanWebpackPlugin(['./@types', './dist']),
  // new DeclarationBundlerPlugin({
  //   moduleName: '"@mycomp/mylib"',
  //   out: '../@types/index.d.ts',
  // }),
  // new CopyWebpackPlugin([
  //   {
  //     from: './types/package.json',
  //     to: '../@types/package.json',
  //   },
  //   {
  //     from: './src/package.json',
  //     to: '../dist/package.json',
  //   },
  // ]),
],
}

module.exports  = (env, argv) => {
  if(env.local){
    config.output.path = path.resolve(__dirname, '../app-ui/node_modules/brightunion_dev/');
  }
  return config;
};
