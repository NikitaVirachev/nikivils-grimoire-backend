import { initializeServices } from '@/app/index';
import { connectDatabase, disconnectDatabase } from './config/database';
import env from './config/env';

import app from './app';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

let server: ReturnType<typeof app.listen>;

const shutdown = async () => {
  server.close(async () => {
    try {
      await disconnectDatabase();
      process.exit(0);
    } catch (error) {
      console.error('Shutdown failed:', error);
      process.exit(1);
    }
  });
};

async function start() {
  await connectDatabase(env.DATABASE_URL);

  initializeServices();

  server = app.listen(env.PORT, () => {
    console.log(`App running on port ${env.PORT}...`);
  });

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
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
    shutdown();
  } else {
    process.exit(1);
  }
});
