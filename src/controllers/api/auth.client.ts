import { RequestHandler } from 'express';
import { LoginSchema } from '../../schemas/auth.schema';
import { HttpError } from '../../types';

import { Project } from '../../models/project.model';
import { ProjectMember } from '../../models/projectMember.model';
//import * as prjSch from '../../schemas/projects.schema';

import config from '../../config/config';

import { userLoginService } from '../../services/ws_users.service';
import jwt from "jsonwebtoken";

export const loginClient: RequestHandler = async (req, res) => {

  try {

    const { project_code } = req.query
    if (!project_code || typeof project_code !== 'string') {
      throw new HttpError('El código del proyecto es obligatorio', 400)
    }

    const validator = LoginSchema.safeParse(req.body)
    if (!validator.success) {
      throw new HttpError('Error al validar el esquema', 400, validator.error.issues)
    }

    const project: Project | null = await Project.findOne({ where: { code: project_code }})
    if (!project) {
      throw new HttpError('Proyecto no encontrado', 404)
    }

    const loginData = validator.data;

    const member = await ProjectMember.findOne({
      where: { project_id: project.id, email: loginData.email},
      attributes: ['project_id', 'email', 'role'],
    });

    if (!member) {
      throw new HttpError('Usuario no encontrado en el proyecto', 404);
    }

    // 🔑 Token generate
    const loginResponse = await userLoginService(loginData.email, loginData.password)
    const user_result   = loginResponse.usuario

    const token_generate = jwt.sign({ project_id: project.id, email: user_result.email }, config.jwt_secret, { expiresIn: '24h' });

    console.log('==> Nuevo login: ', loginResponse.usuario.email, '==> Project_code ', project_code);

    return res.status(200).json({ token: token_generate, member: member, user: user_result });

  } catch (err: unknown) {

    if (err instanceof HttpError) {

      return res.status(err.status ?? 500).json({
        message: err.message,
        error: err.payload ?? null,
      });

    }
    
    return res.status(500).json({ message: 'Error interno del servidor', error: err });
  }
}