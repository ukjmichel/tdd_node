import express from 'express';
import { setupSwagger } from './config/swagger';
import appRouter from './routes/app';
import { loadEnv } from './config/loadenv';
loadEnv();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// ✅ Swagger
setupSwagger(app);

// ✅ Routes
app.use('/', appRouter);

// ✅ Debug logs
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🧪 TEST_ENV:', process.env.TEST_ENV);
console.log('🧾 DB_HOST:', process.env.DB_HOST);
console.log('🚪 PORT:', port);

// ✅ Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}/`);
});

// ✅ Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Closing server...');
  server.close(() => {
    console.log('✅ Server closed cleanly.');
    process.exit(0);
  });
});
