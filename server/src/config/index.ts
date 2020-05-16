import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || '3333',
  nodeEnv: process.env.NODE_ENV || 'development'
}

export default config;