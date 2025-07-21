import { createProxyMiddleware } from 'http-proxy-middleware';

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5000';

const authProxy = createProxyMiddleware({
  target: authServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
});

export default authProxy;
