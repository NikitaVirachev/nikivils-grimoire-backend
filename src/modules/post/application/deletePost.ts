import type { TransactionManager } from '@/shared/application/ports/transactionManager.port';

export interface DeletePostDependencies {
  deletePostById(id: string): Promise<void>;

  deleteCommentsByPostId(postId: string): Promise<void>;
}

export class DeletePost {
  private readonly transaction: TransactionManager;

  private readonly dependencies: DeletePostDependencies;

  constructor(transaction: TransactionManager, dependencies: DeletePostDependencies) {
    this.transaction = transaction;
    this.dependencies = dependencies;
  }

  async execute(postId: string): Promise<void> {
    await this.transaction.run(async () => {
      await this.dependencies.deleteCommentsByPostId(postId);
      await this.dependencies.deletePostById(postId);
    });
  }
}
