import { RequestHandler } from 'express';
import { Project } from '../models/project.model';
import { ProjectMember } from '../models/projectMember.model';
import * as prjSch from '../schemas/projects.schema';

/* 2.1 */
export const getAllProjects:RequestHandler = async (_req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.1 getAllProjects');
    try {
        
        const projects = await Project.findAll({
            include: [{ association: 'members' }],
        });
        
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving projects', error });
    }       

};  

/* 2.2 */
export const getProjectById:RequestHandler = async (req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.2 getProjectById');
    const { id } = req.params;
    console.log('\x1b[33m%s\x1b[0m', '==> Project ID:', id);
    try {   
        const project: Project | null =  await Project.findByPk( id, {
            include: [{ association: 'members' }],
        });
        if (!project) throw { message: 'Project not found'}  
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving project', error });
    }   
};

/* 2.3 */
export const createProject:RequestHandler = async (req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.3 createProject');
    const projectData: Project = req.body;
    try {   

        // Validar con Zod
        const validator = prjSch.ProjectSchema.safeParse(projectData);
        if (!validator.success) throw {
            message: 'Ocurrió un error al validar el esquema',
            details: validator.error.issues,
        } 
        
        projectData.created_by_email = res.locals.user.email;
        const newProject: Project = await Project.create(projectData);

        return res.status(201).json(newProject);
    } catch (error) {   
        return res.status(500).json({ message: 'Error creating project', error });
    }   

};

/* 2.4 */
export const updateProject:RequestHandler = async (req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.4 updateProject');    
    const { id } = req.params;
    console.log('\x1b[33m%s\x1b[0m', '==> Project ID:', id);
    try {

        const validator = prjSch.ProjectUpdateSchema.safeParse(req.body);
        if (!validator.success) throw {
            message: 'Ocurrió un error al validar el esquema',
            details: validator.error.issues,
        };

        const myProject: Project | null = await Project.findByPk(id);        
        if (!myProject) throw { message: 'Project not found' }

        await myProject.update(validator.data);

        return res.status(200).json(myProject);
        
    } catch (error) {
        return res.status(500).json({ message: 'Error updating project', error });
    }   

};  

/* 2.5 */
export const deleteProject:RequestHandler = async (req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.5 deleteProject');
    const { id } = req.params;   
    console.log('\x1b[33m%s\x1b[0m', '==> Delete project ID:', id);   
    try {

        const deleted: boolean =  await Project.destroy({ where: { id } }) > 0 ;   
        if (!deleted) throw { message: 'Project not found'}

        return res.status(200).json({ message: 'Project deleted successfully'});   
    } catch (error) {   
        return res.status(500).json({ message: 'Error deleting project', error });
    }
};

/* 2.6 */  
export const addMemberToProject:RequestHandler = async (req, res) => {
    console.log('\x1b[33m%s\x1b[0m', '==> 2.6 addMemberToProject');
    const { id } = req.params;
    try {   
        const validator = prjSch.MemberSchema.safeParse(req.body);

        if (!validator.success) throw {
            message: 'Ocurrió un error al validar el esquema',
            details: validator.error.issues,
        }
        const { email, role } = validator.data;

        console.log('==> Adding member to project:', id, email, role);
        const project: Project | null =  await Project.findByPk(id);        
        if (!project) throw { message: 'Project not found' };  

        // evitar duplicados
        const existing = await ProjectMember.findOne({
            where: { project_id: project.id, email: email.trim().toLowerCase() },
        });

        if (existing) throw { message: 'El usuario ya es miembro de este proyecto' };

        const newMember = await ProjectMember.create({
            project_id: project.id, email, role,
        });
        return res.status(201).json(newMember);
    } catch (error) {   
        return res.status(500).json({ message: 'Error adding member to project', error });
    }
};