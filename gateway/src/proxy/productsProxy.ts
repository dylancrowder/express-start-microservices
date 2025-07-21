import { createProxyMiddleware } from 'http-proxy-middleware';

const productsServiceUrl = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:6000';

const productsProxy = createProxyMiddleware({
  target: productsServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/products': '',
  },
});

export default productsProxy;
