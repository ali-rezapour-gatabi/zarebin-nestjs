import { Injectable } from '@nestjs/common';
import { ExceptionTrace } from './exeption-trace.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExceptionTraceService {
  constructor(@InjectModel(ExceptionTrace.name) private readonly repository: Model<ExceptionTrace>) {}

  async save(exeption: Partial<ExceptionTrace>): Promise<ExceptionTrace> {
    return this.repository.create(exeption);
  }
}
