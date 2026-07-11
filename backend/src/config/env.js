import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_VARIABLES = ['MONGODB_URI', 'JWT_SECRET'];

const assertRequiredVariables = () => {
  const missing = REQUIRED_VARIABLES.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno obligatorias: ${missing.join(', ')}`);
  }
};

assertRequiredVariables();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@biblioteca.com',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin1234',
  seedUserEmail: process.env.SEED_USER_EMAIL || 'usuario@biblioteca.com',
  seedUserPassword: process.env.SEED_USER_PASSWORD || 'Usuario1234'
};

export const isProduction = env.nodeEnv === 'production';
