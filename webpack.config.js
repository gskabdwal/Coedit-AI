const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/, // Match SVG files
        use: [
          '@svgr/webpack', // Use SVGR to transform SVGs into React components
          'url-loader', // Use URL loader to handle SVG files
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Example alias for easier imports
    },
  },
};
