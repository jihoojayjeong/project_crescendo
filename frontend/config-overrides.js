module.exports = function override(config, env) {
    // Custom Webpack Dev Server settings
    config.devServer = config.devServer || {};
    config.devServer.host = 'crescendo.cs.vt.edu';
    config.devServer.disableHostCheck = true;
  
    return config;
  };
  