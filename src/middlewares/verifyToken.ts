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

    if(!decoded.id || !decoded.email) throw { status: 401, message: 'Token inválido' }
    
    res.locals.user = { id: decoded.id, email: decoded.email };
    return next();
    
  } catch (error: any) {
    const status = error.status || 500
    return res.status(status).json({ error: error || 'Token inválido' })
  }
};


export const verifyTokenClient: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw { status: 401, message: 'Token no proporcionado' }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt_secret as string) as { project_id: string, email: string }
    
    console.log('==> VerifyToken decoded: ', decoded.email);

    console.log(decoded.project_id)

    if(!decoded.project_id || !decoded.email) throw { status: 401, message: 'Token inválido' }
    
    res.locals.user = { prj_id: decoded.project_id, email: decoded.email };
    return next();
    
  } catch (error: any) {
    const status = error.status || 500
    return res.status(status).json({ error: error || 'Token inválido' })
  }
};