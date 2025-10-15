import { RequestHandler } from 'express';
import jwt from "jsonwebtoken";
import config from "../config/config";
import * as ws_users from '../services/ws_users.service';
import { HttpError } from '../types';
import { Project } from '../models/project.model';
import { ProjectMember } from '../models/projectMember.model';

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw { status: 401, message: 'Token no proporcionado' }

    const token   = authHeader.split(' ')[1]

    const decoded = await ws_users.verifyTokenService(token);
    if(!decoded.id || !decoded.email) throw { status: 401, message: 'Token inválido' }

    const project: Project | null = await Project.findOne({ where: { code: config.prj_name }})
    if (!project) {
      throw new HttpError('Proyecto no encontrado', 404)
    }

    const member = await ProjectMember.findOne({
      where: { project_id: project.id, email: decoded.email},
      attributes: ['project_id', 'email', 'role'],
    });

    if (!member) {
      throw new HttpError('Usuario no asignado al proyecto. Pongase en contacto con el soporte', 404, { email: decoded.email, project_code: project.code });
    }
    
    console.log('==> Verify Token Gali: ', decoded.email);
    res.locals.user = { id: decoded.id, email: decoded.email };
    return next();
    
  } catch (err: unknown) {

    if (err instanceof HttpError) {

      return res.status(err.status ?? 500).json({
        message: err.message,
        error: err.payload ?? null,
      });

    }
    
    return res.status(500).json({ message: 'Error interno del servidor', error: err });
  }
};


export const verifyTokenClient: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw { status: 401, message: 'Token no proporcionado' }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt_secret as string) as { project_id: string, email: string }
    
    console.log('==> Verify Client decoded: ', decoded.email);

    if(!decoded.project_id || !decoded.email) throw { status: 401, message: 'Token inválido' }
    
    res.locals.user = { prj_id: decoded.project_id, email: decoded.email };
    return next();
    
  } catch (error: any) {
    const status = error.status || 500
    return res.status(status).json({ error: error || 'Token inválido. Status 500' })
  }
};