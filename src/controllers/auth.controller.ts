import { RequestHandler } from 'express';
import { LoginSchema } from '../schemas/auth.schema';
import { HttpError } from '../types';

import config from '../config/config';

import { userLoginService } from '../services/ws_users.service';
import { Project } from '../models/project.model';
import { ProjectMember } from '../models/projectMember.model';


/* login exclusivo para GaliFlower */
export const login: RequestHandler = async (req, res) => {

  console.log('\x1b[33m%s\x1b[0m', '==> Login GaliFlower');

  try {

    const validator = LoginSchema.safeParse(req.body)
    if (!validator.success) {
      throw new HttpError('Error al validar el esquema', 400, validator.error.issues);
    }
    const loginData = validator.data;

    /* Verificar permisos Gali Flower */
    const { project_name } = req.body;
    if (project_name !== config.prj_name) {
      throw new HttpError('Proyecto no autorizado', 401, { project_name });
    }

    const project: Project | null = await Project.findOne({ where: { code: project_name }})
    if (!project) {
      throw new HttpError('Proyecto no encontrado', 404)
    }

    const member = await ProjectMember.findOne({
      where: { project_id: project.id, email: loginData.email},
      attributes: ['project_id', 'email', 'role'],
    });

    if (!member) {
      throw new HttpError('Usuario no asignado al proyecto. Pongase en contacto con el soporte', 404, { email: loginData.email, project_code: project.code });
    }

    console.log('==> loginData: ', loginData);
    const loginResponse = await userLoginService(loginData.email, loginData.password);

    console.log('==> loginResponse: ', loginResponse);

    return res.status(200).json({ usuario: loginResponse.usuario, token: loginResponse.token });

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