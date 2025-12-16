import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ClientSession } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async execute<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
