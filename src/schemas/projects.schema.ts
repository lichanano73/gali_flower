// src/schemas/project.schema.ts
import { z } from 'zod';

export const ProjectSchema = z.object({
  code: z.string().max(50).optional().nullable(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional().nullable(),
  status: z.enum(['activo', 'pausado', 'archivado']).default('activo'),
  created_by_email: z.string().email('Debe ser un email válido').optional().nullable(),
});

export const MemberSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  role: z.string().min(1, 'El rol es obligatorio').default('member'),
});

export const ProjectUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().nullable().transform(v => v ?? undefined),
  status: z.enum(['activo', 'pausado', 'archivado']),
}).strict();