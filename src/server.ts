import express, { Request, Response } from 'express';
import { setupSwagger } from './config/swagger';
import appRouter from './routes/appRouter';

const app = express();
const port = 3000;
setupSwagger(app);

app.use('/', appRouter);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
