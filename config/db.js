import { Sequelize } from 'sequelize';

// Database configuration
const sequelize = new Sequelize('iinms', 'iinms_admin', 'iinms@#975', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
});

// Test connection
try {
  await sequelize.authenticate();
  console.log('Database connected...');
} catch (err) {
  console.error('Error connecting to database:', err);
}

// Export the Sequelize instance
export default sequelize;
