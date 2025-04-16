require('ts-node').register();

const { loadEnv } = require('./src/config/loadenv.ts');

// ✅ Load env vars based on NODE_ENV
loadEnv();

// ✅ Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  setTimeout(() => {
    console.log('✅ Clean exit from PM2 wrapper');
    process.exit(0);
  }, 5000);
});

// ✅ Start your app
require('./src/server.ts');
