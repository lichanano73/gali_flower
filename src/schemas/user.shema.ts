import { z } from 'zod';

export const NonSensitiveInfoUserSchema = z.object({
  id:         z.number(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  avatar:     z.string().url().optional().nullable(),
  gender:     z.enum(['Femenino', 'Masculino', 'No binario']).optional(),
  email:      z.string().email(),
  birth:      z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Fecha inválida' }).optional().nullable(),
  contact:    z.string().min(8, { message: 'Número demasiado corto' }).regex(/^[0-9+\-\s()]*$/, { message: 'Formato de número inválido' }).optional().nullable(),
});

// Si tu “UserSchema” base incluye password u otros campos de creación, podés definirlo así:
export const UserCreateSchema = z.object({
  first_name: z.string().min(2),
  email:      z.string().email(),
  password:   z.string().min(6),
  avatar:     z.string().url().optional().nullable(),
  gender:     z.enum(['Femenino', 'Masculino', 'No binario']).optional(),
  birth:      z.string().optional().nullable(),
  contact:    z.string().optional().nullable(),
});

// Para UPDATE: parcial del base, sin campos inmutables como id
export const UserUpdateSchema = UserCreateSchema.partial().omit({ password: true });
// ↑ si permitís cambiar password vía otro endpoint, lo excluís acá. 
// Si querés permitir password en update, quitá el .omit({ password: true })

export type NonSensitiveInfoUser = z.infer<typeof NonSensitiveInfoUserSchema>;
export type UserCreatePayload   = z.infer<typeof UserCreateSchema>;
export type UserUpdatePayload   = z.infer<typeof UserUpdateSchema>;