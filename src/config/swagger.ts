import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

// Define the structure of the Swagger specification
interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths?: {
    [path: string]: any;
  };
  components?: any;
  tags?: any[];
  servers?: any[];
}

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
  // Point to both src and dist routes
  apis: [
    // Source TypeScript files
    path.join(process.cwd(), 'src', 'routes', '**', '*.ts'),
    path.join(process.cwd(), 'src', 'routes', '**', '*.js'),
    // Compiled JavaScript files
    path.join(process.cwd(), 'dist', 'routes', '**', '*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options) as SwaggerSpec;
console.log(JSON.stringify(swaggerSpec, null, 2));

// Log the detected routes to help with debugging
const routeCount = Object.keys(swaggerSpec.paths || {}).length;
console.log(`Swagger detected ${routeCount} API routes`);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Also serve the raw JSON at /swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
