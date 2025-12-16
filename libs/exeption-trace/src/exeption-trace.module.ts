import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExceptionTrace, ExceptionTraceSchema } from './exeption-trace.schema';
import { ExceptionTraceService } from './exeption-trace.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ExceptionTrace.name, schema: ExceptionTraceSchema }])],
  providers: [ExceptionTraceService],
  exports: [ExceptionTraceService],
})
export class ExeptionTraceModule {}
