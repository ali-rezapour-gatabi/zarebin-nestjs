import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  code: string;

  @Prop({
    required: true,
    expires: 120,
  })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
