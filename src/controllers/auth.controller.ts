import { RequestHandler } from 'express';
import { LoginSchema } from '../schemas/auth.schema';
import { HttpError } from '../types';

import config from '../config/config';

import { userLoginService } from '../services/ws_users.service';
import jwt from "jsonwebtoken";

export const login: RequestHandler = async (req, res) => {

  try {

    const  validator = LoginSchema.safeParse(req.body)

    if (!validator.success) {
      throw new HttpError('Error al validar el esquema', 400, validator.error.issues);
    }

    const loginData = validator.data;
    const loginResponse = await userLoginService(loginData.email, loginData.password);
    const user_result = loginResponse.usuario;

    const token_generate = jwt.sign({ id: user_result.id, email: user_result.email }, config.jwt_secret, { expiresIn: '24h' });

    console.log('==> Nuevo login: ', loginResponse.usuario.email);

    return res.status(200).json({ usuario: loginResponse.usuario, token: token_generate });

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