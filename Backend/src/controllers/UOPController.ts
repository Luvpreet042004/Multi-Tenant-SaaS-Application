import { Request, Response } from "express";
import { prisma } from "../prisma/prismaClient"; // Update with your actual Prisma client import

export const addUsersToProject = async (req: Request, res: Response): Promise<void> => {
    const { projectId, userIds } = req.body; // Expect projectId and an array of userIds
    const admin = req.user;

  
  if (!admin) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const tenantId = admin?.tenantId;

    try {
        const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });

        if (!project) {
            res.status(404).json({ error: "Project not found" });
            return;
        }

        const addedUsers = await prisma.userOnProject.createMany({
            data: userIds.map((userId: number) => ({
                userId,
                projectId: Number(projectId),
                tenantId
            })),
            skipDuplicates: true, 
        });

        res.status(201).json({ message: "Users added to the project successfully", addedUsers });
    } catch (error) {
        console.error("Error adding users to project:", error);
        res.status(500).json({ error: "An error occurred while adding users to the project" });
    }
};

export const deleteUserFromProject = async (req: Request, res: Response): Promise<void> => {
    const { projectId, userId } = req.params;
    

    try {
        const userOnProject = await prisma.userOnProject.findFirst({
            where: { userId: Number(userId), projectId: Number(projectId) },
        });

        if (!userOnProject) {
            res.status(404).json({ error: "User not found on the specified project" });
            return;
        }

        await prisma.userOnProject.delete({
            where: { id: userOnProject.id },
        });

        res.status(200).json({ message: "User removed from the project successfully" });
    } catch (error) {
        console.error("Error removing user from project:", error);
        res.status(500).json({ error: "An error occurred while removing the user from the project" });
    }
};


export const getUsersOnProject = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;

    try {
        const usersOnProject = await prisma.userOnProject.findMany({
            where: { projectId: Number(projectId) },
            include: { user: true }, // Include full user details
        });

        if (!usersOnProject || usersOnProject.length === 0) {
            res.status(404).json({ error: "No users found on the specified project" });
            return;
        }

        res.status(200).json({ users: usersOnProject });
    } catch (error) {
        console.error("Error fetching users on project:", error);
        res.status(500).json({ error: "An error occurred while fetching users on the project" });
    }
};
