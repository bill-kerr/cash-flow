import dotenv from 'dotenv';
dotenv.config();

checkRequiredConfigVariables();

const config = {
  port: process.env.PORT || '3333',
  nodeEnv: process.env.NODE_ENV || 'development',

  jwtSecretKey: process.env.JWT_KEY,

  mongodbUri: process.env.MONGODB_URI,

  firebaseDatabaseUrl: process.env.FIREBASE_DB_URL
}

function checkRequiredConfigVariables() {
  try {
    if (
      !process.env.JWT_KEY ||
      !process.env.MONGODB_URI ||
      !process.env.FIREBASE_DB_URL
    ) {
      throw new Error('Please make sure all required environmental variables are defined in a .env file at the root of the project.');
    }
  } catch (err) {
    console.error(err);
    console.log('Server shutting down.');
    process.exit();
  }
}

export default config;