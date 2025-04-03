const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ 
          error: 'Error de conexión con el servidor. Por favor, asegúrate de que el servidor backend esté en ejecución.' 
        });
      },
      // Add retry logic
      onProxyReq: (proxyReq, req, res) => {
        req.on('error', (err) => {
          console.error('Request error:', err);
        });
      }
    })
  );
};