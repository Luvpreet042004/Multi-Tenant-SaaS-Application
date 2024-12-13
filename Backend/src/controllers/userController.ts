import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
import { Request, Response } from 'express';

const JWT_SECRET= process.env.JWT_SECRET;

export const createUser = async (req: Request, res: Response) : Promise<void> => {
  const { email, password ,tenantId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user";

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        tenantId,
      },
    });

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId, role: user.role },JWT_SECRET,{ expiresIn: '20 days' }
    );

    
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response) : Promise <any> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId, role: user.role },JWT_SECRET,{ expiresIn: '2 days' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};


export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  const id  = req.user?.id; // Assuming `req.user` contains authenticated user info.
  

  try {
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if old password matches
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Old password is incorrect" });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "An error occurred while changing the password" });
  }
};

export const deleteUser = async(req : Request, res : Response): Promise<void> => {
  const {userId} = req.body;
  const admin = req.user;

  try {
    
    if(!admin || !userId){
      res.status(404).json({ error: 'User or Admin not found' });
      return;
    }

    await prisma.user.delete({
      where :{
        id : userId,
        tenantId : admin.tenantId
      }
    })

    res.status(200).json({ message: "User Deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while deleting user" });
  }
}