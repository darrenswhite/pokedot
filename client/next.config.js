const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // reactStrictMode: true, // https://github.com/mui-org/material-ui/issues/18018
  experimental: {
    optimizeFonts: true,
  },
  future: {
    webpack5: true,
  },
  trailingSlash: true,
});
