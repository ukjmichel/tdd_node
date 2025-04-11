import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

// Current directory is src/config based on logs
console.log('Current directory:', __dirname);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Documentation of My API',
    },
  },
  // Point directly to src/routes from the project root
  apis: [
    path.join(process.cwd(), 'src', 'routes', '**', '*.ts'),
    path.join(process.cwd(), 'src', 'routes', '**', '*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2));

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
