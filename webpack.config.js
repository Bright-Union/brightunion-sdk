const path = require('path');

const webpack = require('webpack')

var config = {
  entry: './src/BrightClient.ts',
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        use: 'ts-loader',
        //include: /node_modules/,
        //exclude: /node_modules/,
        include: __dirname
      },
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
    fallback: {
      "fs":false,
      "os": false,
      "url": false,
      "assert": false,
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify") ,
      "http": require.resolve("stream-http") ,
      "https": require.resolve("https-browserify"),
      "crypto": require.resolve('crypto-browserify'),
      "buffer": require.resolve("buffer")
    }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    clean: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
       process: 'process/browser',
     }),
],
stats: {
   builtAt: true,
},
}

module.exports  = (env, argv) => {
  if(env.local){
    config.output.path = path.resolve(__dirname, '../app-ui/node_modules/brightunion_dev/');
  }
  return config;
};
