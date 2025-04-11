import express from 'express';
import { setupSwagger } from './config/swagger';
import appRouter from './routes/appRouter';

const app = express();
const port = 3000;


setupSwagger(app);

app.use('/', appRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});

