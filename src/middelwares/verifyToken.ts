import { RequestHandler } from 'express';
import jwt from "jsonwebtoken";
import config from "../config/config";

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw { status: 401, message: 'Token no proporcionado' }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt_secret as string) as { id: number, email: string }
    
    console.log('==> VerifyToken decoded: ', decoded.email);
    
    res.locals.user = { id: decoded.id, email: decoded.email };
    return next();
    
  } catch (error: any) {
    const status = error.status || 500
    return res.status(status).json({ error: error || 'Token inválido' })
  }
};