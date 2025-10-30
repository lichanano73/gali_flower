
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT:         z.string().min(1).default('8000'),
  PRJ_NAME:     z.string().min(1),
  URL_WS_USERS: z.string().url(),
  DB_HOST:      z.string().min(1),
  DB_PORT:      z.string().regex(/^\d+$/).default('3306'),
  DB_NAME:      z.string().min(1),
  DB_USER:      z.string().min(1),
  DB_PASS:      z.string().min(1),
  JWT_SECRET:   z.string().min(6),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Error validando variables de entorno:', parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;

export default {
  
  port:     Number(env.PORT),
  url_ws_users: env.URL_WS_USERS,
  db: {
    host:   env.DB_HOST,
    port:   Number(env.DB_PORT),
    name:   env.DB_NAME,
    user:   env.DB_USER,
    pass:   env.DB_PASS,
  },
  jwt_secret: env.JWT_SECRET,
  prj_name:  env.PRJ_NAME,
};