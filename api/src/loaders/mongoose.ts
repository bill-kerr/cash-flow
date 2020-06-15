import mongoose from 'mongoose';
import config from '../config';

async function initMongoose() {
  await mongoose.connect(config.mongodbUri!, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  console.log('Connected to MongoDB.');
}

export { initMongoose };