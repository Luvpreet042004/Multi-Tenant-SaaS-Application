import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectDb() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

async function disconnectDb() {
  await prisma.$disconnect();
  console.log("Database disconnected.");
}

export { prisma, connectDb, disconnectDb };
