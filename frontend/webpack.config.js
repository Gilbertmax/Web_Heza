const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ... otras configuraciones si las tienes
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Ajusta el puerto si tu backend usa otro
        changeOrigin: true,
        secure: false,
      }
    }
  }
};
