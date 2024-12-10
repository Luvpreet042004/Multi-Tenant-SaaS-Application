import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import { connectDb, disconnectDb } from './prisma/prismaClient';

dotenv.config();

const app = express();


app.use(express.json());


app.use('/api', routes);

connectDb();

process.on('SIGINT', async () => {
  await disconnectDb();
  process.exit(0);
});


export default app;
