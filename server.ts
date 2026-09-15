import mongoose from 'mongoose';

import './loadEnv';

import app from './app';

import { initializeServices } from './container';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

const port = process.env.PORT || 3000;

let server: ReturnType<typeof app.listen>;

async function start() {
  await mongoose.connect('mongodb://127.0.0.1:27017/nikivils-grimoire');

  console.log('DB connection successful!');

  initializeServices();

  server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
}

start().catch((err: Error) => {
  console.error('Failed to start application');
  console.error(err);

  process.exit(1);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
  console.log(err.name, err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
