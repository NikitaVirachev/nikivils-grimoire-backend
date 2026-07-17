import mongoose from 'mongoose';
import './loadEnv';
import app from './app';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`PID: ${process.pid}`);
});

mongoose
  .connect('mongodb://127.0.0.1:27017/nikivils-grimoire')
  .then(() => console.log('DB connection successful!'))
  .catch((e) => console.error(e));

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
