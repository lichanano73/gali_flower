import sequelize from '../config/database';
import { Project } from './project.model';
import { ProjectMember } from './projectMember.model';

export function initModels() {
  // 1) init
  Project.initModel(sequelize);
  ProjectMember.initModel(sequelize);

  // 2) asociaciones
  Project.associate();
  ProjectMember.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
}

// Opcional en dev: sincronizar
export async function syncDev({ alter = false } = {}) {
  await sequelize.sync({ alter });
}