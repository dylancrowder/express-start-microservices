import proxy from "express-http-proxy";

export function createProxy(
  target: string,
  pathPrefix: string,
  requireAuth = false
) {
  return proxy(target, {
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace(new RegExp(`^${pathPrefix}`), ""),
    proxyReqBodyDecorator: (body) => body,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["Content-Type"] = "application/json";

      if (requireAuth && (srcReq as any).user) {
        const user = (srcReq as any).user;
        proxyReqOpts.headers["x-user-id"] = user.userId;
        proxyReqOpts.headers["x-user-role"] = user.role;
      }

      return proxyReqOpts;
    },
  });
}
