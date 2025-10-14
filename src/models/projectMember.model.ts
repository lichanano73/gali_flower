// src/models/projectMember.model.ts
import { Model, DataTypes, Sequelize, Optional, BelongsToGetAssociationMixin } from 'sequelize';
import { Project } from './project.model';

export interface ProjectMemberAttributes {
  project_id: number;
  email: string;
  role: string;
  added_at?: Date;
}

export type ProjectMemberCreationAttributes = Optional<ProjectMemberAttributes, 'role' | 'added_at'>;

export class ProjectMember
  extends Model<ProjectMemberAttributes, ProjectMemberCreationAttributes>
  implements ProjectMemberAttributes
{
  public project_id!: number;
  public email!: string;
  public role!: string;
  public readonly added_at!: Date;

  // Acceso a proyecto (belongsTo)
  public getProject!: BelongsToGetAssociationMixin<Project>;

  static initModel(sequelize: Sequelize): typeof ProjectMember {
    ProjectMember.init(
      {
        project_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(320),
          allowNull: false,
          primaryKey: true,
          set(value: string) {
            this.setDataValue('email', String(value).trim().toLowerCase());
          },
          validate: { isEmail: true },
        },
        role: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: 'member',
        },
        added_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'project_members',
        modelName: 'ProjectMember',
        timestamps: false,
        underscored: true,
      }
    );

    return ProjectMember;
  }

  static associate() {
    ProjectMember.belongsTo(Project, {
      as: 'project',
      foreignKey: 'project_id',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}
