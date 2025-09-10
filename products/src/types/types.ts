import "express";

export interface DecodedUser {
  userId: string;
  role: string;
  email?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedUser;
  }
}
