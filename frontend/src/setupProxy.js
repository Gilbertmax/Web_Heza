const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', {
          method: req.method,
          path: req.path,
          body: req.body
        });
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', {
          error: err,
          url: req.originalUrl,
          method: req.method
        });
        res.status(500).json({ 
          error: 'Proxy error occurred' 
        });
      },
      logLevel: 'debug'
    })
  );
};