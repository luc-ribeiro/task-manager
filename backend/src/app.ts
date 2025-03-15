import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/task-routes.ts';
import swaggerUi from 'swagger-ui-express';
import { specs } from '../config/swagger.ts';
import { notFoundHandler, unknownErrorHandler } from './middleware/errors';

const app = express();

app.use(helmet());
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'API is running correctly' });
});

app.use('/tasks', taskRoutes);

app.use(unknownErrorHandler);
app.use(notFoundHandler);

export default app; 