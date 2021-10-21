const path = require('path');

var config = {
  entry: './src/index.ts',
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bu-sdk.js',
    path: path.resolve(__dirname, 'dist'),
  },
}

module.exports  = (env, argv) => {
  if(env.local){
    config.output.path = path.resolve(__dirname, '../app-ui/src/store/modules');
  }
  return config;
};
