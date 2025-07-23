import proxy from "express-http-proxy";

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://auth:8085";

const authProxy = proxy(authServiceUrl, {
  proxyReqPathResolver: (req) => req.url.replace(/^\/auth/, ""),

  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    // Si bodyContent es un objeto, lo convertimos a JSON para reenviar
    return JSON.stringify(bodyContent);
  },

  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.headers["content-type"]) {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["Content-Type"] = srcReq.headers["content-type"];
    }
    return proxyReqOpts;
  },
});

export default authProxy;
