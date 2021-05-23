const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const {GenerateSW} = require('workbox-webpack-plugin');
const fs = require('fs');
const {join} = require('path');
const {promisify} = require('util');
const copyFile = promisify(fs.copyFile);

module.exports = withBundleAnalyzer({
  // reactStrictMode: true, // https://github.com/mui-org/material-ui/issues/18018
  experimental: {
    optimizeFonts: true,
  },
  exportPathMap: async function (defaultPathMap, {dev, _, outDir, distDir}) {
    if (!dev) {
      await copyFile(
        join(distDir, 'service-worker.js'),
        join(outDir, 'service-worker.js')
      );
    }

    return defaultPathMap;
  },
  future: {
    webpack5: true,
  },
  webpack: (config, {dev}) => {
    if (!dev) {
      config.plugins.push(
        new GenerateSW({
          cacheId: 'pokedot',
          clientsClaim: true,
          exclude: [
            'react-loadable-manifest.json',
            'build-manifest.json',
            /\.map$/,
          ],
          inlineWorkboxRuntime: true,
          modifyURLPrefix: {
            'static/': '_next/static/',
            'public/': '_next/public/',
          },
          skipWaiting: true,
          swDest: 'service-worker.js',
        })
      );
    }

    return config;
  },
});
