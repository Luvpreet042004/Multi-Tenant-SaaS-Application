import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();


export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, description, deadline } = req.body;
  const admin = req.user;
  const tenantId = admin?.tenantId;
  

  if(!tenantId) {
    res.status(401).json({ error: 'Admin Id not correct' });
    return;
  }

  try {
    const status = "Active";
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;  
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        deadline: new Date(deadline),
        tenantId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'An error occurred while creating the project' });
  }
};


export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const admin = req.user;
  const tenantId = admin?.tenantId;
  const { projectId } = req.params;

  try {
    // Check if the project exists
    const project = await prisma.project.findUnique({ where: { id: Number(projectId),tenantId} });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.delete({ where: { id: Number(projectId) } });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'An error occurred while deleting the project' });
  }
};

export const editProject = async (req: Request, res: Response): Promise<void> => {
    const admin = req.user;
    const tenantId = admin?.tenantId;
  const { projectId } = req.params;
  const { name, description, status, deadline } = req.body;

  if(!tenantId) {
    res.status(401).json({ error: 'Admin Id not correct' });
    return;
  }

  try {
    const project = await prisma.project.findUnique({ where: { id: Number(projectId),tenantId } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updatedProject = await prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        name,
        description,
        status,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });

    res.status(200).json({updatedProject,msg : "Project Updated successfully"});
  } catch (error) {
    console.error('Error editing project:', error);
    res.status(500).json({ error: 'An error occurred while editing the project' });
  }
};


export const getProject = async(req: Request, res: Response) : Promise<void> => {
    const {id} = req.params;
    const user = req.user;
    const tenantId = user?.tenantId

    if (!tenantId) {
        res.status(401).json({ error: 'TenantId not authenticated' });
        return;
      }
    
    try {
        const project = await prisma.project.findUnique({
            where : {id : Number(id)}
        })

        if(project?.tenantId != tenantId) {
            throw new Error("Project not found")
        }
        
        res.status(200).json({ project: project})
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'An error occurred while fetching project.' });
    }
}