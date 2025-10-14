// src/models/project.model.ts
import {
  Model,
  DataTypes,
  Optional,
  Sequelize,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { ProjectMember } from './projectMember.model';

export interface ProjectAttributes {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: 'activo' | 'pausado' | 'archivado';
  created_by_email?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type ProjectCreationAttributes = Optional< ProjectAttributes,'id' | 'code' | 'description' | 'status' | 'created_by_email' | 'created_at' | 'updated_at'>;

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: number;
  public code!: string;
  public name!: string;
  public description!: string | null;
  public status!: 'activo' | 'pausado' | 'archivado';
  public created_by_email!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Mixins para la relación hasMany(ProjectMember)
  public getMembers!: HasManyGetAssociationsMixin<ProjectMember>;
  public addMember!: HasManyAddAssociationMixin<ProjectMember, { project_id: number; email: string }>;
  public hasMember!: HasManyHasAssociationMixin<ProjectMember, { project_id: number; email: string }>;
  public countMembers!: HasManyCountAssociationsMixin;
  public createMember!: HasManyCreateAssociationMixin<ProjectMember>;

  public static associations: {
    members: Association<Project, ProjectMember>;
  };

  static initModel(sequelize: Sequelize): typeof Project {
    Project.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          validate: { len: [1, 50] },
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('activo', 'pausado', 'archivado'),
          allowNull: false,
          defaultValue: 'activo',
        },
        created_by_email: {
          type: DataTypes.STRING(320),
          allowNull: true,
          set(value: string | null) {
            this.setDataValue('created_by_email', value ? String(value).trim().toLowerCase() : null);
          },
          validate: {
            isEmailOrNull(value: unknown) {
              if (value == null) return;
              const v = String(value);
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                throw new Error('created_by_email no parece un email válido');
              }
            },
          },
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'projects',
        modelName: 'Project',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      }
    );

    return Project;
  }

  static associate() {
    Project.hasMany(ProjectMember, {
      as: 'members',
      foreignKey: 'project_id',
      sourceKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}
