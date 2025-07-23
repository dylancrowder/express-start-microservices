import proxy from "express-http-proxy";

const productsServiceUrl =
  process.env.PRODUCTS_SERVICE_URL || "http://products:8083";

const productsProxy = proxy(productsServiceUrl, {
  proxyReqPathResolver: (req) => req.url.replace(/^\/products/, ""),
  // No inyectamos headers internos
});

export default productsProxy;
