import { NextFunction, Request } from "express";
declare function monitor(req: Request, res: any, next: NextFunction): void;
export default monitor;
