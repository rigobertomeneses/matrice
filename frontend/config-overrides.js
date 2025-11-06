module.exports = function override(config, env) {
  if (env === 'development') {
    // Deshabilitar completamente el caché en desarrollo
    config.cache = false;

    // Configurar el dev server para no cachear
    if (config.devServer) {
      config.devServer.headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      config.devServer.hot = true;
      config.devServer.liveReload = true;
    }

    // Deshabilitar cache en los loaders
    if (config.module && config.module.rules) {
      config.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(loader => {
            if (loader.options && loader.options.cacheDirectory !== undefined) {
              loader.options.cacheDirectory = false;
            }
          });
        }
      });
    }

    // Agregar timestamp a los chunks para evitar cache
    config.output.filename = 'static/js/[name].[contenthash:8].js';
    config.output.chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';

    // Configurar optimization para desarrollo
    config.optimization = {
      ...config.optimization,
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
  }

  return config;
};