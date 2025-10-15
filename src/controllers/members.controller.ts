// src/controllers/members.controller.ts
import { RequestHandler } from "express";
import { HttpError, QuerySchema } from "../types";
import { getUsersService } from "../services/ws_users.service";
import { QueryParams } from "../types"


/* 3.1 */
export const getUsers: RequestHandler = async (req, res) => {
  console.log('\x1b[33m%s\x1b[0m', '==> getUsers');

  try {
    
    const parsed = QuerySchema.safeParse(req.query);
    console.log("Parsed:", parsed);

    if (!parsed.success) {
      throw new HttpError('Error al validar el esquema', 400, parsed.error.issues);
    }

    const query:QueryParams = parsed.data;
    const token = req.headers.authorization?.split(' ')[1] || '';

    if (!token) {
      throw new HttpError('Token no proporcionado', 401);
    }
    
    const users = await getUsersService(token, query);
    
    return res.status(200).json(users);

  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.status ?? 500).json({
        message: err.message,
        error: err.payload ?? null,
      });
    }
    return res.status(500).json({ message: 'Error getUsers', error: err });
  }
};



/* 3.2 */
export const createUser:RequestHandler = async (_req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.1 getAllProjects');
    try {
        
        return res.status(200).json({"projects": 'Hola mundo'});
        
    } catch (err: unknown) {

        if (err instanceof HttpError) {
            return res.status(err.status ?? 500).json({
                message: err.message,
                error: err.payload ?? null,
            });
        }
        
        return res.status(500).json({ message: 'Error getAllProjects', error: err });
    }       

};  