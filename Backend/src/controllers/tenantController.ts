import { Request, Response } from "express";
import { prisma } from "../prisma/prismaClient"; // Adjust path if necessary
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const createTenantWithAdmin = async (req: Request,res: Response): Promise<void> => {
  
  try {
    const { name, domain, adminEmail, adminPassword } = req.body;
    const existingTenant = await prisma.tenant.findUnique({
      where: { domain },
    });

    if (existingTenant) {
      res.status(400).json({ error: "A tenant with this domain already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

    // Using a transaction to ensure both tenant and admin user are created atomically
    const result = await prisma.$transaction(async (prismaTransaction) => {
      // Create the tenant
      const tenant = await prismaTransaction.tenant.create({
        data: { name, domain },
      });

      // Create the admin user
      const adminUser = await prismaTransaction.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          tenantId: tenant.id,
        },
      });

      const token = jwt.sign(
        { userId: adminUser.id, tenantId: tenant.id, role: adminUser.role },
        JWT_SECRET,
        { expiresIn: "2d" } // Token valid for 2 days
      );

      return { tenant, adminUser , token};
    });

    res.status(201).json({
      message: "Tenant and admin user created successfully",
      tenant: result.tenant,
      adminUser: result.adminUser,
      token : result.token,
    });
  } catch (error) {
    console.error("Error creating tenant with admin:", error);
    res.status(500).json({ error: "An error occurred while creating the tenant." });
  }
};

export const getTenantDetails = async (req: Request, res: Response): Promise<void> => {

  
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'User not authenticated' });
    return
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: { users: true },
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
    }

    res.status(200).json(tenant?.users);
  } catch (error) {
    console.error('Error fetching tenant details:', error);
    res.status(500).json({ error: 'An error occurred while fetching tenant details' });
  }
};