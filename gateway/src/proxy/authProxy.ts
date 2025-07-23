import proxy from "express-http-proxy";

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://auth:8085";

const authProxy = proxy(authServiceUrl, {
  proxyReqPathResolver: (req) => req.url.replace(/^\/auth/, ""),
  // Sin inyectar headers internos
});

export default authProxy;
