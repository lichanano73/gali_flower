import { Sequelize } from 'sequelize';
import config from './config';

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql', 
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión Database: ${config.db.name}`);
  } catch (err: any) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  }
};

export default sequelize;