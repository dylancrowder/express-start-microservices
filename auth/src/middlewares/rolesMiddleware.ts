export const roleMiddleware =
  (...rolesPermitidos: string[]) =>
  (req: any, res: any, next: any): any | void => {
    const user = req.user;

    if (!user || !rolesPermitidos.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
