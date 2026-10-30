import mongoose from 'mongoose';

import type { TransactionManager } from '../application/ports/transactionManager.port';

class MongooseTransactionManager implements TransactionManager {
  async run<T>(operation: () => Promise<T>): Promise<T> {
    return mongoose.connection.transaction(async () => operation());
  }
}

export default MongooseTransactionManager;
