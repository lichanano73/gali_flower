import { RequestHandler } from 'express';
import { HttpError } from '../../types';

//import { Project } from '../../models/project.model';
//import { ProjectMember } from '../../models/projectMember.model';
//import * as prjSch from '../../schemas/projects.schema';
import * as ws_users from '../../services/ws_users.service';
import {NonSensitiveInfoUserSchema, UserUpdatePayload } from '../../schemas/user.shema';

const UpdateUserSchema = NonSensitiveInfoUserSchema.partial(); // todos opcionales
export const clientUpdateUser: RequestHandler = async (req, res) => {
    try {

        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) return res.status(400).json({ error: 'ID inválido' });

        const parsed = UpdateUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Ocurrió un error al validar el esquema',
                details: parsed.error,
            });
        }

        const updateData = parsed.data;

        console.log(updateData)

        const updatedUser:UserUpdatePayload = await ws_users.userUpdateService(userId, updateData, res.locals.user.tokenClient);

        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });

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