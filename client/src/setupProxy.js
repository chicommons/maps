const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: process.env.BACKEND_URL,
      changeOrigin: true,
    })
  );
};

