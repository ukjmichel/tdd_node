import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../models/user.model';
import config from 'config';

// Load DB config from config module
const dbConfig = config.get<{
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}>('database');

// Initialize Sequelize with values from config
export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.name,
  models: [UserModel],
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .sync()
  .then(() => console.log('✅ Database synced!'))
  .catch((err) => console.error('❌ Error syncing database:', err));
