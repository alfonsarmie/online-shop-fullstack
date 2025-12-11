import { Sequelize } from 'sequelize';

export const db = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USERNAME || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true
      }
    }
  }
);

export const connectDB = async () => {
  try {
    await db.authenticate();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Could not connect to database:', error);
  }
};

export default db;

