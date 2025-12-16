import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'exception_trace', timestamps: true })
export class ExceptionTrace {
  @Prop()
  method?: string;

  @Prop()
  path?: string;

  @Prop()
  status?: number;

  @Prop()
  type?: string;

  @Prop()
  message?: string;

  @Prop()
  stack?: string;

  @Prop({ type: Object })
  context?: Record<string, any>;
}

export const ExceptionTraceSchema = SchemaFactory.createForClass(ExceptionTrace);
