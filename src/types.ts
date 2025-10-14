import "express-serve-static-core";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}